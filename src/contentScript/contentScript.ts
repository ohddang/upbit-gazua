import { compareMarketPrice, findTargetMarket, getFilteredMarketList, initMarketList } from "../worker/worker";
import { emphasizeMarket } from "./emphasizeMarket";

initMarketList();

setInterval(() => {
  compareMarketPrice();
  findTargetMarket();

  emphasizeMarket(getFilteredMarketList());
}, 1100);
