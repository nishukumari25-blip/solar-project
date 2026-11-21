// Generates gap-free sequential FY numbering for all Solaris EPC documents

const getCurrentFY = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-12
  // Indian FY starts April 1st
  const startYear = month >= 4 ? year : year - 1;
  const shortYear = String(startYear).slice(-2);
  const nextShortYear = String(startYear + 1).slice(-2);
  return { shortYear, fullFY: `${shortYear}-${nextShortYear}` };
};

const formatSeq = (num, length = 4) => String(num).padStart(length, '0');

const generateId = (prefix, sequence) => {
  const { shortYear } = getCurrentFY();
  return `${prefix}-${shortYear}-${formatSeq(sequence, 4)}`;
};

const generateQuoteId = (sequence, revision = 1) => {
  const { shortYear } = getCurrentFY();
  return `QT-${shortYear}-${formatSeq(sequence, 4)}-R${revision}`;
};

const generateInvoiceId = (sequence) => {
  const { fullFY } = getCurrentFY();
  return `INV/${fullFY}/${formatSeq(sequence, 4)}`;
};

module.exports = {
  getCurrentFY,
  generateId,
  generateQuoteId,
  generateInvoiceId,
};
