export const formatNumber = (num: number | null, decimal: number): string => {
  if (!num) return '0';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  });
};
