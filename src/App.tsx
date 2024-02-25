import React from "react";
import { useState, useEffect } from "react";
import "./App.css";

const getStorage = async (key: string) => {
  const storage = await chrome.storage.local.get([key]);
  return storage;
};

const App = () => {
  const [minute, setMinute] = useState<number>(1);
  const [showCount, setShowCount] = useState<number>(3);

  const minuteGroupRef = React.useRef<HTMLDivElement>(null);
  const showCountGroupRef = React.useRef<HTMLDivElement>(null);

  const onClickMinute = (min: number) => {
    chrome.storage.local.set({ minute: min }, function () {
      setMinute(min);
    });
  };

  const onClickShowCount = (count: number) => {
    chrome.storage.local.set({ showCount: count }, function () {
      setShowCount(count);
    });
  };

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
    getStorage("minute").then((storage) => {
      setMinute(storage.minute || 1);
    });
    getStorage("showCount").then((storage) => {
      setShowCount(storage.showCount || 3);
    });
  }, []);

  return (
    <div className="App">
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
