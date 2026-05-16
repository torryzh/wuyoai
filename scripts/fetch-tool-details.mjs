#!/usr/bin/env node

/**
 * 工具详情收集脚本
 *
 * 用法：
 *   node scripts/fetch-tool-details.mjs                    # 自动判断更新范围
 *   node scripts/fetch-tool-details.mjs --tools chatgpt,claude  # 指定工具
 *   node scripts/fetch-tool-details.mjs --category code    # 指定分类
 *   node scripts/fetch-tool-details.mjs --force            # 强制更新所有
 *   node scripts/fetch-tool-details.mjs --dry-run          # 只显示范围，不执行
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TOOLS_FILE = join(ROOT, 'data', 'tools.json');
const DETAILS_DIR = join(ROOT, 'data', 'tool-details');
const RAW_DIR = join(ROOT, 'data', 'tool-raw');
const FETCH_DELAY = 2000;

// 解析命令行参数
const args = process.argv.slice(2);
const forceMode = args.includes('--force');
const dryRun = args.includes('--dry-run');
const toolsArg = args.includes('--tools') ? args[args.indexOf('--tools') + 1] : null;
const categoryArg = args.includes('--category') ? args[args.indexOf('--category') + 1] : null;

// 确保目录存在
if (!existsSync(DETAILS_DIR)) mkdirSync(DETAILS_DIR, { recursive: true });
if (!existsSync(RAW_DIR)) mkdirSync(RAW_DIR, { recursive: true });

// 读取工具列表
const tools = JSON.parse(readFileSync(TOOLS_FILE, 'utf-8'));

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 获取网页内容
 */
async function fetchWebpage(url, timeout = 10000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      },
      redirect: 'follow'
    });
    clearTimeout(timer);
    if (res.ok) {
      const html = await res.text();
      return html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 10000);
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * 从多个来源收集信息
 */
