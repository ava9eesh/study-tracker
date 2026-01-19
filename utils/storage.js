// utils/storage.js
// LOCAL STORAGE ONLY (temporary)

export const getProgress = (key) => {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
};

export const saveProgress = (key, value) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};
