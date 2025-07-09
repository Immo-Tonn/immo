export const formatGermanCurrency = (num: number) => {
  return num
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};