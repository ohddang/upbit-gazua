const getStorage = async (key: string) => {
  const storage = await chrome.storage.local.get([key]);
  return storage;
};

setInterval(() => {
  const distribution = document.getElementsByClassName("ciq-menu ciq-period")[0];
  if (!distribution) return;
  const target = distribution.getElementsByTagName("span")[0];
  if (!target) return;

  const text = (target as HTMLElement).innerText;
  (target as HTMLElement).style.color = "red";

  getStorage("minute").then((storage) => {
    if (storage.minute) {
      console.log(storage.minute);
    } else {
      console.log("storage.minute is undefined");
    }
  });

  getStorage("showCount").then((storage) => {
    if (storage.showCount) {
      console.log(storage.showCount);
    } else {
      console.log("storage.showCount is undefined");
    }
  });

  console.log("contentScript.ts is running...");
}, 1000);
