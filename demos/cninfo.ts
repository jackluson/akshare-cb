/**
 * 巨潮资讯数据源 Demo
 * 测试 2 个函数的真实数据
 *
 * 运行: npx tsx demos/cninfo.ts
 */
import {
  bondCovIssueCninfo,
  bondCovStockIssueCninfo,
} from "../src/sources/cninfo";

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
  // 1. 可转债发行 (最近一年)
  console.log(SEP + "测试 bondCovIssueCninfo('2024-01-01', '2025-12-31') — 可转债发行");
  try {
    const issues = await bondCovIssueCninfo("2024-01-01", "2025-12-31");
    printTable("可转债发行", issues, 5);
  } catch (e) {
    console.error("bondCovIssueCninfo 失败:", e);
  }

  // 2. 可转债转股
  console.log(SEP + "测试 bondCovStockIssueCninfo() — 可转债转股");
  try {
    const stockIssues = await bondCovStockIssueCninfo();
    printTable("可转债转股", stockIssues, 5);
  } catch (e) {
    console.error("bondCovStockIssueCninfo 失败:", e);
  }
}

main().catch(console.error);
