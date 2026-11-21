const validateMobile = (mobile) => /^[6-9]\d{9}$/.test(String(mobile).trim());

const validatePIN = (pin) => /^\d{6}$/.test(String(pin).trim());

const validateGSTIN = (gstin) => {
  if (!gstin) return false;
  // 15 chars: 2 state digits + 10 PAN chars + 1 entity digit + 'Z' + 1 checksum char
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(String(gstin).trim().toUpperCase());
};

const validatePAN = (pan) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(pan).trim().toUpperCase());

const validateNetCustomerCost = (grandTotal, totalSubsidy) => {
  return Number(grandTotal) - Number(totalSubsidy || 0) >= 0;
};

const validateInstalmentsTotal = (instalments, grandTotal) => {
  if (!Array.isArray(instalments) || instalments.length === 0) return true;
  const sumAmount = instalments.reduce((acc, i) => acc + Number(i.amount || 0), 0);
  const sumPct = instalments.reduce((acc, i) => acc + Number(i.percentage || 0), 0);
  // Allow ±₹5 margin for rounding or sumPct == 100
  return sumPct === 100 || Math.abs(sumAmount - Number(grandTotal)) <= 5;
};

module.exports = {
  validateMobile,
  validatePIN,
  validateGSTIN,
  validatePAN,
  validateNetCustomerCost,
  validateInstalmentsTotal,
};
