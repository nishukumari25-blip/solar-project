const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Quotation = require('../models/Quotation');
const PurchaseRequisition = require('../models/PurchaseRequisition');
const Subsidy = require('../models/Subsidy');
const Receipt = require('../models/Receipt');
const CustomerPayment = require('../models/CustomerPayment');
const ProjectPnL = require('../models/ProjectPnL');
const Notification = require('../models/Notification');
const { generateId } = require('../utils/numbering');

const defaultMilestoneNames = [
  { sequence: 1, name: 'Project Kickoff & Site Plan', description: 'Kickoff meeting, rooftop structural inspection, civil marking, and layout plan approval.' },
  { sequence: 2, name: 'Material Received at Site', description: 'Delivery of solar panels, inverters, and structures to customer site (gated by Site GRN).' },
  { sequence: 3, name: 'Structure Installed', description: 'Assembly and secure anchoring of hot-dip galvanized mounting structures on rooftop.' },
  { sequence: 4, name: 'Panels Mounted', description: 'Fixing bifacial solar PV modules with mid and end clamps and torque verification.' },
  { sequence: 5, name: 'Inverter & Wiring Complete', description: 'Inverter mounting, DCDB/ACDB connections, chemical earthing pits, and conduit cable routing.' },
  { sequence: 6, name: 'Testing & Commissioning', description: 'Pre-commissioning safety checks, anti-islanding test, and trial generation (unlocks WCR & final invoice).' },
  { sequence: 7, name: 'Handover to Customer', description: 'Handover of warranty documents, O&M manual, safety briefing, and customer sign-off.' },
];

