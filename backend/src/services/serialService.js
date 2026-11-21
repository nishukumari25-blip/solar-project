const SerialNumber = require('../models/SerialNumber');

const verifyAndRegisterSerials = async (serialsArray, projectId, grnNumber, itemType) => {
  if (!Array.isArray(serialsArray) || serialsArray.length === 0) {
    return [];
  }

  const cleanSerials = serialsArray.map((s) => String(s).trim().toUpperCase()).filter((s) => s.length > 0);

  // 1. Check for duplicates within the current submission batch
  const uniqueBatch = new Set(cleanSerials);
  if (uniqueBatch.size !== cleanSerials.length) {
    throw new Error('Duplicate serial numbers detected within the uploaded delivery batch itself.');
  }

  // 2. Query database for system-wide uniqueness
  const existingRecords = await SerialNumber.find({ serialNumber: { $in: cleanSerials } });
  if (existingRecords.length > 0) {
    const dup = existingRecords[0];
    throw new Error(
      `Regulatory Integrity Violation: Serial number '${dup.serialNumber}' is already registered in Project '${dup.projectId}' (GRN: ${dup.grnNumber}). Serial numbers must be globally unique.`
    );
  }

  // 3. Register serial numbers
  const today = new Date().toISOString().split('T')[0];
  const docs = cleanSerials.map((sn) => ({
    serialNumber: sn,
    itemType,
    projectId,
    grnNumber,
    scannedDate: today,
    status: 'Installed at Site',
  }));

  const created = await SerialNumber.insertMany(docs);
  return created;
};

module.exports = {
  verifyAndRegisterSerials,
};
