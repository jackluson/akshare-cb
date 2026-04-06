/**
 * 同花顺数据源 Demo
 * 测试 1 个函数的真实数据
 *
 * 运行: npx tsx demos/ths.ts
 */
import { bondZhCovInfoThs } from "../src/sources/ths";

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
  // 同花顺可转债数据
  console.log(SEP + "测试 bondZhCovInfoThs() — 同花顺可转债数据");
  try {
    const data = await bondZhCovInfoThs();
    printTable("同花顺可转债", data, 5);
  } catch (e) {
    console.error("bondZhCovInfoThs 失败:", e);
  }
}

main().catch(console.error);
