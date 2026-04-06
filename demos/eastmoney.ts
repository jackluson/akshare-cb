/**
 * 东方财富数据源 Demo
 * 测试 6 个函数的真实数据
 *
 * 运行: npx tsx demos/eastmoney.ts
 */
import { writeFileSync } from "fs";
import {
  bondCovComparison,
  bondCovValueAnalysis,
  bondZhCov,
  bondZhCovInfo,
  bondZhHsCovMin,
  bondZhHsCovPreMin,
} from "../src/sources/eastmoney";

const SEP = "\n" + "=".repeat(60) + "\n";

function printTable(title: string, data: unknown[], limit = 3) {
  console.log(SEP);
  console.log(`【${title}】共 ${data.length} 条`);
  if (data.length > 0) {
    console.table(data.slice(0, limit));
  }
  console.log();
}

async function main() {
  // 1. 可转债列表
  // console.log(SEP + "测试 bondZhCov() — 可转债列表");
  // try {
  //   const bonds = await bondZhCov(true);
  //   // const csv = validBonds.map(item => Object.values(item).join(",")).join("\n");
  //   // writeFileSync("validBonds.csv", csv);
  //   // 导出 validBonds 到 json
  //   // const json = JSON.stringify(validBonds);
  //   // writeFileSync("validBonds.json", json);
  //   printTable("可转债列表", bonds, 5);
  // } catch (e) {
  //   console.error("bondZhCov 失败:", e);
  // }

  // 2. 可转债比价表
  // console.log(SEP + "测试 bondCovComparison() — 可转债比价表");
  // try {
  //   const comparison = await bondCovComparison();
  //   printTable("可转债比价表", comparison);
  // } catch (e) {
  //   console.error("bondCovComparison 失败:", e);
  // }

  // // 3. 可转债详情 (basic)
  console.log(SEP + "测试 bondZhCovInfo('127068', 'basic') — 可转债详情");
  try {
    const info = await bondZhCovInfo("127068", "basic");
    printTable("可转债详情 (basic)", info, 1);
  } catch (e) {
    console.error("bondZhCovInfo 失败:", e);
  }

  // 4. 可转债价值分析
  console.log(SEP + "测试 bondCovValueAnalysis('127068') — 价值分析");
  try {
    const analysis = await bondCovValueAnalysis("127068");
    printTable("价值分析", analysis, 5);
  } catch (e) {
    console.error("bondCovValueAnalysis 失败:", e);
  }

  // 5. 可转债分钟行情 (15分钟K线)
  console.log(SEP + "测试 bondZhHsCovMin('sz127068', '15') — 分钟行情");
  try {
    const minData = await bondZhHsCovMin("sz127068", "15");
    printTable("15分钟K线", minData, 5);
  } catch (e) {
    console.error("bondZhHsCovMin 失败:", e);
  }

  // 6. 可转债盘前分钟行情
  console.log(SEP + "测试 bondZhHsCovPreMin('sz127068') — 盘前分钟行情");
  try {
    const preMin = await bondZhHsCovPreMin("sz127068");
    printTable("盘前分钟行情", preMin, 5);
  } catch (e) {
    console.error("bondZhHsCovPreMin 失败:", e);
  }
}

main().catch(console.error);
