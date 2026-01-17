export function getProgress(user) {
  return JSON.parse(localStorage.getItem(`progress-${user}`)) || {};
}

export function saveProgress(user, progress) {
  localStorage.setItem(`progress-${user}`, JSON.stringify(progress));
}
