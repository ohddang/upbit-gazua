import "./App.css";

import React, { useState, useEffect } from "react";
import { getStorage, setStorage } from "./utils/storage";

const App = () => {
  const [minute, setMinute] = useState<number>(1);
  const [showCount, setShowCount] = useState<number>(3);
  const [market, setMarket] = useState<string>("KRW");

  const marketGroupRef = React.useRef<HTMLDivElement>(null);
  const minuteGroupRef = React.useRef<HTMLDivElement>(null);
  const showCountGroupRef = React.useRef<HTMLDivElement>(null);

  const onClickMarket = (market: string) => {
    setStorage("market", market);
    setMarket(market);
  };

  const onClickMinute = (min: number) => {
    setStorage("minute", min);
    setMinute(min);
  };

  const onClickShowCount = (count: number) => {
    setStorage("showCount", count);
    setShowCount(count);
  };

  useEffect(() => {
    marketGroupRef.current?.childNodes.forEach((button) => {
      (button as HTMLButtonElement).id === `market_${market}`
        ? (button as HTMLButtonElement).classList.add("selected")
        : (button as HTMLButtonElement).classList.remove("selected");
    });
  }, [market]);

  useEffect(() => {
    minuteGroupRef.current?.childNodes.forEach((button) => {
      (button as HTMLButtonElement).id === `minute_${minute}`
        ? (button as HTMLButtonElement).classList.add("selected")
        : (button as HTMLButtonElement).classList.remove("selected");
    });
  }, [minute]);

  useEffect(() => {
    showCountGroupRef.current?.childNodes.forEach((button) => {
      (button as HTMLButtonElement).id === `showCount_${showCount}`
        ? (button as HTMLButtonElement).classList.add("selected")
        : (button as HTMLButtonElement).classList.remove("selected");
    });
  }, [showCount]);

  useEffect(() => {
    getStorage("market").then((storage) => {
      if (storage.market === undefined) setStorage("market", "KRW");
      setMarket(storage.market || "KRW");
    });
    getStorage("minute").then((storage) => {
      if (storage.minute === undefined) setStorage("minute", 1);
      setMinute(storage.minute || 1);
    });
    getStorage("showCount").then((storage) => {
      if (storage.showCount === undefined) setStorage("showCount", 3);
      setShowCount(storage.showCount || 3);
    });
  }, []);

  return (
    <div className="App">
      <div className="button_title">마켓</div>
      <div className="button_container" ref={marketGroupRef}>
        <button id="market_KRW" onClick={() => onClickMarket("KRW")}>
          원화
        </button>
        <button id="market_BTC" onClick={() => onClickMarket("BTC")}>
          BTC
        </button>
        <button id="market_UDST" onClick={() => onClickMarket("USDT")}>
          USDT
        </button>
      </div>
      <br />
      <div className="button_title">기준 분봉</div>
      <div className="button_container" ref={minuteGroupRef}>
        <button id="minute_1" onClick={() => onClickMinute(1)}>
          1분
        </button>
        <button id="minute_3" onClick={() => onClickMinute(3)}>
          3분
        </button>
        <button id="minute_5" onClick={() => onClickMinute(5)}>
          5분
        </button>
        <button id="minute_10" onClick={() => onClickMinute(10)}>
          10분
        </button>
        <button id="minute_15" onClick={() => onClickMinute(15)}>
          15분
        </button>
        <button id="minute_30" onClick={() => onClickMinute(30)}>
          30분
        </button>
      </div>
      <br />
      <div className="button_title">검색할 코인 갯수</div>
      <div className="button_container" ref={showCountGroupRef}>
        <button id="showCount_3" onClick={() => onClickShowCount(3)}>
          3개
        </button>
        <button id="showCount_5" onClick={() => onClickShowCount(5)}>
          5개
        </button>
        <button id="showCount_7" onClick={() => onClickShowCount(7)}>
          7개
        </button>
        <button id="showCount_10" onClick={() => onClickShowCount(10)}>
          10개
        </button>
        <button id="showCount_15" onClick={() => onClickShowCount(15)}>
          15개
        </button>
        <button id="showCount_20" onClick={() => onClickShowCount(20)}>
          20개
        </button>
      </div>
    </div>
  );
};
export default App;
