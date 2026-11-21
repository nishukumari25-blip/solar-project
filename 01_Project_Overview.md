# Solaris EPC – Solar ERP System (Phase 1)
## Document 01: Project Overview & Scope Definition

---

### 1. Project Information
- **Project Name:** Solaris EPC – Solar ERP System (Phase 1)
- **Specification Source:** *Solar EPC ERP: Phase 1 Specification for Development* (Author: @Ashutosh Bhardwaj, Dated: Nov 20, 2026)
- **Document Version:** 1.0.0
- **Document Status:** Baseline Blueprint & UI/UX Planning Specification
- **Target Prototype Technology Stack:** React + Vite (Single Page Application / Progressive Web App architecture)

---

### 2. Project Purpose
The primary purpose of **Solaris EPC (Phase 1)** is to deliver an integrated, end-to-end web and mobile enterprise resource planning (ERP) system tailored specifically for a solar engineering, procurement, and construction (EPC) business in India. 

The system governs the complete commercial, operational, technical, and regulatory lifecycle of solar rooftop installations—from initial customer enquiry (lead capture) through site survey, engineering design & BOM generation, quotation pricing with government subsidy computation, order conversion, milestone-driven on-site execution, direct-to-site procurement, government subsidy and DISCOM net-metering liaisoning, customer payments & bank loan disbursements, vendor bill three-way matching, to final project closure and profitability (P&L) determination.

A fundamental architectural tenet of Solaris EPC is that **every transactional and operational record hangs off a single, immutable `Project ID`**. A project reaches closure if and only if:
1. The customer and financing bank have paid in full (zero balance due).
2. DISCOM net metering is completed and recorded.

---

### 3. Business Background
- **Operating Context:** The business is an Indian solar EPC enterprise operating in Rajasthan, with its operational launch centered in **Jaipur**.
- **Market Segments:** The primary focus is **Residential Rooftop Solar**, with commercial and industrial (C&I) clients handled via the exact same operational and financial workflow.
- **Regulatory Framework:** The operational workflow aligns strictly with central government schemes (notably **PM Surya Ghar: Muft Bijli Yojana**) and Rajasthan state-level rooftop solar renewable policies.
- **DISCOM Integration Landscape:** Operations interface with regional DISCOMs (e.g., Jaipur Vidyut Vitran Nigam Limited - JVVNL, Ajmer AVVNL, Jodhpur JdVVNL). Geographic masters (States, Districts, DISCOMs) are fully configurable at runtime, ensuring geographic expansion across India without engineering modifications or code redeployment.
- **Financial & Regulatory Environment:** Operates under Indian financial year conventions (April 1 to March 31), currency in Indian Rupees (INR, ₹), standard Indian numbering system (Lakhs and Crores), and Goods & Services Tax (GST) compliance.

---

### 4. Problem Statement & Operational Reality
The predecessor prototype (*SolarFlow*) and manual ad-hoc operating models failed in practical solar EPC execution due to structural discrepancies in solar-specific operational realities:

1. **Subsidy Accounting Confusion:** Many ERPs incorrectly treat government capital subsidies as corporate receivables. In reality, under PM Surya Ghar and state schemes, subsidies are disbursed **directly into the customer's personal bank account**. The EPC contractor never receives this capital. ERP systems that booked subsidies as company receivables caused massive balance sheet distortions and collection follow-up errors.
2. **Warehouse vs. Direct-to-Site Reality:** Generic ERPs enforce complex multi-echelon central warehouse inventories. Solaris EPC operates on a **Zero-Warehouse / Direct-to-Site Procurement Model**. Every purchase order is cut specifically for a designated project and delivered directly to the customer's rooftop site. Mounting structure iron is procured pre-sized and fabricated from vendors, eliminating in-house factory fabrication.
3. **Serial Number Leakage & Net-Metering Rejections:** DISCOM officials and central subsidy auditors require physical verification of panel, inverter, and battery serial numbers against approved ALMM (Approved List of Models and Manufacturers) and DCR (Domestic Content Requirement) lists. Lack of serialized traceability at Goods Receipt Note (GRN) stage leads to unverified components, subsidy rejections, and warranty voids.
4. **Bank Loan Disconnection:** In residential solar, financing is bifurcated between customer margin money and bank loans. Banks release funds in two distinct tranches: Tranche 1 upon loan sanction, and Tranche 2 **only after Work Completion Report (WCR) submission and DISCOM Service Order (SO) / net-metering completion**. Failure to couple subsidy liaison milestones with bank disbursement triggers causes severe working capital blockage.
5. **Milestone Sequencing Breakdown:** Teams frequently attempted to mount solar panels before structure completion or claimed commissioning before physical materials arrived. 
6. **Margin Slippage & Pricing Leakage:** Quotation discounts granted without managerial sign-off and vendor invoices passed without verifying physical GRN receipts or agreed PO rates led to eroded profit margins.

