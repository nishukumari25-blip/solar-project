/**
 * Utility functions for formatting Indian currency, dates, and numbers.
 */

export const formatINR = (amount, showDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const num = Number(amount);
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  });
  return `₹${formatted}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }); // e.g. "20 Nov 2026"
  } catch {
    return dateString;
  }
};

export const formatKW = (kw) => {
  if (kw === undefined || kw === null) return '0 kWp';
  return `${Number(kw).toFixed(1)} kWp`;
};
