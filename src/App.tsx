import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

const getStorage = async () => {
  const storage = await chrome.storage.local.get(['distribution']);
  return storage;
};

const App = () => {
  const [distribution, setDistribution] = useState<number>(1);
  const buttonContainerRef = React.useRef<HTMLDivElement>(null);

  const onHandleClick = (min: number) => {
    chrome.storage.local.set({ distribution: min }, function () {
      console.log('Value is set to ' + min);
      setDistribution(min);
    });
  };

  buttonContainerRef.current?.childNodes.forEach((button) => {
    (button as HTMLButtonElement).id === `min_${distribution}`
      ? (button as HTMLButtonElement).classList.add('selected')
      : (button as HTMLButtonElement).classList.remove('selected');
  });

  useEffect(() => {
    getStorage().then((storage) => {
      setDistribution(storage.distribution || 1);
    });
  }, []);

  return (
    <div className="App">
      <div className="distribution_container" ref={buttonContainerRef}>
        <button id="min_1" onClick={() => onHandleClick(1)}>
          1
        </button>
        <button id="min_3" onClick={() => onHandleClick(3)}>
          3
        </button>
        <button id="min_5" onClick={() => onHandleClick(5)}>
          5
        </button>
        <button id="min_10" onClick={() => onHandleClick(10)}>
          10
        </button>
        <button id="min_15" onClick={() => onHandleClick(15)}>
          15
        </button>
        <button id="min_30" onClick={() => onHandleClick(30)}>
          30
        </button>
      </div>
    </div>
  );
};
export default App;
