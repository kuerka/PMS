export const parseIntString = (value: string) => {
  const num = Number(value);
  return Number.isInteger(num) ? num : value;
};