const atomicConvertQuotationToOrder = async (quoteId, conversionParams, user) => {
  const quote = await Quotation.findById(quoteId);
  if (!quote) throw new Error('Quotation not found');
  if (quote.status === 'Converted to Order') throw new Error('Quotation has already been converted to an order');

  const countProjects = await Project.countDocuments();
  const nextProjectSeq = countProjects + 1;
  const newProjectId = generateId('PRJ', nextProjectSeq);
  const today = new Date().toISOString().split('T')[0];

  const advanceReceived = Number(conversionParams.advanceReceivedNow || 0);
  const contractValue = quote.grandTotal;
  const balanceDue = contractValue - advanceReceived;

  // 1. Create Project
  const newProject = await Project.create({
    projectId: newProjectId,
    customerName: quote.customerName,
    mobile: conversionParams.mobile || '9829011111',
    quotationId: quote.quoteNumber,
    systemCapacityKW: quote.systemCapacityKW,
    paymentMode: conversionParams.paymentMode || 'Self-funded',
    financier: conversionParams.financier || null,
    managerId: 'usr-4',
    managerName: 'Vikram Choudhary',
    siteAddress: conversionParams.siteAddress || 'Jaipur, Rajasthan',
    status: 'In Progress',
    targetDate: conversionParams.targetDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    contractValue,
    totalReceived: advanceReceived,
    balanceDue,
    isDelayed: false,
    subsidyStage: 'Application Registered',
    pnlLocked: false,
  });

  // 2. Create 7 Installation Milestones in strict sequence
  const milestoneDocs = defaultMilestoneNames.map((m) => ({
    projectId: newProjectId,
    sequence: m.sequence,
    name: m.name,
    description: m.description,
    status: m.sequence === 1 ? 'In Progress' : 'Pending',
    targetDate: new Date(Date.now() + m.sequence * 4 * 86400000).toISOString().split('T')[0],
    photoRequired: true,
    photoUploaded: false,
    proofPhotos: [],
  }));
  await Milestone.insertMany(milestoneDocs);

  // 3. Generate BOM-based Purchase Requisitions (PR)
  const countPRs = await PurchaseRequisition.countDocuments();
  const prDocs = [
    {
      prNumber: generateId('PR', countPRs + 1),
      projectId: newProjectId,
      customerName: quote.customerName,
      itemCategory: 'Solar PV Modules',
      specification: 'Mono PERC 545 Wp Bifacial TopCon',
      quantityRequired: Math.round(quote.systemCapacityKW * 2),
      unit: 'Nos',
      leftoverOffsetQty: 0,
      netOrderQty: Math.round(quote.systemCapacityKW * 2),
      date: today,
      status: 'Approved',
    },
    {
      prNumber: generateId('PR', countPRs + 2),
      projectId: newProjectId,
      customerName: quote.customerName,
      itemCategory: 'Solar Inverters',
      specification: `${quote.systemCapacityKW} kW 3-Phase Dual MPPT On-Grid`,
      quantityRequired: 1,
      unit: 'Nos',
      leftoverOffsetQty: 0,
      netOrderQty: 1,
      date: today,
      status: 'Approved',
    },
    {
      prNumber: generateId('PR', countPRs + 3),
      projectId: newProjectId,
      customerName: quote.customerName,
      itemCategory: 'Mounting Structure Iron',
      specification: 'Galvanized Hot-Dip Iron (Pre-fabricated, direct-to-site)',
      quantityRequired: 1,
      unit: 'Set',
      leftoverOffsetQty: 0,
      netOrderQty: 1,
      date: today,
      status: 'Approved',
    },
  ];
  await PurchaseRequisition.insertMany(prDocs);

  // 4. Initialize Subsidy Pipeline
  const countSubsidies = await Subsidy.countDocuments();
  await Subsidy.create({
    applicationNumber: `SUB-26-${String(countSubsidies + 101).padStart(4, '0')}`,
    projectId: newProjectId,
    customerName: quote.customerName,
    consumerNumber: `RJ-JVVNL-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    currentStage: 'Application Registered',
    daysInStage: 1,
    approvedAmount: quote.totalSubsidy || 78000,
    discomName: 'JVVNL',
    isStuck: false,
  });

  // 5. Record Advance Payment Receipt if collected
  if (advanceReceived > 0) {
    const countReceipts = await Receipt.countDocuments();
    const receiptNumber = generateId('RCT', countReceipts + 1);

    await Receipt.create({
      receiptNumber,
      projectId: newProjectId,
      customerName: quote.customerName,
      amount: advanceReceived,
      paymentMode: conversionParams.paymentMode || 'Bank Transfer',
      referenceNumber: conversionParams.referenceNumber || `TXN-${Date.now().toString().slice(-6)}`,
      date: today,
    });

    await CustomerPayment.create({
      projectId: newProjectId,
      customerName: quote.customerName,
      amount: advanceReceived,
      paymentMode: conversionParams.paymentMode || 'Bank Transfer',
      referenceNumber: conversionParams.referenceNumber || `TXN-${Date.now().toString().slice(-6)}`,
      date: today,
      status: 'Received & Verified',
      notes: 'Initial order advance payment',
    });
  }

  // 6. Initialize Project P&L record
  const estCOGS = Math.round(contractValue * 0.76);
  const grossProfit = contractValue - estCOGS;
  const grossMarginPct = ((grossProfit / contractValue) * 100).toFixed(1);

  await ProjectPnL.create({
    projectId: newProjectId,
    customerName: quote.customerName,
    contractValue,
    totalCost: estCOGS,
    moduleCost: Math.round(contractValue * 0.52),
    structureCost: Math.round(contractValue * 0.12),
    bosCost: Math.round(contractValue * 0.08),
    laborCost: Math.round(contractValue * 0.04),
    grossProfit,
    grossMarginPct: `${grossMarginPct}%`,
    status: 'Active (In Progress)',
  });

  // 7. Update Quotation status
  quote.status = 'Converted to Order';
  await quote.save();

  // 8. Push System Notification
  await Notification.create({
    title: 'Atomic Project Initialization',
    message: `Quotation ${quote.quoteNumber} converted into Project ${newProjectId} for ${quote.customerName}. Milestones, PRs, and subsidy registered.`,
    type: 'projects',
    targetPath: `/projects/${newProjectId}`,
    unread: true,
    timestamp: 'Just now',
  });

  return newProject;
};

// TRIPLE-LOCK PROJECT CLOSURE ENGINE
const executeProjectClosure = async (projectId, user, options = {}) => {
  const project = await Project.findOne({ projectId });
  if (!project) throw new Error('Project not found');
  if (project.status === 'Closed') throw new Error('Project is already closed');

  // Condition 1: Zero Dues
  if (project.balanceDue > 0) {
    throw new Error(`Closure Blocked (Lock 1): Outstanding customer/bank balance is ₹${project.balanceDue.toLocaleString('en-IN')}. Receivables must be ₹0.00.`);
  }

  // Condition 2: Net Metering Completed OR Approved Not Applicable with Reason
  const subsidy = await Subsidy.findOne({ projectId });
  const isNetMeteringDone =
    subsidy &&
    (subsidy.currentStage === 'Net Metering Done' ||
      subsidy.currentStage === 'Subsidy Credited to Customer');

  const notApplicableReason = options.notApplicableReason || project.netMeteringNotApplicableReason;
  const isNotApplicable =
    (subsidy && subsidy.currentStage === 'Not Applicable') ||
    (notApplicableReason && String(notApplicableReason).trim().length > 0);

  if (!isNetMeteringDone && !isNotApplicable) {
    throw new Error(`Closure Blocked (Lock 2): DISCOM Net Metering is not completed. Current status: "${subsidy ? subsidy.currentStage : 'No Record'}". If Net Metering is Not Applicable, an approved justification reason is required.`);
  }

  // Condition 3: Owner / Admin Authorization
  const isOwner = user.roles && user.roles.includes('Owner / Admin');
  if (!isOwner) {
    throw new Error('Closure Blocked (Lock 3): Only users with the "Owner / Admin" role are authorized to approve Project Closure.');
  }

  const today = new Date().toISOString().split('T')[0];
  project.status = 'Closed';
  project.closedDate = today;
  project.pnlLocked = true;
  if (notApplicableReason) {
    project.netMeteringNotApplicableReason = String(notApplicableReason).trim();
  }
  await project.save();

  // Lock P&L permanently
  await ProjectPnL.findOneAndUpdate(
    { projectId },
    { status: 'Locked (Project Closed)' }
  );

  await Notification.create({
    title: 'Project Closed & Locked',
    message: `Project ${projectId} (${project.customerName}) officially closed. P&L statement permanently locked.`,
    type: 'projects',
    targetPath: `/projects/${projectId}`,
    unread: true,
    timestamp: 'Just now',
  });

  return project;
};

module.exports = {
  atomicConvertQuotationToOrder,
  executeProjectClosure,
};
