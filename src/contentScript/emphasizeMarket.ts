import "./content.css";
import { targetMarketInfo } from "../worker/worker";

const getParent = (element: HTMLElement, depth: number) => {
  let parent = element;
  for (let i = 0; i < depth; i++) {
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

  const emphasize = Array.from(tableBody.getElementsByClassName("gazua_emphasize"));
  for (let i = 0; i < emphasize?.length; ++i) {
    const parent = getParent(emphasize[i] as HTMLElement, 1);
    parent.removeChild(emphasize[i]);
  }

  items.sort((a, b) => {
    return a.gapPercent - b.gapPercent;
  });
  const sortedItems = items.slice(0, items.length);

  sortedItems.forEach((item, index) => {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");
    const td6 = document.createElement("td");

    td2.innerText = String(sortedItems.length - index);
    td3.innerText = item.name;
    td4.innerText = item.gapPercent.toFixed(2) + "%";

    td2.classList.add("gazua_emphasize_num");
    td3.classList.add("gazua_emphasize_name");
    td4.classList.add("gazua_emphasize_gap");

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);

    tr.classList.add("gazua_emphasize");

    if (tableBody) {
      tableBody.prepend(tr);
    }
  });
};
