export function updateStreak(user) {
  const today = new Date().toDateString();
  const data =
    JSON.parse(localStorage.getItem(`streak-${user}`)) || {
      lastDate: null,
      count: 0,
    };

  if (data.lastDate === today) return data;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (data.lastDate === yesterday.toDateString()) {
    data.count += 1;
  } else {
    data.count = 1;
  }

  data.lastDate = today;
  localStorage.setItem(`streak-${user}`, JSON.stringify(data));
  return data;
}

export function getStreak(user) {
  return (
    JSON.parse(localStorage.getItem(`streak-${user}`)) || {
      count: 0,
      lastDate: null,
    }
  );
}