async function collectSources(tool) {
  const collected = [];

  // 优先级1：官网
  console.log(`   📡 官网: ${tool.url}`);
  const official = await fetchWebpage(tool.url);
  if (official && official.length > 200) {
    collected.push({ source: 'official', url: tool.url, content: official });
  }

  // 优先级2：百度百科
  const baikeUrl = `https://baike.baidu.com/item/${encodeURIComponent(tool.name.zh)}`;
  console.log(`   📡 百度百科: ${baikeUrl}`);
  const baike = await fetchWebpage(baikeUrl);
  if (baike && baike.length > 200) {
    collected.push({ source: 'baike', url: baikeUrl, content: baike });
  }

  // 优先级3：Toolify.ai
  const toolifyUrl = `https://www.toolify.ai/tool/${tool.id}`;
  console.log(`   📡 Toolify: ${toolifyUrl}`);
  const toolify = await fetchWebpage(toolifyUrl);
  if (toolify && toolify.length > 200) {
    collected.push({ source: 'toolify', url: toolifyUrl, content: toolify });
  }

  // 优先级4：There's an AI for that
  const taaftUrl = `https://theresanaiforthat.com/s/${encodeURIComponent(tool.name.en || tool.name.zh)}/`;
  console.log(`   📡 TAAFT: ${taaftUrl}`);
  const taaft = await fetchWebpage(taaftUrl);
  if (taaft && taaft.length > 200) {
    collected.push({ source: 'taaft', url: taaftUrl, content: taaft });
  }

  // 优先级5：Bing 搜索（兜底）
  if (collected.length === 0) {
    const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(tool.name.zh + ' AI工具 介绍')}`;
    console.log(`   📡 Bing: ${bingUrl}`);
    const bing = await fetchWebpage(bingUrl);
    if (bing && bing.length > 200) {
      collected.push({ source: 'bing', url: bingUrl, content: bing });
    }
  }

  return collected;
}

/**
 * 分析更新范围
 */
function analyzeUpdateScope() {
  const results = {
    newTools: [],      // 无详情文件
    lowQuality: [],    // 置信度 medium/low
    emptyRaw: [],      // 原始内容为空
    stable: [],        // 置信度 high，内容稳定
    recent: [],        // 7 天内已更新
  };

  for (const tool of tools) {
    const detailFile = join(DETAILS_DIR, `${tool.id}.json`);
    const rawFile = join(RAW_DIR, `${tool.id}.json`);

    // 检查是否有详情文件
    if (!existsSync(detailFile)) {
      results.newTools.push(tool);
      continue;
    }

    // 检查详情质量
    const detail = JSON.parse(readFileSync(detailFile, 'utf-8'));
    if (detail.confidence !== 'high') {
      results.lowQuality.push({ ...tool, confidence: detail.confidence });
      continue;
    }

    // 检查原始内容
    if (!existsSync(rawFile)) {
      results.emptyRaw.push(tool);
      continue;
    }

    // 检查是否超过 7 天
    const fetchedAt = new Date(detail.fetchedAt);
    const daysSinceFetch = (Date.now() - fetchedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceFetch > 7) {
      // 置信度 high + 超过 7 天 → 内容稳定，跳过
      results.stable.push(tool);
    } else {
      results.recent.push(tool);
    }
  }

  return results;
}

/**
 * 显示更新范围
 */
function showUpdateScope(scope) {
  console.log('\n📊 更新范围分析：\n');

  const needProcess = [...scope.newTools, ...scope.lowQuality, ...scope.emptyRaw];
  const skipCount = scope.stable.length + scope.recent.length;

  console.log(`需要处理：${needProcess.length} 个工具`);
  if (scope.newTools.length > 0) console.log(`├─ 新增：${scope.newTools.length} 个（无详情文件）`);
  if (scope.lowQuality.length > 0) console.log(`├─ 低质量：${scope.lowQuality.length} 个（置信度 medium/low）`);
  if (scope.emptyRaw.length > 0) console.log(`└─ 重新收集：${scope.emptyRaw.length} 个（原始内容为空）`);

  console.log(`\n跳过：${skipCount} 个工具`);
  if (scope.stable.length > 0) console.log(`├─ 内容稳定：${scope.stable.length} 个（置信度 high，无需更新）`);
  if (scope.recent.length > 0) console.log(`└─ 最近更新：${scope.recent.length} 个（7 天内已处理）`);

  if (needProcess.length > 0) {
    console.log('\n待处理工具：');
    needProcess.forEach((tool, i) => {
      const reason = scope.newTools.includes(tool) ? '新增' :
                     scope.lowQuality.find(t => t.id === tool.id) ? `置信度 ${scope.lowQuality.find(t => t.id === tool.id).confidence}` :
                     '原始内容为空';
      console.log(`  ${i + 1}. ${tool.id} (${tool.name.zh}) - ${reason}`);
    });
  }

  return needProcess;
}

/**
 * 处理单个工具
 */
async function processTool(tool) {
  const rawFile = join(RAW_DIR, `${tool.id}.json`);

  console.log(`\n🔍 收集: ${tool.id} (${tool.name.zh})`);

  // 收集来源
  const collected = await collectSources(tool);
  console.log(`   找到 ${collected.length} 个来源`);

  if (collected.length === 0) {
    console.log(`   ⚠  无可用来源，跳过`);
    return 'no_sources';
  }

  // 保存原始内容
  const rawData = {
    id: tool.id,
    name: tool.name,
    url: tool.url,
    collectedAt: new Date().toISOString(),
    sources: collected
  };
  writeFileSync(rawFile, JSON.stringify(rawData, null, 2) + '\n');
  console.log(`   ✅ 原始内容已保存`);

  return 'success';
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 工具详情收集脚本启动');
  console.log(`模式: ${forceMode ? '强制更新' : dryRun ? '仅分析' : '智能判断'}`);

  // 确定目标工具
  let targetTools = tools;

  // 按指定工具过滤
  if (toolsArg) {
    const toolIds = toolsArg.split(',');
    targetTools = tools.filter(t => toolIds.includes(t.id));
    console.log(`指定工具: ${toolIds.join(', ')}`);
  }

  // 按分类过滤
  if (categoryArg) {
    targetTools = tools.filter(t => t.categories.includes(categoryArg));
    console.log(`指定分类: ${categoryArg}`);
  }

  // 分析更新范围
  const scope = analyzeUpdateScope();

  // 如果指定了工具，直接处理
  if (toolsArg || categoryArg) {
    const needProcess = targetTools.filter(t => {
      const detailFile = join(DETAILS_DIR, `${t.id}.json`);
      if (!existsSync(detailFile)) return true;
      if (forceMode) return true;
      const detail = JSON.parse(readFileSync(detailFile, 'utf-8'));
      return detail.confidence !== 'high';
    });

    if (needProcess.length === 0) {
      console.log('\n✅ 所有指定工具已有高质量详情');
      return;
    }

    console.log(`\n📊 待处理：${needProcess.length} 个工具\n`);
    needProcess.forEach((tool, i) => {
      console.log(`  ${i + 1}. ${tool.id} (${tool.name.zh})`);
    });

    if (dryRun) {
      console.log('\n🔍 仅分析模式，不执行处理');
      return;
    }

    // 处理工具
    const results = { success: 0, no_sources: 0 };
    for (const tool of needProcess) {
      const status = await processTool(tool);
      results[status] = (results[status] || 0) + 1;
      if (status === 'success') await delay(FETCH_DELAY);
    }

    console.log('\n📊 处理完成:');
    console.log(`   成功: ${results.success}`);
    console.log(`   无来源: ${results.no_sources}`);
    return;
  }

  // 智能判断模式
  const needProcess = showUpdateScope(scope);

  if (needProcess.length === 0) {
    console.log('\n✅ 所有工具已有高质量详情，无需更新');
    return;
  }

  if (dryRun) {
    console.log('\n🔍 仅分析模式，不执行处理');
    return;
  }

  // 处理工具
  const results = { success: 0, no_sources: 0 };
  for (const tool of needProcess) {
    const status = await processTool(tool);
    results[status] = (results[status] || 0) + 1;
    if (status === 'success') await delay(FETCH_DELAY);
  }

  console.log('\n📊 处理完成:');
  console.log(`   成功: ${results.success}`);
  console.log(`   无来源: ${results.no_sources}`);
}

main().catch(console.error);
