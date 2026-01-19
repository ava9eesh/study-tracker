export const getProgress = (uid) => {
  return JSON.parse(localStorage.getItem(`progress-${uid}`)) || {};
};

export const saveProgress = (uid, data) => {
  localStorage.setItem(`progress-${uid}`, JSON.stringify(data));
};
