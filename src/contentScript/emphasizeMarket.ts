import "./content.css";
import { targetMarketInfo } from "../worker/worker";
import { getAccTradePriceText, getStorage, getTimeTextFromMinute, setStorage } from "../utils/common";

const getParent = (element: HTMLElement, depth: number) => {
  let parent = element;
  for (let i = 0; i < depth; i++) {
    if (!parent.parentElement) return parent;

    parent = parent.parentElement as HTMLElement;
  }
  return parent;
};

export const emphasizeMarket = (items: targetMarketInfo[]) => {
  const sections = document.getElementsByTagName("section");
  if (!sections) return;
  const tabB = sections[1].getElementsByClassName("tabB")[0];
  if (!tabB) return;
  const nameList = tabB.getElementsByTagName("strong");
  if (!nameList) return;
  const tableBody = tabB.getElementsByTagName("tbody")[0];
  if (!tableBody) return;

  const emphasize = Array.from(tableBody.getElementsByClassName("gazua_emphasize"));
  const tableRow = Array.from(tableBody.getElementsByTagName("tr"));

  const emphasizeMaxCount = tableRow.length < 20 ? tableRow.length : 20;
  let frontDummyExist = false;
  try {
    if (tableRow && tableRow.length > 0)
      frontDummyExist = tableRow[emphasizeMaxCount].childElementCount === 0 ? true : false;
  } catch (e) {
    console.log(e, tableRow);
    frontDummyExist = false;
  }
  if (!emphasize || emphasize.length === 0) {
    for (let i = 0; i < emphasizeMaxCount; ++i) {
      const tr = document.createElement("tr");
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
      const td5 = document.createElement("td");
      const td6 = document.createElement("td");

      td2.innerText = String(emphasizeMaxCount - i);

      td2.classList.add("gazua_emphasize_num");
      td3.classList.add("gazua_emphasize_name");
      td4.classList.add("gazua_emphasize_gap");
      td5.classList.add("gazua_emphasize_time");
      td6.classList.add("gazua_emphasize_trade_price");

      const ts6 = document.createElement("span");
      const ti6 = document.createElement("i");
      td6.appendChild(ts6);
      td6.appendChild(ti6);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);
      tr.appendChild(td6);

      tr.style.display = "none";
      tr.classList.add("gazua_emphasize");

      tableBody.prepend(tr);
    }
  } else {
    items.sort((a, b) => {
      return b.gapPercent - a.gapPercent;
    });
    const sortedItems = items.slice(0, items.length);

    getStorage("minute").then((res) => {
      for (let i = 0; i < emphasizeMaxCount; ++i) {
        if (sortedItems[i]) {
          const tr = emphasize[i] as HTMLElement;
          const tds = Array.from(tr.getElementsByTagName("td"));

          const td3 = tds[2];
          const td4 = tds[3];
          const td5 = tds[4];
          const td6 = tds[5];

          const ts6 = td6.getElementsByTagName("span")[0];
          const ti6 = td6.getElementsByTagName("i")[0];

          td3.innerText = sortedItems[i].name;
          td4.innerText = sortedItems[i].gapPercent.toFixed(2) + "%";
          td5.innerText = getTimeTextFromMinute(res.minute) + "전 대비";
          ts6.innerText = getAccTradePriceText(sortedItems[i].market, sortedItems[i].accTradePrice24h);

          ti6.innerText = sortedItems[i].market.includes("KRW")
            ? "백만"
            : sortedItems[i].market.includes("BTC")
            ? "BTC"
            : "USDT";

          const calculateDummyCount = frontDummyExist ? sortedItems.length : 0;
          tr.style.display = calculateDummyCount > i ? "none" : "table-row";

          tr.addEventListener("click", () => {
            window.location.href = `https://upbit.com/exchange?code=CRIX.UPBIT.${sortedItems[i].market}`;
          });
        } else {
          if (emphasize && emphasize.length > 0) {
            const tr = emphasize[i] as HTMLElement;
            if (tr) tr.style.display = "none";
          }
        }
      }
    });
  }
};
