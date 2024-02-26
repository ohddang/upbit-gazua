export const getStorage = async (key: string) => {
  const storage = await chrome.storage.local.get([key]);
  return storage;
};

export const setStorage = async (key: string, value: any) => {
  await chrome.storage.local.set({ [key]: value });
};

export const getTimeTextFromMinute = (minute: number) => {
  if (minute < 60) {
    return `${minute}분`;
  } else if (minute < 1440) {
    return `${Math.floor(minute / 60)}시간`;
  } else {
    return `${Math.floor(minute / 1440)}일`;
  }
};

export const getAccTradePriceText = (market: string, price: number) => {
  if (market.includes("KRW")) return `${Math.floor(price / 1000000).toLocaleString()}`;
  else if (market.includes("BTC")) return `${parseFloat(price.toFixed(3)).toLocaleString()}`;
  else if (market.includes("USDT")) return `${parseFloat(price.toFixed(0)).toLocaleString()}`;
  else return price.toLocaleString();
};
