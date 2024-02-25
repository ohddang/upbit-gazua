import { compareMarketPrice, filterTargetMarket, initMarketList, marketChangeChecker } from "../worker/worker";
import { emphasizeMarket } from "./emphasizeMarket";

initMarketList();

setInterval(() => {
  marketChangeChecker();
  compareMarketPrice();
  filterTargetMarket().then((res) => {
    if (res) emphasizeMarket(res);
  });
}, 1200);
