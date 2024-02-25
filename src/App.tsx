import "./App.css";

import React, { useState, useEffect } from "react";
import { getStorage, setStorage } from "./utils/storage";
import ButtonGroup, { ButtonInfo } from "./components/buttonGroup/buttonGroup";

const marketButtonList: ButtonInfo[] = [
  { id: "market_KRW", name: "원화", value: "KRW" },
  { id: "market_BTC", name: "BTC", value: "BTC" },
  { id: "market_USDT", name: "USDT", value: "USDT" },
];

const minuteButtonList: ButtonInfo[] = [
  { id: "minute_1", name: "1분", value: 1 },
  { id: "minute_3", name: "3분", value: 3 },
  { id: "minute_5", name: "5분", value: 5 },
  { id: "minute_10", name: "10분", value: 10 },
  { id: "minute_15", name: "15분", value: 15 },
  { id: "minute_30", name: "30분", value: 30 },
];

const showCountButtonList: ButtonInfo[] = [
  { id: "showCount_3", name: "3개", value: 3 },
  { id: "showCount_5", name: "5개", value: 5 },
  { id: "showCount_7", name: "7개", value: 7 },
  { id: "showCount_10", name: "10개", value: 10 },
  { id: "showCount_15", name: "15개", value: 15 },
  { id: "showCount_20", name: "20개", value: 20 },
];

const App = () => {
  const [minute, setMinute] = useState<number>(1);
  const [showCount, setShowCount] = useState<number>(3);
  const [market, setMarket] = useState<string>("KRW");

  const marketGroupRef = React.useRef<HTMLDivElement>(null);
  const minuteGroupRef = React.useRef<HTMLDivElement>(null);
  const showCountGroupRef = React.useRef<HTMLDivElement>(null);

  const onClickMarket = (paramMarket: string) => {
    setStorage("market", paramMarket);
    setMarket(paramMarket);
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
        <ButtonGroup buttonInfos={marketButtonList} onClick={(value) => onClickMarket(String(value))} />
      </div>
      <br />
      <div className="button_title">기준 분봉</div>
      <div className="button_container" ref={minuteGroupRef}>
        <ButtonGroup buttonInfos={minuteButtonList} onClick={(value) => onClickMinute(Number(value))} />
      </div>
      <br />
      <div className="button_title">검색할 코인 갯수</div>
      <div className="button_container" ref={showCountGroupRef}>
        <ButtonGroup buttonInfos={showCountButtonList} onClick={(value) => onClickShowCount(Number(value))} />
      </div>
    </div>
  );
};
export default App;
