/**
 * 新浪财经数据源 Demo
 * 测试 4 个函数的真实数据
 *
 * 运行: npx tsx demos/sina.ts
 */
import {
  bondCbProfileSina,
  bondCbSummarySina,
  bondZhHsCovDaily,
  bondZhHsCovSpot,
} from "../src/sources/sina";

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
  // 1. 沪深可转债实时行情
  console.log(SEP + "测试 bondZhHsCovSpot() — 实时行情");
  try {
    const spot = await bondZhHsCovSpot();
    printTable("实时行情", spot, 5);
  } catch (e) {
    console.error("bondZhHsCovSpot 失败:", e);
  }

  // 2. 可转债历史日线
  console.log(SEP + "测试 bondZhHsCovDaily('sz128039') — 历史日线");
  try {
    const daily = await bondZhHsCovDaily("sz128039");
    printTable("历史日线", daily, 5);
  } catch (e) {
    console.error("bondZhHsCovDaily 失败:", e);
  }

  // 3. 可转债详情资料
  console.log(SEP + "测试 bondCbProfileSina('sz128039') — 详情资料");
  try {
    const profile = await bondCbProfileSina("sz128039");
    printTable("详情资料", profile, 10);
  } catch (e) {
    console.error("bondCbProfileSina 失败:", e);
  }

  // 4. 可转债概况摘要
  console.log(SEP + "测试 bondCbSummarySina('sh155255') — 概况摘要");
  try {
    const summary = await bondCbSummarySina("sh155255");
    printTable("概况摘要", summary, 10);
  } catch (e) {
    console.error("bondCbSummarySina 失败:", e);
  }
}

main().catch(console.error);
