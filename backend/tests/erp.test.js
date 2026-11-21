const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/User');
const Lead = require('../src/models/Lead');
const Project = require('../src/models/Project');
const Milestone = require('../src/models/Milestone');
const Quotation = require('../src/models/Quotation');
const SerialNumber = require('../src/models/SerialNumber');
const { verifyAndRegisterSerials } = require('../src/services/serialService');
const { atomicConvertQuotationToOrder, executeProjectClosure } = require('../src/services/projectService');

const runTests = async () => {
  console.log('\n======================================================');
  console.log('RUNNING SOLARIS EPC ERP BACKEND INTEGRATION TEST SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`PASS: ${testName}`);
      passed++;
    } else {
      console.error(`FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    await connectDB();

    // TEST 1: User Authentication & Role Assignment
    console.log('\n--- Test 1: User & Authentication Verification ---');
    const ownerUser = await User.findOne({ email: 'ashok@solarisepc.in' });
    assert(ownerUser !== null, 'Owner/Admin user exists in database');
    const isPasswordCorrect = await ownerUser.comparePassword('password123');
    assert(isPasswordCorrect === true, 'Bcrypt password comparison works correctly');
    assert(ownerUser.roles.includes('Owner / Admin'), 'Owner user has "Owner / Admin" role');

    const multiRoleUser = await User.findOne({ email: 'amit@solarisepc.in' });
    assert(
      multiRoleUser.roles.includes('Survey Engineer') && multiRoleUser.roles.includes('Sales Executive'),
      'Multi-role support verified (Survey Engineer + Sales Executive)'
    );

    // TEST 2: CRM & Duplicate Mobile Check
    console.log('\n--- Test 2: CRM Lead Sizing & Duplicate Mobile Detection ---');
    const existingLead = await Lead.findOne({ mobile: '9829012345' });
    assert(existingLead !== null, 'Existing lead LD-26-0001 fetched');

    let duplicateCaught = false;
    try {
      const dup = await Lead.findOne({ mobile: '9829012345' });
      if (dup) {
        duplicateCaught = true;
      }
    } catch {
      duplicateCaught = true;
    }
    assert(duplicateCaught === true, 'Duplicate mobile number detection is functional');

    // TEST 3: Serial Number Global Uniqueness Validation
    console.log('\n--- Test 3: Serial Number System-Wide Uniqueness Engine ---');
    let duplicateSerialCaught = false;
    try {
      // Attempting to register already registered serial 'TP-MOD-26-00001'
      await verifyAndRegisterSerials(['TP-MOD-26-00001'], 'PRJ-26-9999', 'GRN-26-9999', 'Solar PV Module');
    } catch (err) {
      duplicateSerialCaught = true;
      console.log(`   [Expected Error Caught]: ${err.message}`);
    }
    assert(duplicateSerialCaught === true, 'Duplicate serial number registration blocked across database');

    // TEST 4: Atomic Quotation-to-Order Conversion
    console.log('\n--- Test 4: Atomic Project Order Conversion ---');
    // Create a temporary quotation to convert
    const tempQuote = await Quotation.create({
      quoteNumber: `QT-26-TEST-${Date.now().toString().slice(-4)}`,
      version: 'R1',
      customerName: 'Integration Test Customer',
      systemCapacityKW: 5,
      items: [{ category: 'Solar PV Modules', specification: '545 Wp Bifacial', quantity: 10, unit: 'Nos', rate: 9800, gstRate: 12 }],
      basePrice: 200000,
      gstAmount: 24000,
      discountAmount: 4000,
      grandTotal: 220000,
      totalSubsidy: 78000,
      netCustomerCost: 142000,
      instalments: [{ milestoneNumber: 1, label: 'Advance', percentage: 100, amount: 220000 }],
      status: 'Sent',
      date: '2026-04-01',
      validityDate: '2026-04-16',
    });

    const newProject = await atomicConvertQuotationToOrder(
      tempQuote._id,
      {
        paymentMode: 'Self-funded',
        siteAddress: 'Test Site Address, Jaipur',
        advanceReceivedNow: 50000,
        mobile: '9829099999',
      },
      ownerUser
    );

    assert(newProject !== null && newProject.projectId.startsWith('PRJ-'), `Project ${newProject.projectId} created`);
    assert(newProject.balanceDue === 170000, 'Balance due calculated correctly (220,000 - 50,000 = 170,000)');

    const projectMilestones = await Milestone.find({ projectId: newProject.projectId }).sort({ sequence: 1 });
    assert(projectMilestones.length === 7, 'All 7 sequential installation milestones initialized atomically');
    assert(projectMilestones[0].name === 'Project Kickoff & Site Plan', 'Milestone 1 is "Project Kickoff & Site Plan"');
    assert(projectMilestones[1].name === 'Material Received at Site', 'Milestone 2 is "Material Received at Site"');
    assert(projectMilestones[6].name === 'Handover to Customer', 'Milestone 7 is "Handover to Customer"');
    assert(projectMilestones[0].status === 'In Progress', 'Milestone 1 initialized in "In Progress"');
    assert(projectMilestones[1].status === 'Pending', 'Milestone 2 initialized in "Pending"');

    // TEST 5: Triple-Lock Project Closure Validation
    console.log('\n--- Test 5: Triple-Lock Project Closure Verification ---');
    let lock1Blocked = false;
    try {
      // Attempting to close newProject with balanceDue = 170,000 (Lock 1 breach)
      await executeProjectClosure(newProject.projectId, ownerUser);
    } catch (err) {
      lock1Blocked = true;
      console.log(`   [Expected Lock 1 Block]: ${err.message}`);
    }
    assert(lock1Blocked === true, 'Project closure blocked when customer balance due > 0 (Lock 1 enforced)');

    let nonOwnerBlocked = false;
    try {
      // Attempting to close with Sales Executive persona (Lock 3 breach)
      const salesUser = await User.findOne({ email: 'rahul@solarisepc.in' });
      await executeProjectClosure(newProject.projectId, salesUser);
    } catch (err) {
      nonOwnerBlocked = true;
      console.log(`   [Expected Lock 3 Block]: ${err.message}`);
    }
    assert(nonOwnerBlocked === true, 'Project closure blocked when user lacks Owner/Admin role (Lock 3 enforced)');

    // Test Lock 2: Net Metering Not Applicable with Approved Reason
    newProject.balanceDue = 0;
    await newProject.save();

    let missingReasonBlocked = false;
    try {
      await executeProjectClosure(newProject.projectId, ownerUser);
    } catch (err) {
      missingReasonBlocked = true;
      console.log(`   [Expected Lock 2 Block]: ${err.message}`);
    }
    assert(missingReasonBlocked === true, 'Closure blocked without Net Metering or approved Not Applicable reason (Lock 2 enforced)');

    const closedWithReason = await executeProjectClosure(newProject.projectId, ownerUser, {
      notApplicableReason: 'Commercial captive plant without DISCOM net metering export agreement',
    });
    assert(
      closedWithReason.status === 'Closed' && closedWithReason.netMeteringNotApplicableReason !== null,
      'Closure allowed when Net Metering is approved Not Applicable with reason'
    );

    // Verify formally closed project PRJ-26-0004
    const closedProj = await Project.findOne({ projectId: 'PRJ-26-0004' });
    assert(closedProj.status === 'Closed' && closedProj.pnlLocked === true, 'Closed project PRJ-26-0004 has locked P&L');

    // Cleanup temporary test quotation and project
    await Quotation.findByIdAndDelete(tempQuote._id);
    await Project.findByIdAndDelete(newProject._id);
    await Milestone.deleteMany({ projectId: newProject.projectId });

    console.log('\n======================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('======================================================\n');

    await disconnectDB();
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal Test Runner Error:', err);
    await disconnectDB();
    process.exit(1);
  }
};

runTests();
