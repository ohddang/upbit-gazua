//This seems to force the content-script to be reloaded when the history changes
chrome.webNavigation.onHistoryStateUpdated.addListener(async (details) => {
  const getCurrentTab = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  };

  let tab: any = await getCurrentTab();

  try {
    let url = new URL(tab.url);
    if (url.hostname !== "upbit.com") {
      console.log("not upbit.com");
      return;
    }
  } catch (error) {
    console.error("Invalid URL:", tab.url);
    return;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {}, //this literally will execute an empty function in the current tab which seems to be enough to reload or reconnect the content-script
  });
});
