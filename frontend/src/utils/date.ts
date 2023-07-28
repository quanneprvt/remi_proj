export const formatMiliSecond = (milisec: number): string => {
  const second = Math.round(milisec / 1000) % 60;
  const minute = Math.floor(milisec / 1000 / 60);
  return `${minute < 10 ? "0" + minute : minute}:${
    second < 10 ? "0" + second : second
  }`;
};
