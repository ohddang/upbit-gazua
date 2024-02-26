import {
  compareMarketPrice,
  filterTargetMarket,
  initMarketList,
  marketChangeChecker,
  minuteChangeChecker,
} from "../worker/worker";
import { emphasizeMarket } from "./emphasizeMarket";

initMarketList();

setInterval(() => {
  marketChangeChecker();
  minuteChangeChecker();
  compareMarketPrice();
  filterTargetMarket().then((res) => {
    if (res) emphasizeMarket(res);
  });
}, 360);