---

### 5. Main Objectives
1. **Single Project ID Spine:** Establish an unalterable operational spine where CRM lead, site survey, BOM, quotation, purchase orders, GRNs, serial numbers, subsidy filings, customer receipts, and vendor bills link deterministically to one `Project ID`.
2. **Strict Sequential Gating:** Enforce automated business rule barriers that prevent out-of-order execution (e.g., blocking installation without GRN; blocking WCR submission without technical commissioning; blocking project closure without DISCOM net metering and zero outstanding dues).
3. **Rigorous Financial & Subsidy Segregation:** Clearly isolate company receivables (Grand Total payable by customer/bank) from government subsidy amounts (tracked purely as a customer liaison service, excluded from corporate balance sheets).
4. **Field-Empowered Mobile PWA:** Enable survey engineers and site supervisors to capture GPS coordinates, rooftop measurements, shading analysis, minimum 4 required site photos, customer signatures, and barcode-scanned component serial numbers offline, with automatic sync upon reconnecting.
5. **Procurement & Three-Way Matching Integrity:** Automate Purchase Requisition (PR) generation directly from the approved BOM, enforce multi-vendor RFQ lowest-landed-cost comparison, enforce managerial sign-off for POs above ₹2,00,000, and mandate 3-way matching (Bill Qty ≤ GRN Qty and Bill Rate = PO Rate) before vendor payout approval.
6. **Real-Time Operational & Cash-Flow Intelligence:** Provide role-specific dashboards with automated alerts for stuck subsidies (>45 days), stalled loans (>21 days), overdue customer instalments, and delayed milestones.

---

### 6. Project Scope
The project encompasses all operational, commercial, procurement, field-engineering, and liaison workflows necessary to take an Indian rooftop solar project from initial customer interest to final financial settlement and DISCOM grid synchronisation.

#### Scope Boundaries Summary Table
| Dimension | In-Scope (Phase 1) | Out-of-Scope (Phase 2 Deferred) |
| :--- | :--- | :--- |
| **CRM & Leads** | Lead capture, assignment, follow-ups, CSV import/export, Kanban board | Channel partner / dealer external portal |
| **Field Engineering** | Mobile site survey, GPS, photo capture, signature, BOM configuration | Automated 3D shadow shading simulation / CAD drafting tools |
| **Design & BOM** | Template-driven BOM scaling, DCR/Non-DCR rules, Item Master links | Direct inverter IoT telemetry / SCADA integrations |
| **Sales & Pricing** | Quotations, central/state subsidy calculation, payment schedule definition, PDF generation | Customer-facing self-service digital signature / payment gateway checkout |
| **Execution** | 7-stage project milestones, milestone proof photos, site delays | Post-commissioning Annual Maintenance Contracts (AMC) & warranty claims |
| **Procurement** | Project PR, multi-vendor RFQ, PO generation, site GRN, serial numbers | Central godown / multi-tier warehouse replenishment algorithms |
| **Subsidy Liaison** | PM Surya Ghar / State tracking (Feasibility, WCR, SO, Net Metering) | Direct automated API integration with National Portal / DISCOM servers |
| **Finance** | Customer instalments, loan tracking, receipts, final GST invoice, vendor 3-way match | Full general ledger, balance sheet, trial balance (handled via Tally XML export) |
| **People & Payroll** | Role-based permissions, multi-role user assignment, audit trails | Employee biometric attendance, salary payroll, leave management |

---

