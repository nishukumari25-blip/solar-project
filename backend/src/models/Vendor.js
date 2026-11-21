const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    vendorCode: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    contactPerson: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    city: { type: String, default: 'Jaipur' },
    gstin: { type: String, required: true, uppercase: true },
    pan: { type: String, uppercase: true },
    isAlmmApproved: { type: Boolean, default: true },
    isDcrCompliant: { type: Boolean, default: true },
    status: { type: String, default: 'Active', enum: ['Active', 'Inactive', 'Blacklisted'] },
    rating: { type: Number, default: 4.8 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
