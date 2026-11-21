const Setting = require('../models/Setting');

// GET /api/settings
const getSettings = async (req, res, next) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    const defaultCompany = {
      name: 'Solaris EPC Private Limited',
      gstin: '08AABCS1234F1Z8',
      pan: 'AABCS1234F',
      cin: 'U40106RJ2021PTC078912',
      address: 'Plot 104, Malviya Industrial Area, Jaipur, Rajasthan - 302017',
      stateCode: '08',
      stateName: 'Rajasthan',
      phone: '+91 141 2984100',
      email: 'operations@solarisepc.in',
    };

    const defaultThresholds = {
      discountApprovalPct: 5,
      poApprovalLimit: 200000,
      subsidyAlertDays: 45,
      loanAlertDays: 21,
      quotationValidityDays: 15,
    };

    res.json({
      success: true,
      data: {
        company: settingsMap.company || defaultCompany,
        thresholds: settingsMap.thresholds || defaultThresholds,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings/company
const updateCompany = async (req, res, next) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'company' },
      { value: req.body },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Company master profile updated', data: updated.value });
  } catch (err) {
    next(err);
  }
};

// PUT /api/settings/thresholds
const updateThresholds = async (req, res, next) => {
  try {
    const updated = await Setting.findOneAndUpdate(
      { key: 'thresholds' },
      { value: req.body },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Approval thresholds updated', data: updated.value });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSettings, updateCompany, updateThresholds };
