/**
 * Indian regulatory & business field validators
 */

export const validateMobile = (mobile) => {
  const clean = String(mobile || '').trim();
  return /^[6-9]\d{9}$/.test(clean);
};

export const validatePIN = (pin) => {
  const clean = String(pin || '').trim();
  return /^[1-9][0-9]{5}$/.test(clean);
};

export const validateGSTIN = (gstin) => {
  const clean = String(gstin || '').trim().toUpperCase();
  // Standard 15-char GSTIN pattern
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(clean);
};

export const validatePAN = (pan) => {
  const clean = String(pan || '').trim().toUpperCase();
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(clean);
};

export const validateIFSC = (ifsc) => {
  const clean = String(ifsc || '').trim().toUpperCase();
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(clean);
};

export const validateNetCustomerCost = (grandTotal, totalSubsidy) => {
  return Number(grandTotal || 0) - Number(totalSubsidy || 0) >= 0;
};

export const validateInstalmentsTotal = (instalments, grandTotal) => {
  if (!Array.isArray(instalments) || instalments.length === 0) return false;
  const sum = instalments.reduce((acc, inst) => acc + Number(inst.amount || 0), 0);
  return Math.abs(sum - Number(grandTotal || 0)) < 0.01;
};
