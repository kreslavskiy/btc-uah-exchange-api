export const formatRateWithThousandsSeparator = (rate: number): string => {
  const numStr = rate.toFixed(2);
  const parts: string[] = numStr.split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return parts.join('.');
};
