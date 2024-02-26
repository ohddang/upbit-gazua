import { getMarketList, getMarketCandle, MarketInfo, getMarketPrice } from "../api/api";
import { getStorage } from "../utils/common";

export interface targetMarketInfo {
  name: string;
  prevPrice: number;
  curPrice: number;
  gapPercent: number;
  accTradePrice24h: number;
}

interface requestMarketInfo extends MarketInfo {
  index: number;
}

const krwMarketList: MarketInfo[] = [];
const btcMarketList: MarketInfo[] = [];
const usdtMarketList: MarketInfo[] = [];
const requestQueue: requestMarketInfo[] = [];

const targetMarketList: targetMarketInfo[] = [];

let currentMarket = "";
let marketIndex = 0;

export const initMarketList = async () => {
  const marketList = await getMarketList();
  if (marketList === undefined) return;

  marketList.forEach((market) => {
    if (market.market.includes("KRW")) {
      krwMarketList.push(market);
    } else if (market.market.includes("BTC")) {
      btcMarketList.push(market);
    } else if (market.market.includes("USDT")) {
      usdtMarketList.push(market);
    }
  });
};

export const compareMarketPrice = async () => {
  const respMarket = await getStorage("market");
  const rsepMinute = await getStorage("minute");

  if (respMarket.market && rsepMinute.minute) {
    currentMarket = respMarket.market;
    switch (respMarket.market) {
      case "KRW":
        updateMarketInfo(krwMarketList, rsepMinute.minute);
        break;
      case "BTC":
        updateMarketInfo(btcMarketList, rsepMinute.minute);
        break;
      case "USDT":
        updateMarketInfo(usdtMarketList, rsepMinute.minute);
        break;
      default:
        break;
    }
  }
};

export const filterTargetMarket = async () => {
  const respShowCount = await getStorage("showCount");

  if (respShowCount.showCount) {
    targetMarketList.sort((a, b) => {
      return b.gapPercent - a.gapPercent;
    });
    return targetMarketList.slice(0, respShowCount.showCount);
  }
  return undefined;
};

export const marketChangeChecker = async () => {
  const respMarket = await getStorage("market");
  if (respMarket.market === undefined) return;

  if (currentMarket !== respMarket.market) {
    while (targetMarketList.length > 0) {
      targetMarketList.pop();
    }
    while (requestQueue.length > 0) {
      requestQueue.pop();
    }
  }
};

const updateMarketInfo = async (marketList: MarketInfo[], minute: number) => {
  const suspendFlag = requestQueue.length > 0;

  while (requestQueue.length > 0) {
    const popItem = requestQueue.pop();
    if (popItem) {
      requestMarketInfo(marketList, popItem.market, popItem.korean_name, minute, popItem.index);
    }
  }
  if (!suspendFlag) {
    marketList.slice(marketIndex, marketIndex + 10).forEach((marketInfo, index) => {
      requestMarketInfo(marketList, marketInfo.market, marketInfo.korean_name, minute, marketIndex + index);
    });

    // upbit rest api 1초당 10개 제한
    marketIndex = marketIndex + 10 >= marketList.length ? 0 : (marketIndex += 10);
  }
};

const requestMarketInfo = async (
  marketList: MarketInfo[],
  market: string,
  name: string,
  minute: number,
  index: number
) => {
  const time = new Date().getTime();
  const [marketCandle, marketPrice] = await Promise.all([getMarketCandle(market, minute), getMarketPrice(market)]); //getMarketCandle(market, minute);
  const diff = new Date().getTime() - time;
  // if (index % 50 === 0) console.log("request time", diff, "ms");

  if (marketCandle && marketPrice) {
    const find = targetMarketList.findIndex((item) => item.name === name);

    const newItem: targetMarketInfo = {
      name: name,
      prevPrice: marketCandle[1].trade_price,
      curPrice: marketCandle[0].trade_price,
      gapPercent: ((marketCandle[0].trade_price - marketCandle[1].trade_price) / marketCandle[0].trade_price) * 100,
      accTradePrice24h: marketPrice[0].acc_trade_price_24h,
    };

    if (find === -1) {
      targetMarketList.push(newItem);
    } else {
      targetMarketList[find] = newItem;
    }
  } else {
    requestQueue.push({ ...marketList[index], index });
  }

  return marketCandle;
};
