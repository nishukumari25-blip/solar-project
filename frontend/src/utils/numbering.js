/**
 * Unique server-like sequential FY numbering generators (April-March).
 */

const getFYShort = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 is Jan, 3 is April
  // If Jan-March, FY started previous year
  const startYear = month < 3 ? year - 1 : year;
  return String(startYear).slice(-2); // e.g. "26"
};

const getFYFull = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const startYear = month < 3 ? year - 1 : year;
  const endYear = startYear + 1;
  return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`; // e.g. "26-27"
};

export const generateId = (prefix, sequenceNumber) => {
  const yy = getFYShort();
  const padded = String(sequenceNumber).padStart(4, '0');
  return `${prefix}-${yy}-${padded}`; // e.g. PRJ-26-0004
};

export const generateQuoteId = (sequenceNumber, revision = 1) => {
  const yy = getFYShort();
  const padded = String(sequenceNumber).padStart(4, '0');
  return `QT-${yy}-${padded}-R${revision}`; // e.g. QT-26-0004-R1
};

export const generateInvoiceId = (sequenceNumber) => {
  const fy = getFYFull();
  const padded = String(sequenceNumber).padStart(4, '0');
  return `INV/${fy}/${padded}`; // e.g. INV/26-27/0001
};
