import { getMarketList, getMarketPrice, MarketInfo } from "../api/api";
import { getStorage } from "../utils/storage";

export interface targetMarketInfo {
  name: string;
  prevPrice: number;
  curPrice: number;
  gapPercent: number;
}

interface unProcessedMarketInfo extends MarketInfo {
  index: number;
}

const krwMarketList: MarketInfo[] = [];
const btcMarketList: MarketInfo[] = [];
const usdtMarketList: MarketInfo[] = [];
const unProcessedMarketList: unProcessedMarketInfo[] = [];

const targetMarketList: targetMarketInfo[] = [];
let filteredMarketList: targetMarketInfo[] = [];

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
    switch (respMarket.market) {
      case "KRW":
        updateMarketPrice(krwMarketList, rsepMinute.minute);
        break;
      case "BTC":
        updateMarketPrice(btcMarketList, rsepMinute.minute);
        break;
      case "USDT":
        updateMarketPrice(usdtMarketList, rsepMinute.minute);
        break;
      default:
        break;
    }
  }
};

export const findTargetMarket = async () => {
  const respShowCount = await getStorage("showCount");

  if (respShowCount.showCount) {
    targetMarketList.sort((a, b) => {
      return b.gapPercent - a.gapPercent;
    });

    filteredMarketList = targetMarketList.slice(0, respShowCount.showCount);
    console.log("sortedList", filteredMarketList);
  }
};

export const getFilteredMarketList = () => filteredMarketList;

const updateMarketPrice = async (marketList: MarketInfo[], minute: number) => {
  const suspendFlag = unProcessedMarketList.length >= 10;

  while (unProcessedMarketList.length > 0) {
    const unProcessData = unProcessedMarketList.pop();
    if (unProcessData) {
      requestMarketPrice(unProcessData.market, unProcessData.korean_name, minute, unProcessData.index);
    }
  }
  if (!suspendFlag) {
    marketList.slice(marketIndex, marketIndex + 10).forEach((marketInfo, index) => {
      requestMarketPrice(marketInfo.market, marketInfo.korean_name, minute, marketIndex + index);
    });

    // upbit rest api 1초당 10개 제한
    marketIndex = marketIndex + 10 >= marketList.length ? 0 : (marketIndex += 10);
  }
};

const requestMarketPrice = async (market: string, name: string, minute: number, index: number) => {
  const marketPrice = await getMarketPrice(market, minute);
  if (marketPrice && marketPrice.length > 1) {
    const find = targetMarketList.findIndex((item) => item.name === name);

    const newItem: targetMarketInfo = {
      name: name,
      prevPrice: marketPrice[0].trade_price,
      curPrice: marketPrice[1].trade_price,
      gapPercent: ((marketPrice[1].trade_price - marketPrice[0].trade_price) / marketPrice[0].trade_price) * 100,
    };

    if (find === -1) {
      targetMarketList.push(newItem);
    } else {
      targetMarketList[find] = newItem;
    }
  } else {
    unProcessedMarketList.push({ ...krwMarketList[index], index });
  }

  return marketPrice;
};
