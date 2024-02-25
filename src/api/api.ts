import axios, { AxiosResponse } from "axios";

export interface MarketInfo {
  market: string;
  korean_name: string;
  english_name: string;
  market_warning?: string;
  market_event: {
    caution: {
      CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
      DEPOSIT_AMOUNT_SOARING: boolean;
      GLOBAL_PRICE_DIFFERENCES: boolean;
      PRICE_FLUCTUATIONS: boolean;
      TRADING_VOLUME_SOARING: boolean;
    };
    warning: boolean;
  };
}

export interface MarketCandle {
  market: string;
  candle_date_time_utc: string;
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_price: number;
  candle_acc_trade_volume: number;
  unit: number;
}

export interface MarketPrice {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: string;
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

const MarketAllOptions = {
  url: "https://api.upbit.com/v1/market/all?isDetails=true",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

const MarketCandleOptions = (market: string, minute: number) => {
  return {
    url: `https://api.upbit.com/v1/candles/minutes/${minute}?market=${market}&count=2`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
};

const MarketPriceOptions = (market: string) => {
  return {
    url: `https://api.upbit.com/v1/ticker?markets=${market}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
};

export const getMarketList = async (): Promise<MarketInfo[] | undefined> => {
  try {
    const response = await axios(MarketAllOptions);

    if (200 === response.status) {
      if (Array.isArray(response.data) && response.data.every((item) => typeof item === "object")) {
        return response.data;
      } else {
        throw new Error("Invalid data format");
      }
    } else {
      throw new Error("get coin list failed");
    }
  } catch (error) {
    console.log("error ", error);
    return undefined; // TODO : 마켓정보가 없을때 다시 요청하는 로직 추가
  }
};

export const getMarketCandle = async (market: string, minute: number): Promise<MarketCandle[] | undefined> => {
  try {
    const response = await axios(MarketCandleOptions(market, minute));

    if (200 === response.status) {
      if (Array.isArray(response.data) && response.data.every((item) => typeof item === "object")) {
        return response.data;
      } else {
        throw new Error("Invalid data format");
      }
    } else {
      throw new Error("get coin list failed");
    }
  } catch (error) {
    console.log("error ", error);
    return undefined;
  }
};

export const getMarketPrice = async (market: string): Promise<MarketPrice[] | undefined> => {
  try {
    const response = await axios(MarketPriceOptions(market));

    if (200 === response.status) {
      if (Array.isArray(response.data) && response.data.every((item) => typeof item === "object")) {
        return response.data;
      } else {
        throw new Error("Invalid data format");
      }
    } else {
      throw new Error("get coin list failed");
    }
  } catch (error) {
    console.log("error ", error);
    return undefined;
  }
};
