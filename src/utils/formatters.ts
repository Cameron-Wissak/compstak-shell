export const formatCurrency = (value: number | undefined | null): string => {
  if (value == null) return 'N/A';
  return `$${Math.round(value).toLocaleString()}`;
}; 