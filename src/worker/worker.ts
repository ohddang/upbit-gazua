import { getMarketList, getMarketPrice, MarketInfo } from "../api/api";
import { getStorage } from "../utils/storage";

interface MarketPriceGapPercent {
  market: string;
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

const currentMarketPriceGapList: MarketPriceGapPercent[] = [];

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
        updateCurrentMarketPriceList(krwMarketList, rsepMinute.minute);
        break;
      case "BTC":
        updateCurrentMarketPriceList(btcMarketList, rsepMinute.minute);
        break;
      case "USDT":
        updateCurrentMarketPriceList(usdtMarketList, rsepMinute.minute);
        break;
      default:
        break;
    }
  }
};

export const findTargetMarket = async () => {
  const respShowCount = await getStorage("showCount");

  if (respShowCount.showCount) {
    currentMarketPriceGapList.sort((a, b) => {
      return b.gapPercent - a.gapPercent;
    });

    const sortedList = currentMarketPriceGapList.slice(0, respShowCount.showCount);
    console.log("[find] ", sortedList);
  }
};

const updateCurrentMarketPriceList = async (marketList: MarketInfo[], minute: number) => {
  const suspendFlag = unProcessedMarketList.length >= 10;

  while (unProcessedMarketList.length > 0) {
    const unProcessData = unProcessedMarketList.pop();
    if (unProcessData) {
      requestMarketPrice(unProcessData.market, minute, unProcessData.index);
      console.log("[unProcessed] ", unProcessData.index);
    }
  }
  if (!suspendFlag) {
    marketList.slice(marketIndex, marketIndex + 10).forEach((marketInfo, index) => {
      requestMarketPrice(marketInfo.market, minute, marketIndex + index);
    });

    marketIndex = marketIndex + 10 >= marketList.length ? 0 : (marketIndex += 10);
  }
};

const requestMarketPrice = async (market: string, minute: number, index: number) => {
  const marketPrice = await getMarketPrice(market, minute);
  if (marketPrice && marketPrice.length > 1) {
    const find = currentMarketPriceGapList.findIndex((item) => item.market === market);
    if (find === -1) {
      currentMarketPriceGapList.push({
        market: market,
        prevPrice: marketPrice[0].trade_price, // TODO : 어떤 가격으로 비교할지 default = trade_price(종가 or 현재가)
        curPrice: marketPrice[1].trade_price,
        gapPercent: ((marketPrice[1].trade_price - marketPrice[0].trade_price) / marketPrice[0].trade_price) * 100,
      });
    } else {
      currentMarketPriceGapList[find] = {
        market: market,
        prevPrice: marketPrice[0].trade_price, // TODO : 어떤 가격으로 비교할지 default = trade_price(종가 or 현재가)
        curPrice: marketPrice[1].trade_price,
        gapPercent: ((marketPrice[1].trade_price - marketPrice[0].trade_price) / marketPrice[0].trade_price) * 100,
      };
    }
    console.log("[success] ", index);
  } else {
    unProcessedMarketList.push({ ...krwMarketList[index], index });
  }

  return marketPrice;
};