### 7. Phase 1 Inclusions (Detailed Modules & Capabilities)
1. **Leads and Follow-ups (CRM):** Multi-source capture (ads, referrals, walk-ins, IndiaMART), mobile duplicate prevention, Kanban board, daily 9:00 AM follow-up digests, automated status progression.
2. **Site Survey & Mobile Engineering:** Mobile-first responsive survey form, GPS geo-tagging, offline draft caching, 4-photo mandatory upload, electrical load assessment, DCR panel specification.
3. **System Design & Bill of Materials (BOM):** Recommended kWp sizing algorithm based on monthly kWh consumption, admin BOM templates, dynamic line-item scaling, item master binding.
4. **Quotations & Commercial Pricing:** Central slab & state per-kW subsidy calculation engines, user-defined flexible instalment structuring, multi-version quote revisions (R1, R2...), automated discount approval thresholds.
5. **Order Conversion & Project Initialization:** Atomic generation of Project ID (`PRJ-YY-NNNN`), payment schedule, subsidy tracking record, loan record (if applicable), and Purchase Requisition draft.
6. **Project Milestone Management:** Default 7-stage milestone progression, photo proof mandates, admin override logging, delay monitoring against planned target dates.
7. **Direct-to-Site Procurement:** Purchase Requisition (BOM minus leftovers), multi-vendor RFQ comparative evaluation, Purchase Orders with project site delivery addresses, PO approval routing.
8. **Goods Receipt Note (GRN) & Serial Traceability:** Mobile site receipt, partial challan handling, mandatory serial number scanning/bulk-pasting for panels, inverters, and batteries, cross-project duplicate serial blocking, immutable reversal audit entries.
9. **Leftover Material Tracking:** Site residue logging with transfers to other projects (PM approval) or vendor debit note generation.
10. **Government Subsidy & DISCOM Net-Metering:** Comprehensive tracking of Portal Application, DISCOM Feasibility, Commissioning, WCR submission, DISCOM Service Order (SO), Net-Meter energisation, and customer subsidy credit recording.
11. **Customer Receivables & Bank Loan Administration:** Margin money recording, Bank Tranche 1 (on loan sanction) & Tranche 2 (post-WCR/SO/net-metering) disbursement tracking, partial payment allocation, PDF receipt generation.
12. **Tax Invoicing & Payables:** Single final GST tax invoice at commissioning listing supplied serialized equipment without itemized pricing, vendor bill entry, automated 3-way matching, vendor payment ageing.
13. **Project Costing & Real-Time P&L:** Direct material costs (GRN quantity × PO rate), labor, freight/transport, liaison expenses, gross margin % calculation locked at closure.
14. **Dashboard, Reporting & System Administration:** Comprehensive executive KPI tiles, multi-category operational reports with Excel/PDF export, in-app/WhatsApp/email notifications, and master settings management.

---

### 8. Phase 1 Exclusions (Explicitly Deferred to Phase 2)
1. **Annual Maintenance Contracts (AMC) & Service Ticketing:** Post-installation preventative maintenance schedules, breakdown complaints, ticket ticketing lifecycles, and field technician dispatching.
2. **Channel Partner & Dealer Portal:** External multi-tenant portals for freelance brokers or third-party dealers to submit leads, check commission payouts, or view project progress.
3. **Inverter IoT & Telemetry Integrations:** Cloud API connectors to inverter manufacturers (e.g., Growatt, Sungrow, SolarEdge, Solis) for real-time solar generation monitoring and fault alerting.
4. **Full Financial General Ledger & Accounting:** Chart of accounts, journal entries, balance sheet, profit and loss statements at company level, bank reconciliation statements. Phase 1 provides automated XML data export formatted specifically for **Tally**.
5. **Human Resources & Payroll:** Attendance tracking, technician timesheets, leave policies, salary processing, and reimbursement management.

---

### 9. Expected Business & Technical Outcomes
- **Zero Receivables Ambiguity:** Absolute clarity that the company collects 100% of the project contract value from the customer/bank, eliminating working capital deficits caused by waiting for government subsidy disbursements.
- **100% Hardware Traceability:** Elimination of DISCOM net-metering rejections by verifying every installed solar panel and inverter serial number against purchase challans prior to structure mounting.
- **Zero Unapproved Price Slippages:** Strict enforcement of discount thresholds (>5%) and procurement commitments (>₹2,00,000) through mandatory Owner approvals.
- **Reduced Cycle Time:** Accelerated progression from lead to net metering through automated alerts for stuck subsidies (>45 days) and stalled loan tranches (>21 days).
- **Audit-Ready Compliance:** Complete immutable history of every record, status change, and approval override maintained with timestamp and user ID for at least 3 years.

---

### 10. Technology Preference for Future Prototype
- **Frontend Architecture:** Single Page Application (SPA) built using **React 18+** with **Vite** for lightning-fast module bundling and developer ergonomics.
- **Styling & Design System:** **Tailwind CSS** implementing a high-density, professional enterprise design language (slate/indigo/amber/emerald semantic palette).
- **Component Primitives & Icons:** Accessible UI component architecture paired with **Lucide React** icons.
- **Form Management & Validation:** High-performance form state handling with strict client-side validation reflecting Indian regulatory patterns (10-digit mobile, 15-character GSTIN checksum, 6-digit PIN).
- **Offline & PWA Capabilities:** Service Worker registration for Progressive Web App installability on field tablets and mobile devices, utilizing local storage / IndexedDB for offline survey and GRN drafts.
- **Visualization:** Responsive analytics charts and process flow diagrams.
- **Document & PDF Generation:** Client-side HTML-to-PDF rendering engine for instant preview and generation of Quotations, POs, Tax Invoices, and Payment Receipts within 5 seconds.
