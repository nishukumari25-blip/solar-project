const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB, disconnectDB } = require('../config/db');

// Models
const User = require('../models/User');
const Lead = require('../models/Lead');
const SiteSurvey = require('../models/SiteSurvey');
const BOMTemplate = require('../models/BOMTemplate');
const Quotation = require('../models/Quotation');
const Project = require('../models/Project');
const Milestone = require('../models/Milestone');
const Vendor = require('../models/Vendor');
const PurchaseRequisition = require('../models/PurchaseRequisition');
const PurchaseOrder = require('../models/PurchaseOrder');
const GRN = require('../models/GRN');
const SerialNumber = require('../models/SerialNumber');
const ProjectMaterial = require('../models/ProjectMaterial');
const LeftoverMaterial = require('../models/LeftoverMaterial');
const Subsidy = require('../models/Subsidy');
const WCR = require('../models/WCR');
const ServiceOrder = require('../models/ServiceOrder');
const NetMetering = require('../models/NetMetering');
const CustomerPayment = require('../models/CustomerPayment');
const BankLoan = require('../models/BankLoan');
const Invoice = require('../models/Invoice');
const Receipt = require('../models/Receipt');
const VendorBill = require('../models/VendorBill');
const ProjectPnL = require('../models/ProjectPnL');
const Approval = require('../models/Approval');
const Notification = require('../models/Notification');
const Setting = require('../models/Setting');

const seedData = require('./seedData');

