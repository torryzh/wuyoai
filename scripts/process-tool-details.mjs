#!/usr/bin/env node

/**
 * 工具详情处理脚本
 *
 * 基于收集的原始内容，生成结构化详情文件
 *
 * 用法：
 *   node scripts/process-tool-details.mjs              # 处理所有工具
 *   node scripts/process-tool-details.mjs --test chatgpt  # 测试单个工具
 *   node scripts/process-tool-details.mjs --force        # 强制重新处理
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TOOLS_FILE = join(ROOT, 'data', 'tools.json');
const RAW_DIR = join(ROOT, 'data', 'tool-raw');
const DETAILS_DIR = join(ROOT, 'data', 'tool-details');

// 解析命令行参数
const args = process.argv.slice(2);
const testMode = args.includes('--test');
const forceMode = args.includes('--force');
const testId = testMode ? args[args.indexOf('--test') + 1] : null;

// 读取工具列表
const tools = JSON.parse(readFileSync(TOOLS_FILE, 'utf-8'));

/**
 * 从原始内容中提取关键信息
 */
function extractFromRaw(rawContent, tool) {
  const content = rawContent.toLowerCase();
  const original = rawContent;

  // 提取描述（使用原始内容的前500字作为基础）
  let description = '';
  const descMatch = original.match(/(?:是|为|属于|指的是|定义)[，,：:]?(.{50,300})/);
  if (descMatch) {
    description = descMatch[1].replace(/\[\d+\]/g, '').trim();
  }

  // 提取功能特性
  const features = [];
  const featureKeywords = ['功能', '特性', '能力', '支持', '可以', '能够', '用于'];
  for (const keyword of featureKeywords) {
    const regex = new RegExp(keyword + '[，,：:]?(.{20,100})', 'g');
    let match;
    while ((match = regex.exec(original)) !== null) {
      const feature = match[1].replace(/\[\d+\]/g, '').trim();
      if (feature.length > 10 && feature.length < 100) {
        features.push(feature);
      }
    }
  }

  // 提取价格信息
  let pricing = { free: '', plans: [] };
  const priceMatch = original.match(/(?:价格|定价|费用|订阅|会员)[，,：:]?(.{20,200})/);
  if (priceMatch) {
    pricing.free = priceMatch[1].replace(/\[\d+\]/g, '').trim();
  }

  // 提取优缺点
  const pros = [];
  const cons = [];
  const proKeywords = ['优势', '优点', '好处', '亮点'];
  const conKeywords = ['劣势', '缺点', '不足', '局限'];

  for (const keyword of proKeywords) {
    const regex = new RegExp(keyword + '[，,：:]?(.{20,100})', 'g');
    let match;
    while ((match = regex.exec(original)) !== null) {
      const pro = match[1].replace(/\[\d+\]/g, '').trim();
      if (pro.length > 5) pros.push(pro);
    }
  }

  for (const keyword of conKeywords) {
    const regex = new RegExp(keyword + '[，,：:]?(.{20,100})', 'g');
    let match;
    while ((match = regex.exec(original)) !== null) {
      const con = match[1].replace(/\[\d+\]/g, '').trim();
      if (con.length > 5) cons.push(con);
    }
  }

  return {
    description: description || tool.description.zh,
    features: features.slice(0, 6),
    pricing,
    pros: pros.slice(0, 4),
    cons: cons.slice(0, 4),
    difficulty: 'medium',
    difficultyNote: '需要一定的学习成本',
    useCases: tool.categories.map(cat => {
      const categoryNames = {
        chat: '对话问答',
        writing: '文案写作',
        image: '图像生成',
        video: '视频制作',
        audio: '音频处理',
        code: '编程开发',
        office: '办公效率',
        search: '搜索研究',
        education: '学习教育',
        design: '设计创作',
        tools: '效率工具',
        research: '学术研究'
      };
      return categoryNames[cat] || cat;
    })
  };
}

/**
 * 处理单个工具
 */
function processTool(tool) {
  const rawFile = join(RAW_DIR, `${tool.id}.json`);
  const detailFile = join(DETAILS_DIR, `${tool.id}.json`);

  // 检查是否已有详情文件
  if (!forceMode && existsSync(detailFile)) {
    const existing = JSON.parse(readFileSync(detailFile, 'utf-8'));
    if (existing.confidence === 'high') {
      console.log(`⏭  ${tool.id}: 跳过（已有高质量详情）`);
      return 'skipped';
    }
  }

  // 检查是否有原始内容
  if (!existsSync(rawFile)) {
    console.log(`⚠  ${tool.id}: 无原始内容`);
    return 'no_raw';
  }

  const rawData = JSON.parse(readFileSync(rawFile, 'utf-8'));

  // 检查内容质量
  const totalLength = rawData.sources.reduce((sum, s) => sum + s.content.length, 0);
  if (totalLength < 200) {
    console.log(`⚠  ${tool.id}: 内容太少 (${totalLength} chars)`);
    return 'insufficient';
  }

  // 提取信息
  const allContent = rawData.sources.map(s => s.content).join('\n');
  const extracted = extractFromRaw(allContent, tool);

  // 生成详情文件
  const detail = {
    id: tool.id,
    fetchedAt: rawData.collectedAt,
    sources: rawData.sources.map(s => s.url),
    confidence: 'medium',
    description: extracted.description,
    features: extracted.features.map(f => ({
      name: f.substring(0, 20),
      desc: f,
      confidence: 'medium',
      source: rawData.sources[0]?.source || 'unknown'
    })),
    pricing: extracted.pricing,
    pros: extracted.pros,
    cons: extracted.cons,
    difficulty: extracted.difficulty,
    difficultyNote: extracted.difficultyNote,
    useCases: extracted.useCases,
    needsReview: ['description', 'features', 'pricing', 'pros', 'cons']
  };

  writeFileSync(detailFile, JSON.stringify(detail, null, 2) + '\n');
  console.log(`✅ ${tool.id}: 已生成详情`);
  return 'success';
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 工具详情处理脚本启动');
  console.log(`模式: ${testMode ? `测试 (${testId})` : '批量'}`);
  console.log('');

  let targetTools = tools;
  if (testMode && testId) {
    targetTools = tools.filter(t => t.id === testId);
    if (targetTools.length === 0) {
      console.error(`❌ 找不到工具: ${testId}`);
      process.exit(1);
    }
  }

  const results = { success: 0, skipped: 0, no_raw: 0, insufficient: 0 };

  for (const tool of targetTools) {
    const status = processTool(tool);
    results[status] = (results[status] || 0) + 1;
  }

  console.log('\n📊 处理完成:');
  console.log(`   成功: ${results.success}`);
  console.log(`   跳过: ${results.skipped}`);
  console.log(`   无原始内容: ${results.no_raw}`);
  console.log(`   内容不足: ${results.insufficient}`);
}

main();
