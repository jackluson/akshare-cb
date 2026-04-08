/**
 * 集思录数据源 Demo
 * 测试 3 个无需认证的函数
 *
 * 运行: npx tsx demos/jisilu.ts
 */
import { bondZhCov } from "../src/sources/eastmoney";
import {
  bondCbAdjLogsJsl,
  bondCbIndexJsl,
  bondCbIndexJslWithList,
  bondCbJsl,
  bondCbRedeemJsl,
} from "../src/sources/jisilu";

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
  // 1. 可转债等权指数
  console.log(SEP + "测试 bondCbIndexJsl() — 可转债等权指数");
  try {
    const index = await bondCbIndexJsl();
    printTable("等权指数", index.price_dt, 5);
  } catch (e) {
    console.error("bondCbIndexJsl 失败:", e);
  }

  try {
    const index = await bondCbIndexJslWithList();
    printTable("等权指数", index, 3);
  } catch (e) {
    console.error("bondCbIndexJsl 失败:", e);
  }

  // 2. 可转债强赎
  console.log(SEP + "测试 bondCbRedeemJsl() — 可转债强赎");
  try {
    const redeem = await bondCbRedeemJsl();
    printTable("强赎数据", redeem, 5);
  } catch (e) {
    console.error("bondCbRedeemJsl 失败:", e);
  }

  // 3. 可转债列表 (需要 cookie)
  const cookie = process.env.JSL_COOKIE ?? "";
  if (cookie) {
    console.log(SEP + "测试 bondCbJsl() — 可转债列表");
    try {
      const list = await bondCbJsl(cookie);
      const bonds = await bondZhCov(true);
      // const nowStart = new Date().setHours(0, 0, 0, 0); // 求当天时间的开始时间
      // const validBonds = bonds.filter(item => item.listingDate && item.convertPrice && item.bondPrice && item.convertValue && item.bondCode.startsWith('1') && (!item.recordDateSh || nowStart <= new Date(item.recordDateSh).getTime() - 3 * 24 * 60 * 60 * 1000) && (!item.transferEndDate || nowStart <= new Date(item.transferEndDate).getTime() - 3 * 24 * 60 * 60 * 1000));
      // 求不在list中的validBonds
      const diff = bonds.filter(item => !list.some(l => l.bondCode === item.bondCode));
      console.log("不在list中的validBonds", diff, diff.length, 'validBonds', bonds.length, bonds[0]);
      const diff2 = list.filter(item => !bonds.some(l => l.bondCode === item.bondCode));
      console.log("不在validBonds中的list", diff2, diff2.length, 'list', list.length, list[0]);
      printTable("可转债列表", list, 5);
    } catch (e) {
      console.error("bondCbJsl 失败:", e);
    }
  } else {
    console.log("\n跳过 bondCbJsl — 需要设置 JSL_COOKIE 环境变量");
    console.log("用法: JSL_COOKIE='你的cookie' npx tsx demos/jisilu.ts\n");
  }

  // 4. 转股价调整记录
  console.log(SEP + "测试 bondCbAdjLogsJsl('128013') — 转股价调整记录");
  try {
    const adjLogs = await bondCbAdjLogsJsl("128013");
    printTable("转股价调整记录", adjLogs);
  } catch (e) {
    console.error("bondCbAdjLogsJsl 失败:", e);
  }
}

main().catch(console.error);