const seedDatabase = async () => {
  try {
    console.log('[Seeding]: Connecting to MongoDB...');
    await connectDB();

    console.log('[Seeding]: Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Lead.deleteMany({}),
      SiteSurvey.deleteMany({}),
      BOMTemplate.deleteMany({}),
      Quotation.deleteMany({}),
      Project.deleteMany({}),
      Milestone.deleteMany({}),
      Vendor.deleteMany({}),
      PurchaseRequisition.deleteMany({}),
      PurchaseOrder.deleteMany({}),
      GRN.deleteMany({}),
      SerialNumber.deleteMany({}),
      ProjectMaterial.deleteMany({}),
      LeftoverMaterial.deleteMany({}),
      Subsidy.deleteMany({}),
      WCR.deleteMany({}),
      ServiceOrder.deleteMany({}),
      NetMetering.deleteMany({}),
      CustomerPayment.deleteMany({}),
      BankLoan.deleteMany({}),
      Invoice.deleteMany({}),
      Receipt.deleteMany({}),
      VendorBill.deleteMany({}),
      ProjectPnL.deleteMany({}),
      Approval.deleteMany({}),
      Notification.deleteMany({}),
      Setting.deleteMany({}),
    ]);

    console.log('[Seeding]: Inserting Users...');
    // Hash passwords before inserting
    const usersWithHash = await Promise.all(
      seedData.INITIAL_USERS.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        return { ...u, password: hashedPassword };
      })
    );
    await User.insertMany(usersWithHash);

    console.log('[Seeding]: Inserting Settings & Masters...');
    await Setting.create({ key: 'company', value: seedData.INITIAL_COMPANY });
    await Setting.create({ key: 'thresholds', value: seedData.INITIAL_THRESHOLDS });
    await BOMTemplate.insertMany(seedData.INITIAL_BOM_TEMPLATES);
    await Vendor.insertMany(seedData.INITIAL_VENDORS);

    console.log('[Seeding]: Inserting Leads, Surveys & Quotations...');
    await Lead.insertMany(seedData.INITIAL_LEADS);
    await SiteSurvey.insertMany(seedData.INITIAL_SURVEYS);
    await Quotation.insertMany(seedData.INITIAL_QUOTATIONS);

    console.log('[Seeding]: Inserting Projects & 7 Sequential Milestones...');
    await Project.insertMany(seedData.INITIAL_PROJECTS);

    const defaultMilestoneDefs = [
      { sequence: 1, name: 'Project Kickoff & Site Plan', description: 'Kickoff meeting, rooftop structural inspection, civil marking, and layout plan approval.' },
      { sequence: 2, name: 'Material Received at Site', description: 'Delivery of solar panels, inverters, and structures to customer site (gated by Site GRN).' },
      { sequence: 3, name: 'Structure Installed', description: 'Assembly and secure anchoring of hot-dip galvanized mounting structures on rooftop.' },
      { sequence: 4, name: 'Panels Mounted', description: 'Fixing bifacial solar PV modules with mid and end clamps and torque verification.' },
      { sequence: 5, name: 'Inverter & Wiring Complete', description: 'Inverter mounting, DCDB/ACDB connections, chemical earthing pits, and conduit cable routing.' },
      { sequence: 6, name: 'Testing & Commissioning', description: 'Pre-commissioning safety checks, anti-islanding test, and trial generation (unlocks WCR & final invoice).' },
      { sequence: 7, name: 'Handover to Customer', description: 'Handover of warranty documents, O&M manual, safety briefing, and customer sign-off.' },
    ];

    const milestonesToInsert = [];
    seedData.INITIAL_PROJECTS.forEach((p) => {
      const isClosed = p.status === 'Closed';
      const isDelayed = p.isDelayed;

      defaultMilestoneDefs.forEach((m) => {
        let status = 'Pending';
        let completedDate = null;
        let photoUploaded = false;

        if (isClosed) {
          status = 'Completed';
          completedDate = '2026-03-20';
          photoUploaded = true;
        } else if (isDelayed) {
          // Delayed on Milestone 7 (DISCOM Net Metering)
          if (m.sequence <= 6) {
            status = 'Completed';
            completedDate = '2026-03-10';
            photoUploaded = true;
          } else {
            status = 'In Progress'; // Stuck in DISCOM Net Metering
          }
        } else if (p.projectId === 'PRJ-26-0001') {
          if (m.sequence <= 3) {
            status = 'Completed';
            completedDate = '2026-02-15';
            photoUploaded = true;
          } else if (m.sequence === 4) {
            status = 'In Progress';
          }
        } else if (p.projectId === 'PRJ-26-0002') {
          if (m.sequence === 1) {
            status = 'Completed';
            completedDate = '2026-02-10';
            photoUploaded = true;
          } else if (m.sequence === 2) {
            status = 'In Progress';
          }
        } else {
          if (m.sequence === 1) status = 'In Progress';
        }

        milestonesToInsert.push({
          projectId: p.projectId,
          sequence: m.sequence,
          name: m.name,
          description: m.description,
          status,
          targetDate: '2026-04-15',
          completedDate,
          photoRequired: true,
          photoUploaded,
          proofPhotos: photoUploaded ? ['proof_photo_1.jpg'] : [],
        });
      });
    });
    await Milestone.insertMany(milestonesToInsert);

    console.log('[Seeding]: Inserting Procurement & Materials...');
    await PurchaseRequisition.insertMany([
      {
        prNumber: 'PR-26-0001',
        projectId: 'PRJ-26-0001',
        customerName: 'Ramesh Sharma',
        itemCategory: 'Solar PV Modules',
        specification: '545 Wp Bifacial Mono PERC',
        quantityRequired: 10,
        unit: 'Nos',
        leftoverOffsetQty: 0,
        netOrderQty: 10,
        date: '2026-01-20',
        status: 'Converted to PO',
      },
      {
        prNumber: 'PR-26-0002',
        projectId: 'PRJ-26-0001',
        customerName: 'Ramesh Sharma',
        itemCategory: 'Mounting Structure Iron',
        specification: 'Galvanized Hot-Dip Iron (Pre-fabricated, direct-to-site)',
        quantityRequired: 1,
        unit: 'Set',
        leftoverOffsetQty: 0,
        netOrderQty: 1,
        date: '2026-01-20',
        status: 'Converted to PO',
      },
      {
        prNumber: 'PR-26-0003',
        projectId: 'PRJ-26-0002',
        customerName: 'Sanjay Agarwal',
        itemCategory: 'Solar PV Modules',
        specification: '545 Wp Bifacial Mono PERC',
        quantityRequired: 20,
        unit: 'Nos',
        leftoverOffsetQty: 2, // 2 offset from leftovers
        netOrderQty: 18,
        date: '2026-01-25',
        status: 'Approved',
      },
    ]);

    await PurchaseOrder.insertMany([
      {
        poNumber: 'PO-26-0001',
        projectId: 'PRJ-26-0001',
        vendorId: 'VND-001',
        vendorName: 'Tata Power Solar Systems Ltd',
        items: [{ itemCategory: 'Solar PV Modules', specification: '545 Wp Bifacial Mono PERC', quantity: 10, unit: 'Nos', rate: 9800 }],
        totalAmount: 109760, // 98,000 + 12% GST
        shippingAddress: 'Plot 42, Chitrakoot, Vaishali Nagar, Jaipur (Customer Rooftop Site)',
        date: '2026-01-22',
        status: 'Fully Received',
      },
      {
        poNumber: 'PO-26-0002',
        projectId: 'PRJ-26-0001',
        vendorId: 'VND-004',
        vendorName: 'GalvaFab Structures Pvt Ltd',
        items: [{ itemCategory: 'Mounting Structure Iron', specification: 'Galvanized Hot-Dip Iron (Pre-fabricated)', quantity: 1, unit: 'Set', rate: 32000 }],
        totalAmount: 37760, // 32,000 + 18% GST
        shippingAddress: 'Plot 42, Chitrakoot, Vaishali Nagar, Jaipur (Customer Rooftop Site)',
        date: '2026-01-23',
        status: 'Fully Received',
      },
      {
        poNumber: 'PO-26-0003',
        projectId: 'PRJ-26-0002',
        vendorId: 'VND-002',
        vendorName: 'Waaree Energies Limited',
        items: [{ itemCategory: 'Solar PV Modules', specification: '545 Wp TopCon Bifacial', quantity: 18, unit: 'Nos', rate: 9800 }],
        totalAmount: 197568,
        shippingAddress: 'B-12, Malviya Nagar, Jaipur (Customer Rooftop Site)',
        date: '2026-01-28',
        status: 'Sent',
      },
    ]);

    await GRN.insertMany([
      {
        grnNumber: 'GRN-26-0001',
        poId: 'PO-26-0001',
        poNumber: 'PO-26-0001',
        projectId: 'PRJ-26-0001',
        vendorName: 'Tata Power Solar Systems Ltd',
        challanNumber: 'TP-CH-99120',
        deliveryDate: '2026-01-28',
        receivedQuantity: 10,
        itemCategory: 'Solar PV Modules',
        serialNumbers: [
          'TP-MOD-26-00001', 'TP-MOD-26-00002', 'TP-MOD-26-00003', 'TP-MOD-26-00004', 'TP-MOD-26-00005',
          'TP-MOD-26-00006', 'TP-MOD-26-00007', 'TP-MOD-26-00008', 'TP-MOD-26-00009', 'TP-MOD-26-00010',
        ],
        challanPhotoUploaded: true,
        remarks: 'Delivered in good condition without physical damages or glass fractures.',
        status: 'Received at Site',
        isReversed: false,
      },
      {
        grnNumber: 'GRN-26-0002',
        poId: 'PO-26-0002',
        poNumber: 'PO-26-0002',
        projectId: 'PRJ-26-0001',
        vendorName: 'GalvaFab Structures Pvt Ltd',
        challanNumber: 'GF-CH-44102',
        deliveryDate: '2026-01-29',
        receivedQuantity: 1,
        itemCategory: 'Mounting Structure Iron',
        serialNumbers: ['GF-STR-26-0081'],
        challanPhotoUploaded: true,
        remarks: 'Pre-fabricated members unloaded at terrace stairs.',
        status: 'Received at Site',
        isReversed: false,
      },
    ]);

    await SerialNumber.insertMany([
      { serialNumber: 'TP-MOD-26-00001', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'TP-MOD-26-00002', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'TP-MOD-26-00003', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'TP-MOD-26-00004', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'TP-MOD-26-00005', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'TP-MOD-26-00006', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'TP-MOD-26-00007', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'TP-MOD-26-00008', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'TP-MOD-26-00009', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'TP-MOD-26-00010', itemType: 'Solar PV Module', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
      { serialNumber: 'SOL-INV-26-0041', itemType: 'Solar Inverter', projectId: 'PRJ-26-0001', grnNumber: 'GRN-26-0001', scannedDate: '2026-01-28' },
    ]);

    await ProjectMaterial.insertMany([
      { projectId: 'PRJ-26-0001', category: 'Solar PV Modules', specification: '545 Wp Bifacial Mono PERC', bomQty: 10, poQty: 10, grnQty: 10, unit: 'Nos', status: 'Fulfilled' },
      { projectId: 'PRJ-26-0001', category: 'Solar Inverters', specification: '5 kW 3-Phase On-Grid Dual MPPT', bomQty: 1, poQty: 1, grnQty: 1, unit: 'Nos', status: 'Fulfilled' },
      { projectId: 'PRJ-26-0001', category: 'Mounting Structure Iron', specification: 'Galvanized Hot-Dip Iron (Pre-fab)', bomQty: 1, poQty: 1, grnQty: 1, unit: 'Set', status: 'Fulfilled' },
      { projectId: 'PRJ-26-0002', category: 'Solar PV Modules', specification: '545 Wp Bifacial Mono PERC', bomQty: 20, poQty: 18, grnQty: 0, unit: 'Nos', status: 'PO Issued' },
    ]);

    await LeftoverMaterial.insertMany([
      { sourceProjectId: 'PRJ-26-0004', itemDescription: 'Solar DC Cable 4 sq mm (Copper)', quantity: 25, unit: 'Meters', condition: 'Brand New / Prime', status: 'Available at Site', transferredToProject: null },
      { sourceProjectId: 'PRJ-26-0004', itemDescription: 'Aluminium Mid Clamps (35mm)', quantity: 8, unit: 'Nos', condition: 'Brand New / Prime', status: 'Available at Site', transferredToProject: null },
    ]);

    console.log('[Seeding]: Inserting Subsidy, WCR, SO & Net Metering...');
    await Subsidy.insertMany([
      { applicationNumber: 'SUB-26-0101', projectId: 'PRJ-26-0001', customerName: 'Ramesh Sharma', consumerNumber: 'RJ-JVVNL-1029384729', currentStage: 'Installation Uploaded', daysInStage: 4, approvedAmount: 78000, discomName: 'JVVNL' },
      { applicationNumber: 'SUB-26-0102', projectId: 'PRJ-26-0002', customerName: 'Sanjay Agarwal', consumerNumber: 'RJ-JVVNL-2039485710', currentStage: 'Feasibility Approved', daysInStage: 12, approvedAmount: 78000, discomName: 'JVVNL' },
      { applicationNumber: 'SUB-26-0103', projectId: 'PRJ-26-0003', customerName: 'Kailash Meena', consumerNumber: 'RJ-JVVNL-3049586721', currentStage: 'DISCOM Inspection', daysInStage: 48, approvedAmount: 78000, discomName: 'JVVNL', isStuck: true }, // STUCK >= 45 days
      { applicationNumber: 'SUB-26-0104', projectId: 'PRJ-26-0004', customerName: 'Praveen Shekhawat', consumerNumber: 'RJ-JVVNL-4059687832', currentStage: 'Net Metering Done', daysInStage: 2, approvedAmount: 78000, discomName: 'JVVNL' },
    ]);

    await WCR.insertMany([
      { wcrNumber: 'WCR-26-0001', projectId: 'PRJ-26-0001', customerName: 'Ramesh Sharma', capacityKW: 5, submissionDate: null, status: 'Draft' },
      { wcrNumber: 'WCR-26-0003', projectId: 'PRJ-26-0003', customerName: 'Kailash Meena', capacityKW: 3, submissionDate: '2026-03-22', status: 'Submitted' },
      { wcrNumber: 'WCR-26-0004', projectId: 'PRJ-26-0004', customerName: 'Praveen Shekhawat', capacityKW: 6, submissionDate: '2026-03-22', status: 'Approved by DISCOM' },
    ]);

    await ServiceOrder.insertMany([
      { soNumber: 'SO-DISCOM-26-0101', projectId: 'PRJ-26-0001', customerName: 'Ramesh Sharma', testingFeeStatus: 'Paid (₹2,500)', status: 'Pending Inspection' },
      { soNumber: 'SO-DISCOM-26-0103', projectId: 'PRJ-26-0003', customerName: 'Kailash Meena', testingFeeStatus: 'Paid (₹2,500)', status: 'Testing Completed' },
      { soNumber: 'SO-DISCOM-26-0104', projectId: 'PRJ-26-0004', customerName: 'Praveen Shekhawat', testingFeeStatus: 'Paid (₹2,500)', meterReleaseDate: '2026-03-28', status: 'Meter Released' },
    ]);

    await NetMetering.insertMany([
      { projectId: 'PRJ-26-0001', customerName: 'Ramesh Sharma', capacityKW: 5, status: 'Meter Testing in Progress', unlocksTranche2: false },
      { projectId: 'PRJ-26-0003', customerName: 'Kailash Meena', capacityKW: 3, status: 'Meter Testing in Progress', unlocksTranche2: false },
      { projectId: 'PRJ-26-0004', customerName: 'Praveen Shekhawat', capacityKW: 6, meterNumber: 'GENUS-BI-26-0004', importReading: '00000.0 kWh', exportReading: '00000.0 kWh', syncDate: '2026-03-29', status: 'Synchronized & Operational', unlocksTranche2: true },
    ]);

    console.log('[Seeding]: Inserting Financial Records...');
    await BankLoan.insertMany([
      {
        sanctionRef: 'SBI-SOL-26-001',
        projectId: 'PRJ-26-0002',
        customerName: 'Sanjay Agarwal',
        bankName: 'State Bank of India',
        sanctionedAmount: 320000,
        tranche1Amount: 180000,
        tranche1Status: 'Disbursed',
        tranche2Amount: 140000,
        tranche2Status: 'Pending',
        daysInProcessing: 8,
        status: 'Tranche 1 Disbursed',
      },
      {
        sanctionRef: 'CAN-SOL-26-002',
        projectId: 'PRJ-26-0003',
        customerName: 'Kailash Meena',
        bankName: 'Canara Bank',
        sanctionedAmount: 120000,
        tranche1Amount: 87000,
        tranche1Status: 'Disbursed',
        tranche2Amount: 33000,
        tranche2Status: 'Pending',
        daysInProcessing: 28, // STUCK >= 21 days
        status: 'Tranche 2 Awaiting Net Metering',
      },
    ]);

    await CustomerPayment.insertMany([
      { projectId: 'PRJ-26-0001', customerName: 'Ramesh Sharma', amount: 49000, paymentMode: 'Bank Transfer / NEFT', referenceNumber: 'UTR-HDFC-991823', date: '2026-01-18', status: 'Received & Verified', notes: 'Stage 1 Advance' },
      { projectId: 'PRJ-26-0001', customerName: 'Ramesh Sharma', amount: 171500, paymentMode: 'Bank Transfer / NEFT', referenceNumber: 'UTR-HDFC-994112', date: '2026-01-29', status: 'Received & Verified', notes: 'Stage 2 Material Dispatch' },
      { projectId: 'PRJ-26-0004', customerName: 'Praveen Shekhawat', amount: 285000, paymentMode: 'Bank Transfer / NEFT', referenceNumber: 'UTR-ICICI-441029', date: '2026-03-30', status: 'Received & Verified', notes: 'Full Contract Clearance' },
    ]);

    await Receipt.insertMany([
      { receiptNumber: 'RCT-26-0001', projectId: 'PRJ-26-0001', customerName: 'Ramesh Sharma', amount: 49000, paymentMode: 'Bank Transfer / NEFT', referenceNumber: 'UTR-HDFC-991823', date: '2026-01-18' },
      { receiptNumber: 'RCT-26-0002', projectId: 'PRJ-26-0001', customerName: 'Ramesh Sharma', amount: 171500, paymentMode: 'Bank Transfer / NEFT', referenceNumber: 'UTR-HDFC-994112', date: '2026-01-29' },
      { receiptNumber: 'RCT-26-0003', projectId: 'PRJ-26-0004', customerName: 'Praveen Shekhawat', amount: 285000, paymentMode: 'Bank Transfer / NEFT', referenceNumber: 'UTR-ICICI-441029', date: '2026-03-30' },
    ]);

    await Invoice.insertMany([
      {
        invoiceNumber: 'INV/25-26/0001',
        projectId: 'PRJ-26-0004',
        customerName: 'Praveen Shekhawat',
        systemCapacityKW: 6,
        taxableAmount: 254464,
        cgst: 15268,
        sgst: 15268,
        totalTax: 30536,
        grandTotal: 285000,
        invoiceDate: '2026-03-25',
        status: 'Issued',
      },
    ]);

    await VendorBill.insertMany([
      { billNumber: 'BILL-TP-26-881', vendorName: 'Tata Power Solar Systems Ltd', poNumber: 'PO-26-0001', projectId: 'PRJ-26-0001', billAmount: 109760, matchStatus: 'Matched 100%', dueDate: '2026-02-28', paymentStatus: 'Paid' },
      { billNumber: 'BILL-GF-26-119', vendorName: 'GalvaFab Structures Pvt Ltd', poNumber: 'PO-26-0002', projectId: 'PRJ-26-0001', billAmount: 37760, matchStatus: 'Matched 100%', dueDate: '2026-03-05', paymentStatus: 'Paid' },
    ]);

    await ProjectPnL.insertMany([
      { projectId: 'PRJ-26-0001', customerName: 'Ramesh Sharma', contractValue: 245000, totalCost: 186200, moduleCost: 127400, structureCost: 29400, bosCost: 19600, laborCost: 9800, grossProfit: 58800, grossMarginPct: '24.0%', status: 'Active (In Progress)' },
      { projectId: 'PRJ-26-0002', customerName: 'Sanjay Agarwal', contractValue: 460000, totalCost: 349600, moduleCost: 239200, structureCost: 55200, bosCost: 36800, laborCost: 18400, grossProfit: 110400, grossMarginPct: '24.0%', status: 'Active (In Progress)' },
      { projectId: 'PRJ-26-0003', customerName: 'Kailash Meena', contractValue: 165000, totalCost: 125400, moduleCost: 85800, structureCost: 19800, bosCost: 13200, laborCost: 6600, grossProfit: 39600, grossMarginPct: '24.0%', status: 'Active (In Progress)' },
      { projectId: 'PRJ-26-0004', customerName: 'Praveen Shekhawat', contractValue: 285000, totalCost: 216600, moduleCost: 148200, structureCost: 34200, bosCost: 22800, laborCost: 11400, grossProfit: 68400, grossMarginPct: '24.0%', status: 'Locked (Project Closed)' },
    ]);

    console.log('[Seeding]: Inserting Approvals & Notifications...');
    await Approval.insertMany([
      {
        module: 'Quotation Discount',
        refId: 'QT-26-0003-R1',
        projectId: null,
        customerName: 'Vikramaditya Rathore',
        requestedBy: 'Rahul Verma',
        requestDate: '2026-02-14',
        details: 'Discount of 5.8% (₹23,100) exceeds 5% threshold. Total: ₹6,60,000.',
        status: 'Pending',
        approverRole: 'Owner / Admin',
        remarks: '',
      },
    ]);

    await Notification.insertMany([
      { title: 'Project Delayed', message: 'Project PRJ-26-0003 (Kailash Meena) is delayed by 28 days due to DISCOM meter delay.', type: 'projects', targetPath: '/projects/PRJ-26-0003', unread: true, timestamp: '1 hour ago' },
      { title: 'Subsidy Stuck ≥ 45 Days', message: 'Application SUB-26-0103 has been in DISCOM Inspection for 48 days. Liaison action needed.', type: 'subsidy', targetPath: '/subsidy/applications', unread: true, timestamp: '3 hours ago' },
      { title: 'Quotation Pending Approval', message: 'Quotation QT-26-0003-R1 has a discount of 5.8% exceeding the 5% threshold.', type: 'approval', targetPath: '/sales/approvals', unread: true, timestamp: 'Yesterday' },
    ]);

    console.log('[Seeding]: SUCCESS! All database collections populated with Phase 1 data.');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('[Seeding Error]:', err);
    process.exit(1);
  }
};

seedDatabase();
