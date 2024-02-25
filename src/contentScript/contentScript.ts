import { compareMarketPrice, findTargetMarket, initMarketList } from "../worker/worker";

initMarketList();

setInterval(() => {
  compareMarketPrice();
  findTargetMarket();
}, 1050);
