export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const randomDelay = (min = 500, max = 900) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return sleep(ms);
};
