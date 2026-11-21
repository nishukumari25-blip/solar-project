const Approval = require('../models/Approval');
const Quotation = require('../models/Quotation');
const PurchaseOrder = require('../models/PurchaseOrder');
const Notification = require('../models/Notification');

const checkQuotationDiscountApproval = async (quoteDoc, discountAmount, grandTotal, thresholdPct = 5, user) => {
  const discountPct = (Number(discountAmount || 0) / Number(grandTotal || 1)) * 100;
  if (discountPct > thresholdPct) {
    quoteDoc.status = 'Pending Approval';
    await Approval.create({
      module: 'Quotation Discount',
      refId: quoteDoc.quoteNumber,
      projectId: null,
      customerName: quoteDoc.customerName,
      requestedBy: user?.name || 'Sales Executive',
      requestDate: new Date().toISOString().split('T')[0],
      details: `Discount of ${discountPct.toFixed(1)}% (₹${discountAmount.toLocaleString('en-IN')}) exceeds company ${thresholdPct}% threshold. Total Value: ₹${grandTotal.toLocaleString('en-IN')}.`,
      status: 'Pending',
      approverRole: 'Owner / Admin',
      remarks: '',
    });

    await Notification.create({
      title: 'Quotation Discount Approval Needed',
      message: `Quotation ${quoteDoc.quoteNumber} for ${quoteDoc.customerName} has a ${discountPct.toFixed(1)}% discount exceeding ${thresholdPct}%. Owner review required.`,
      type: 'approval',
      targetPath: '/sales/approvals',
      unread: true,
      timestamp: 'Just now',
    });
    return true;
  }
  return false;
};

const checkPOValueApproval = async (poDoc, totalAmount, thresholdAmount = 200000, user) => {
  if (totalAmount > thresholdAmount) {
    poDoc.status = 'Pending Approval';
    await Approval.create({
      module: 'Purchase Order Value',
      refId: poDoc.poNumber,
      projectId: poDoc.projectId,
      customerName: '',
      requestedBy: user?.name || 'Purchase Executive',
      requestDate: new Date().toISOString().split('T')[0],
      details: `Purchase Order value of ₹${totalAmount.toLocaleString('en-IN')} exceeds company ₹${thresholdAmount.toLocaleString('en-IN')} threshold. Vendor: ${poDoc.vendorName}.`,
      status: 'Pending',
      approverRole: 'Owner / Admin',
      remarks: '',
    });

    await Notification.create({
      title: 'PO Authorization Needed',
      message: `Purchase Order ${poDoc.poNumber} (₹${totalAmount.toLocaleString('en-IN')}) exceeds limit. Owner review required.`,
      type: 'approval',
      targetPath: '/sales/approvals',
      unread: true,
      timestamp: 'Just now',
    });
    return true;
  }
  return false;
};

const processDecision = async (approvalId, isApproved, remarks, user) => {
  const approval = await Approval.findById(approvalId);
  if (!approval) throw new Error('Approval record not found');
  if (approval.status !== 'Pending') throw new Error('Approval request has already been processed');

  approval.status = isApproved ? 'Approved' : 'Rejected';
  approval.remarks = remarks || (isApproved ? 'Approved by Owner' : 'Rejected');
  await approval.save();

  // Cascade updates
  if (approval.module === 'Quotation Discount') {
    await Quotation.findOneAndUpdate(
      { quoteNumber: approval.refId },
      { status: isApproved ? 'Sent' : 'Rejected' }
    );
  } else if (approval.module === 'Purchase Order Value') {
    await PurchaseOrder.findOneAndUpdate(
      { poNumber: approval.refId },
      { status: isApproved ? 'Sent' : 'Rejected' }
    );
  }

  await Notification.create({
    title: isApproved ? 'Approval Granted' : 'Approval Rejected',
    message: `${approval.module} (${approval.refId}) was ${isApproved ? 'approved' : 'rejected'} by ${user?.name || 'Owner'}.`,
    type: 'approval',
    targetPath: '/sales/approvals',
    unread: true,
    timestamp: 'Just now',
  });

  return approval;
};

module.exports = {
  checkQuotationDiscountApproval,
  checkPOValueApproval,
  processDecision,
};
