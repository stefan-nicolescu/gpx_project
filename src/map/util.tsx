export const generateArray = (start: number, end: number, interval: number) => {
  const arr = [];
  for (let i = start; i <= end; i += interval) {
    if (i !== 0) {
      arr.push(i);
    }
  }
  return arr;
};
