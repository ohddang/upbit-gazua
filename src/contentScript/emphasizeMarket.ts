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
  console.log("tabB", tabB);
  if (!tabB) return;
  const nameList = tabB.getElementsByTagName("strong");
  console.log("nameList", nameList);
  if (!nameList) return;

  console.log("nameList", nameList);

  let names: string = "";
  items.forEach((item) => {
    names += item.name + " ";
  });

  for (let i = 0; i < nameList.length; ++i) {
    if (names.includes(nameList[i].innerText)) {
      const target = getParent(nameList[i], 3);
      if (target) {
        target.style.background = "rgba(255, 0, 0, 0.2)";
        target.style.fontWeight = "bold";
      }
    } else {
      const target = getParent(nameList[i], 3);
      if (target) {
        target.style.background = "";
        target.style.fontWeight = "";
      }
    }
  }
};
