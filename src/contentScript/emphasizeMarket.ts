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

  // const tableBody = getParent(nameList[0], 4);
  // const emphasize = tabB.getElementsByClassName("gazua-emphasize");
  // for (let i = 0; i < emphasize.length; ++i) {
  //   if(tableBody.hasChildNodes())
  //     tableBody.removeChild(emphasize[i]);
  // }

  let names: string = "";
  items.forEach((item) => {
    names += item.name + " ";
    // const tr = document.createElement("tr");
    // const tdName = document.createElement("td");
    // const tdPercent = document.createElement("td");
    // const tdEtc = document.createElement("td");

    // const name = document.createElement("strong");
    // const percent = document.createElement("strong");
    // const etc = document.createElement("strong");
    // name.innerText = item.name;
    // percent.innerText = item.gapPercent.toFixed(2) + "%";
    // etc.innerText = item.curPrice.toFixed(2);

    // tdName.appendChild(name);
    // tdPercent.appendChild(percent);
    // tdEtc.appendChild(etc);

    // tdName.classList.add("gazua-emphasize");
    // tdPercent.classList.add("gazua-emphasize");
    // tdEtc.classList.add("gazua-emphasize");

    // tr.appendChild(tdName);
    // tr.appendChild(tdPercent);
    // tr.appendChild(tdEtc);

    // tableBody.prepend(tr);
  });
  for (let i = 0; i < nameList.length; ++i) {
    if (names.includes(nameList[i].innerText)) {
      const target = getParent(nameList[i], 3);
      // const tableBody = getParent(target, 1);

      if (target) {
        // const copy = target.cloneNode(true) as HTMLElement;
        // if (copy.classList.contains("gazua-emphasize") === false) {
        //   copy.style.background = "rgba(255, 0, 0, 0.15)";
        //   copy.classList.add("gazua-emphasize");
        //   tableBody.prepend(copy);
        // }
        target.style.background = "rgba(255, 0, 0, 0.15)";
        target.style.fontWeight = "bold";
        target.classList.add("gazua-emphasize");
      }
    } else {
      const target = getParent(nameList[i], 3);
      if (target) {
        target.style.background = "";
        target.style.fontWeight = "";
      }
    }
  }
  console.log(names);
};
