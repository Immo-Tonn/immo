export const formatGermanCurrency = (num: number) => {
  return num
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const parseGermanCurrency = (formattedValue: string | number): number => {
  if (typeof formattedValue === 'number') {
    return formattedValue;
  }
  if (typeof formattedValue === 'string') {
    const cleanValue = formattedValue
      .replace(/\./g, '') // remove points (dividers of thousands)
      .replace(',', '.'); // replace the comma with a point for decimal
    return parseFloat(cleanValue) || 0;
  }  
  return 0;
};