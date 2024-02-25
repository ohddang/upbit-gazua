export const getStorage = async (key: string) => {
  const storage = await chrome.storage.local.get([key]);
  return storage;
};

export const setStorage = async (key: string, value: any) => {
  await chrome.storage.local.set({ [key]: value });
};
