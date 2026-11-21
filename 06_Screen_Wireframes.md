# Solaris EPC – Solar ERP System (Phase 1)
## Document 06: Screen-by-Screen UI/UX Wireframe & Interaction Blueprint

---

### 1. Architectural Guidelines for Wireframes
- **Information Density:** Clean, high-density enterprise layout suited for complex multi-stage solar installations.
- **Mobile Responsive & PWA Ready:** Field operations screens (Site Survey, Milestone Updates, GRN at Site) are designed mobile-first with large touch targets and offline-drafting feedback.
- **Standard Layout Structure:** Each wireframe specifies: (1) Header & Breadcrumb, (2) Layout / Split Panels, (3) Key Metric Summary Cards, (4) Form Fields or Table Columns, (5) Primary CTA Button, (6) Secondary Actions, and (7) Navigation Behavior.

---

### 2. Comprehensive 24-Screen Wireframe Blueprint

---

#### Screen 01: Login & Authentication Screen
- **Screen Purpose:** Secure gateway for employee access supporting Email/Mobile + Password and OTP login with session persistence.
- **Layout:** Centered card with split-screen branding on desktop (Left: Solar EPC installation imagery & system value metrics; Right: Authentication form).
- **Header:** Solaris EPC logo, "Sign in to your account", Jaipur Branch badge.
- **Form Fields:**
  - Login Identifier (`email_or_mobile`): Email Address or 10-digit Mobile Number.
  - Authentication Method Toggle: `Password` or `Get OTP`.
  - Password Input (with visibility toggle) OR 6-digit OTP verification input.
  - "Remember this device for 30 days" checkbox.
- **Actions & Buttons:**
  - Primary Action: `[Sign In to Dashboard]` (High-contrast indigo button).
  - Secondary Action: `[Send OTP to Mobile]`, `[Forgot Password?]`.
- **Navigation Behavior:** Authenticates via backend RBAC, sets session timeout (30 min idle), directs user to their default role landing page (Owner → Dashboard; Survey Engineer → My Surveys; Sales → Leads).

```
+------------------------------------+------------------------------------+
|         BRAND HERO PANEL           |            LOGIN PANEL             |
|                                    |                                    |
|       [SOLARIS EPC BRAND]          |          [COMPANY LOGO]            |
|                                    |         Sign in to ERP             |
|   "Powering India's Rooftop        |                                    |
|    Solar Revolution"               |  Identifier: [98290XXXXX / Email ] |
|                                    |  Auth Mode:  (•) Password  ( ) OTP |
|   • 100% Project Traceability      |  Password:   [••••••••••••••••] 👁 |
|   • DISCOM Net Metering Compliance |  [ ] Keep me signed in (30 days)   |
|   • Real-Time Margin Oversight     |                                    |
|                                    |       [ SIGN IN TO DASHBOARD ]     |
|                                    |                                    |
|   Jaipur Operating Hub v1.0        |   Trouble signing in? Contact Admin|
+------------------------------------+------------------------------------+
```

---

#### Screen 02: Main Executive Dashboard
- **Screen Purpose:** Unified operational cockpit displaying critical sales, execution, cash-flow, and regulatory metrics with filtered drilldowns.
- **Header:** "Operational Dashboard", Date Range Selector ("This Month (Nov 2026)"), Quick Actions (`[+ Add Lead]`, `[+ New Project]`).
- **Summary Cards Grid (12 Core Tiles):**
  1. *Leads This Month:* Count & Conversion % (e.g., `42 Leads | 28.5% Won`).
  2. *kW Sold This Month:* Total Capacity in kWp (e.g., `148.5 kWp`).
  3. *Projects by Status:* Visual bar with count by stage + `[Delayed: 4]` in red alert pill.
  4. *Receivables Split:* Customer (`₹18.4L`) vs. Bank Loans (`₹32.1L`).
  5. *Collections This Month:* Total cash collected (`₹41.2L`).
  6. *Payables Due This Week:* Vendor commitments due (`₹14.8L`).
  7. *Pending Deliveries:* POs awaiting site GRN (`6 Deliveries Pending`).
  8. *Awaiting DISCOM Net Metering:* Projects commissioned waiting for net meter (`9 Projects`).
  9. *Awaiting WCR / SO:* Projects needing DISCOM filings (`5 Projects`).
  10. *Stuck Subsidies (>45 Days):* Critical alert tile (`3 Applications Stuck` in red).
  11. *Loans Awaiting Sanction / Tranche 2:* Financing bottleneck tile (`7 Loans Pending`).
  12. *Pending Subsidy Credit:* Net-metered customers awaiting govt credit (`11 Customers`).
- **Main Section Split:**
  - *Left (65%):* Active Project Pipeline Gantt / Status breakdown & Urgent Operational Bottlenecks table.
  - *Right (35%):* Overdue Follow-ups Digest (9:00 AM alerts) & Cash Inflow/Outflow Forecast.
- **Primary Action:** Clicking ANY tile opens the underlying pre-filtered data list.
- **Navigation:** Deep links into Leads, Projects, Subsidy, and Receivables.

---

#### Screen 03: Leads List Screen (Table View)
- **Screen Purpose:** High-volume lead management grid with search, filtering, and bulk actions.
- **Header:** "Leads Directory", View Toggle `[List View | Kanban View]`, Export `[Export CSV]`, CTA `[+ Add Lead]`.
- **Top Summary Tiles:** Total Leads (`142`), Contacted (`38`), Survey Scheduled (`19`), Quotes Sent (`24`), Overdue Follow-ups (`7` in red).
- **Filter Toolbar:** Search by Name/Mobile, Status filter dropdown, Source filter, Salesperson filter, District filter, "Overdue Follow-ups Only" toggle.
- **Table Columns:**
  `[Checkbox] | Lead ID | Customer Name | Mobile | District | Segment | Bill (₹) | Load (kW) | Status Pill | Assigned To | Next Follow-up | Actions (···)`
- **Row Actions:** WhatsApp direct click icon, Schedule Survey, Create Quote, Mark Lost, View Details.
- **Navigation:** Clicking customer name navigates to Screen 06 (Lead Details).

---

#### Screen 04: Leads Kanban Screen (Visual Pipeline)
- **Screen Purpose:** Visual sales pipeline allowing drag-and-drop status progression.
- **Header:** Same as Screen 03, with "Kanban" toggled active.
- **Columns (Statuses in Order):**
  `New (12)` | `Contacted (18)` | `Survey Scheduled (8)` | `Quote Sent (14)` | `Negotiation (6)` | `Won (Locked)`
- **Kanban Card Content:**
  - Customer Name & Segment badge (Residential / Commercial).
  - 10-digit Mobile number with **one-tap green WhatsApp icon**.
  - System Capacity / Monthly Bill (e.g., `₹4,500/mo | ~3.3 kW`).
  - Source badge (e.g., `Meta Ads`, `Referral`).
  - Next follow-up date badge (turns red if overdue).
  - Assigned Salesperson avatar.
- **Interaction:** Dragging a card between columns updates lead status and prompts for notes or next action. (Note: Dragging to `Won` is blocked; Won is set only via quote conversion).

---

#### Screen 05: Add / Edit Lead Form
- **Screen Purpose:** Capture comprehensive customer and technical parameters for a new prospect.
- **Layout:** Responsive modal or clean two-column full-page form.
- **Form Sections & Fields:**
  - *Section 1: Contact Information:* Customer Name*, Mobile* (10 digits, Indian), Alternate Mobile, Email, Full Installation Address, City, District*, State* (default: Rajasthan), PIN Code* (6 digits).
  - *Section 2: Technical & Utility Data:* Lead Source* (master dropdown), Segment* (`Residential`, `Commercial`, `Industrial`), Monthly Electricity Bill (₹), Sanctioned Load (kW), DISCOM (e.g., `JVVNL`), Roof Ownership (`Owned`, `Rented`), Roof Type (`Flat RCC`, `Pitched Tin Shed`, `Tile Roof`).
  - *Section 3: Assignment & Follow-up:* Assigned Sales Executive*, Initial Follow-up Date*, Priority, Notes / Customer Requirements.
- **Validations:** Real-time duplicate check on mobile number (raises alert dialog if found); GSTIN required if segment is Commercial.
- **Actions:** `[Save Lead]` (Primary), `[Cancel]`.

---

#### Screen 06: Lead Details Screen (Comprehensive CRM Hub)
- **Screen Purpose:** Single customer profile linking CRM interactions, survey records, quotations, and project links.
- **Header:** Customer Name, Mobile, Lead Code, Current Status Pill, Quick Buttons: `[WhatsApp]`, `[Call]`, `[Schedule Survey]`, `[Create Quote]`.
- **Layout Split:**
  - *Left Column (35%):* Customer profile card, utility information, roof facts, duplicate merge status, assigned salesperson.
  - *Right Column (65%):* Tabbed activity hub:
    - *Tab 1: Timeline & Notes:* Chronological feed of call notes, status changes, and follow-up logs with user timestamps.
    - *Tab 2: Survey History:* Linked site survey cards with status (`Scheduled`, `Completed`), GPS location, and photos.
    - *Tab 3: Quotations:* Table of issued quotes (`QT-26-0004-R1`), versions, total amount, subsidy, net cost, and status.
    - *Tab 4: Linked Project:* Displays converted `PRJ-YY-NNNN` link if lead reached `Won`.
- **Actions:** `[Add Timeline Note]`, `[Reopen to Contacted]` (Owner only if Lost).

---

#### Screen 07: Site Survey Form (Mobile-First / PWA Offline)
- **Screen Purpose:** Field tool for survey engineers to capture physical rooftop data, photos, and signatures on-site.
- **Header:** "Site Feasibility Survey", Customer Name, Address link to Google Maps, Offline Status Badge ("🟢 Online" or "🟡 Offline Draft Saved").
- **Collapsible Form Sections:**
  1. *Civil & Rooftop Dimensions:* Usable roof area (sq ft)*, Roof height / floors*, Roof type, Shading analysis (`None`, `Partial`, `Heavy`)*, Orientation / Azimuth, Structure type needed (`Standard Elevated`, `Low Profile`, `Super Structure`).
  2. *Electrical & Metering:* Connection type (`Single Phase`, `Three Phase`)*, Sanctioned load (kW)*, Average monthly consumption (kWh)*, Earthing condition (`Adequate`, `New Required`), DC cable run (m)*, AC cable run (m)*, Proposed inverter mounting location.
  3. *Mandatory Proof Photographs (Min 4 Uploads):*
     - Camera upload slot 1: Roof Layout Photo* (Preview thumbnail).
     - Camera upload slot 2: Electricity Meter Photo* (Preview thumbnail).
     - Camera upload slot 3: Main Distribution Board (DB) Photo* (Preview thumbnail).
     - Camera upload slot 4: Inverter Wall Mounting Photo* (Preview thumbnail).
  4. *Customer Sign-off:* HTML5 digital signature pad on glass*, Surveyor Notes.
- **Primary Action:** `[Submit Survey & Generate Recommended Sizing]` (Submits or caches locally if offline).
- **Secondary Action:** `[Save Draft]`, `[Auto-Refresh GPS]`.

---

#### Screen 08: System Design & BOM Screen
- **Screen Purpose:** Technical engineering canvas to determine solar capacity and compile the Bill of Materials.
- **Header:** "System Design & Bill of Materials", Linked Lead & Survey Code, Engineering Status (`Draft`, `Approved`).
- **Top Configuration Panel:**
  - Average Monthly Units: `450 kWh` → Algorithmically Recommended Size: `3.3 kWp` (Engineer editable).
  - System Type Selector: `On-grid` (Default), `Hybrid`, `Off-grid`.
  - Panel Specification: `DCR Compliant` (Mandatory for PM Surya Ghar subsidy) or `Non-DCR`.
  - BOM Template Loader: Dropdown (e.g., "3 kW On-grid DCR Template") → `[Load Template]`.
- **Main Section: BOM Line Items Table:**
  `Item Code | Item Name & Make | Category | Qty | Unit | Scales with kW? | Base Rate (₹) | Actions`
  - Pre-populated standard items: Solar PV Modules, On-grid Solar Inverter, HDG Mounting Structure, DC Solar Cables (4 sq mm), AC Copper Cables, ACDB & DCDB with SPD/MCB, Chemical Earthing Kit, Lightning Arrestor (ESE/Conventional), MC4 Connectors, Bi-directional Net Meter, Installation & Commissioning Labor, Freight & Site Transport.
- **Actions:** `[Add Custom Line Item]`, `[Recalculate Scaling]`, `[Save & Approve BOM]`.
- **Navigation:** Saving locks the BOM and directs user to Quotation Builder.

---

#### Screen 09: Quotation List Screen
- **Screen Purpose:** Register of all commercial proposals issued to prospective clients.
- **Header:** "Quotations Directory", Filter by FY, CTA `[+ New Quotation]`.
- **Summary Cards:** Total Quotes Generated, Total Quoted Pipeline (₹), Quotes Awaiting Approval, Conversion Rate.
- **Table Columns:**
  `Quote No (QT-YY-NNNN-Rn) | Date | Customer | kWp | Grand Total (₹) | Total Subsidy (₹) | Net Cost (₹) | Discount | Status Pill | Salesperson | Actions (···)`
- **Row Actions:** Preview PDF, Share WhatsApp, Revise (creates Rn), Convert to Order, Delete (Draft only).

---

#### Screen 10: Quotation Builder Screen
- **Screen Purpose:** Comprehensive commercial pricing engine incorporating BOM lines, tax rates, central/state subsidies, and custom payment instalments.
- **Header:** "Build Quotation", Version Indicator (`R1`), Linked Customer Name.
- **Section 1: Line Items from BOM:**
  - Table showing items, quantities, rates, GST % (pulls from Item Master), and line totals.
  - Option per quote: `[ ] Group lines as a single package price on customer PDF`.
- **Section 2: Pricing, Taxes & Subsidy Calculation Block:**
  ```
  Subtotal (Taxable):                                 ₹ 1,58,000.00
  GST (CGST 6% + SGST 6% / IGST 12%):                 ₹   18,960.00
  Commercial Discount [ ₹ / % ]:                      ₹   -5,000.00
  -----------------------------------------------------------------
  Grand Total Payable to Company:                     ₹ 1,71,960.00
  -----------------------------------------------------------------
  Central Subsidy (PM Surya Ghar 3 kW Slab):          ₹   78,000.00
  State Subsidy (Rajasthan Renewable Policy):         ₹        0.00
  Total Government Subsidy (Govt → Customer Bank):    ₹   78,000.00
  -----------------------------------------------------------------
  Effective Net Customer Cost (Info Only):            ₹   93,960.00
  (Validation: Grand Total - Total Subsidy must be >= 0)
  ```
- **Section 3: Payment Schedule Builder (User-Defined Split):**
  - Table of instalments:
    `Instalment Name | Payer (Customer / Bank) | Amount (₹ / %) | Trigger (On Order / Milestone / Post-Net-Meter) | Due Date`
  - Real-time Validation Bar: `Sum of Instalments (₹1,71,960) == Grand Total (₹1,71,960)` (Green tick).
- **Section 4: Energy Generation & Savings Forecast:**
  - Estimated Annual Generation: `4,800 kWh/yr`.
  - Estimated Annual Electricity Savings: `₹ 38,400 / yr`.
  - Estimated Payback Period: `2.4 Years`.
- **Primary CTA:** `[Save & Generate Proposal PDF]`. (If discount > 5%, button displays `[Submit for Owner Approval]`).

---

#### Screen 11: Quotation PDF Preview & Dispatch Screen
- **Screen Purpose:** High-fidelity print/export preview of the customer proposal with direct dispatch integrations.
- **Header:** "Quotation Preview - QT-26-0004-R1", Status Badge, Validity Counter ("Valid for 15 Days").
- **Main Viewport:** Paginated A4 PDF layout rendering:
  - Official company branding, GSTIN, address.
  - Customer details and site address.
  - System specification summary (kWp, module make, inverter type).
  - Commercial pricing table (itemized or package).
  - Government subsidy eligibility breakdown and net customer cost.
  - Payment instalment terms.
  - Terms & conditions and warranty clauses (25-year panel performance, 5-year inverter warranty).
- **Actions Bar:**
  - Primary CTA: `[Send via WhatsApp with PDF Attachment]`.
  - Secondary Actions: `[Send via Email]`, `[Download PDF]`, `[Convert to Order]` (if accepted).

---

#### Screen 12: Projects List Screen
- **Screen Purpose:** Master execution dashboard listing all active, commissioned, and closed rooftop installations.
- **Header:** "Projects Directory", Quick View `[Table View | Cards View]`, Filter `[All / In Progress / Delayed / Closed]`.
- **Top Summary Tiles:** Active Projects (`48`), In Progress (`31`), Commissioned (`9`), Delayed (`4` in red), Closed This Month (`6`).
- **Table Columns:**
  `Project ID (PRJ-YY-NNNN) | Customer Name | System Size | Payment Mode | Manager | Current Milestone | Target Date | Status Badge | Balance Due (₹) | Actions`
- **Visual Alert:** Delayed projects (current date > milestone planned date and not Done) highlighted with red warning icons and text.
- **Navigation:** Clicking Project ID navigates to Screen 13 (Project Master View).

---

#### Screen 13: Project Overview Screen (Tab 1 of Project Master)
- **Screen Purpose:** Executive summary of a single rooftop project across technical, financial, and regulatory dimensions.
- **Persistent Project Header Ribbon (Common across all tabs):**
  `Project ID: PRJ-26-0004 | Customer: Rajesh Sharma (Jaipur) | Size: 3.3 kWp | Stage: [In Progress] | Mode: [Bank Loan (SBI)] | Balance Due: [₹35,000] | Subsidy: [Stage 4: WCR Submitted]`
- **Primary Header Action:** Dynamic Contextual CTA (e.g., `[Record Site GRN]` or `[Submit WCR]`).
- **Tabs Navigation:** `[Overview]` | `[Milestones]` | `[Materials]` | `[Subsidy & DISCOM]` | `[Payments & Loans]` | `[Documents]` | `[Costs & P&L]` | `[Activity Log]`.
- **Tab 1 Content (Overview):**
  - *Customer & Site Card:* Name, 10-digit mobile, installation address, consumer number, DISCOM division.
  - *System Hardware Card:* Inverter model, panel model, DCR flag, structure elevation, cable lengths.
  - *Commercial & Financial Progress:* Grand total contract value, payments received to date, balance due, loan sanction amount.
  - *Regulatory Progress Bar:* Visual 7-step tracker for PM Surya Ghar subsidy progress.

---

#### Screen 14: Project Milestones Screen (Tab 2 of Project Master)
- **Screen Purpose:** Sequential checklist of the 7 default installation stages with photo evidence enforcement.
- **Header:** Project Header Ribbon, "Installation Progress: 5 of 7 Milestones Completed".
- **Milestones Table / Accordion:**
  `Seq | Milestone Name | Status Pill | Planned Date | Actual Date | Done By | Proof Photos | Remarks | Actions`
  - *Row 1:* 1. Project kickoff and site plan `[Done - 02 Nov 2026]` (2 Photos attached).
  - *Row 2:* 2. Material received at site `[Done - 05 Nov 2026]` (Linked to `GRN-26-0003`).
  - *Row 3:* 3. Structure installed `[Done - 07 Nov 2026]` (3 Photos attached).
  - *Row 4:* 4. Panels mounted `[Done - 09 Nov 2026]` (4 Photos attached).
  - *Row 5:* 5. Inverter and wiring complete `[Done - 11 Nov 2026]` (3 Photos attached).
  - *Row 6:* 6. Testing and commissioning `[In Progress]` (`[Mark Milestone Done]`).
  - *Row 7:* 7. Handover to customer `[Pending]`.
- **Milestone Update Modal:** Opened when clicking `[Mark Milestone Done]`:
  - Actual completion date picker.
  - Mandatory proof photo uploader (min 1 photo required; camera access enabled).
  - Execution remarks / notes.
- **Enforcement Rules:** Sequential locking (cannot complete Milestone 4 if Milestone 3 is Pending); Admin override button requires typed reason and logs audit event.

---

#### Screen 15: Project Materials Screen (Tab 3 of Project Master)
- **Screen Purpose:** Real-time reconciliation of technical BOM quantities against purchase orders, site GRNs, and leftovers.
- **Header:** Project Header Ribbon, Material Variance Warning ("1 Item shows >5% variance").
- **Reconciliation Table:**
  `Item Code | Description | BOM Qty | Ordered PO Qty | Received GRN Qty | Leftover Qty | Unit Rate (₹) | Variance % | Status`
  - Highlighting: Rows with variance > 5% highlighted in amber/red alert pill.
- **Leftover Management Actions:**
  - `[Log Leftover Item]`: Opens dialog to record unused cables, structure iron, or MC4 connectors.
  - Disposition selection: `[Transfer to Another Project]` (Requires PM Approval) OR `[Return to Vendor (Debit Note)]`.
- **Hardware Serial Number Roster:**
  - Table of all panels, inverters, and batteries received at site with barcode serial numbers, linking to the specific GRN.

---

#### Screen 16: Subsidy & DISCOM Details Screen (Tab 4 of Project Master)
- **Screen Purpose:** Manage government subsidy compliance across the 7 mandatory regulatory stages.
- **Header:** Project Header Ribbon, Subsidy Scheme (`PM Surya Ghar`), Expected Subsidy (`₹78,000` - Read-Only).
- **Interactive 7-Stage Timeline Cards:**
  1. *Stage 1: Application Registered:* Portal App No, Reg Date, Consumer No.
  2. *Stage 2: DISCOM Feasibility:* Feasibility Approval Date, Feasibility Letter Upload.
  3. *Stage 3: Installation Upload:* Portal Upload Date.
  4. *Stage 4: WCR Submitted:* WCR Submission Date, WCR PDF Upload, Site Photos. (Gated: Requires Milestone 6 Done).
  5. *Stage 5: Service Order (SO) Issued:* DISCOM SO Number, SO Date, SO Document Upload. (Gated: Requires WCR).
  6. *Stage 6: Net Metering Done:* DISCOM Visit Date, Net Meter Number, Installation Date, Meter Photo. (Gated: Requires SO; Unlocks Bank Tranche 2).
  7. *Stage 7: Subsidy Credited to Customer:* Amount Credited, Credit Date, Proof (Bank SMS / Passbook screenshot).
- **Document Verification Checklist:** Aadhaar card, Electricity bill, Property tax receipt, Cancelled cheque, Site inspection photos.
- **Alert Indicator:** Displays "STUCK STAGE (>45 Days)" in red if application exceeds threshold.

---

#### Screen 17: Customer Payments & Bank Loans Screen (Tab 5 of Project Master)
- **Screen Purpose:** Financial tracking of customer instalments, bank disbursements, and receipt generation.
- **Header:** Project Header Ribbon, Commercial Summary (`Contract: ₹1,71,960 | Paid: ₹1,36,960 | Balance: ₹35,000`).
- **Section 1: Customer Payment Schedule Table:**
  `Instalment Name | Payer | Trigger | Due Date | Amount Due (₹) | Received (₹) | Balance (₹) | Status Pill | Action`
  - *Row 1:* Margin Money Advance `[Paid - ₹35,000]`.
  - *Row 2:* Material Delivery Payment `[Paid - ₹50,000]`.
  - *Row 3:* Commissioning Balance `[Partially Paid - Due: ₹35,000, Recd: ₹20,000, Bal: ₹15,000]`.
- **Section 2: Bank Loan Administration Card (if Bank Loan Mode):**
  - Financier: `State Bank of India (Solar Loan Division)`.
  - Status: `Sanctioned` | Sanction Date: `04 Nov 2026` | Amount: `₹1,00,000`.
  - *Tranche 1 (Due on Sanction):* `₹65,000` | Status: `Received` | UTR: `SBIN00291823`.
  - *Tranche 2 (Due Post-Net-Meter):* `₹35,000` | Status: `Due (Net Metering Done)` | Action: `[Record Tranche 2 Disbursement]`.
- **Section 3: Receipts Register:**
  `Receipt No (RCT-26-0045) | Date | Amount | Mode (NEFT/UPI/Cash) | Reference | Actions (PDF / WhatsApp)`
- **Actions:** `[+ Record Payment Receipt]`, `[Send Payment Reminder WhatsApp]`.

---

#### Screen 18: Vendor Directory Screen
- **Screen Purpose:** Master list of suppliers with compliance tags, payment terms, and open commitments.
- **Header:** "Vendors Directory", Filter by Category, CTA `[+ Add Vendor]`.
- **Table Columns:**
  `Vendor Code | Vendor Name | GSTIN (Validated) | Contact Person | Mobile | Categories | DCR/ALMM Compliant | Payment Terms | Rating | Actions`
- **Row Actions:** Edit Details, View Purchase History, View Payables Ledger, Deactivate.
- **Add Vendor Modal:** Form fields: Vendor Name*, GSTIN* (15 chars with checksum regex), PAN, Billing Address, Bank Account Details (Bank, Account No, IFSC), Payment Terms (days), ALMM/DCR compliance toggle.

---

#### Screen 19: Procurement & RFQ Comparison Screen
- **Screen Purpose:** Multi-vendor competitive quote analysis to determine lowest landed cost before issuing PO.
- **Header:** "RFQ Comparison Matrix - PR-26-0012 (Project: PRJ-26-0004)", System Size: `3.3 kWp`.
- **Side-by-Side Comparison Matrix:**
  ```
  Item Description: Tier-1 550W Mono PERC DCR Solar Modules (6 Nos)
  +--------------------------------+--------------------+--------------------+
  | Metric / Vendor                | Vendor A (Solex)   | Vendor B (Tata)    |
  +--------------------------------+--------------------+--------------------+
  | Quoted Unit Rate               | ₹ 14,200.00        | ₹ 14,800.00        |
  | GST %                          | 12%                | 12%                |
  | Freight & Insurance            | ₹  1,200.00        | Included           |
  | Landed Cost per Unit           | ₹ 16,104.00 ★LOWEST| ₹ 16,576.00        |
  | Promised Delivery Lead Time    | 3 Days             | 5 Days             |
  | ALMM / DCR Compliant?          | Yes [Verified]     | Yes [Verified]     |
  +--------------------------------+--------------------+--------------------+
  | Selection Action               | (•) Select Winner  | ( )                |
  +--------------------------------+--------------------+--------------------+
  ```
- **Actions:** `[Generate Purchase Order from Selection]`. (If PO > ₹2,00,000, routes to Owner for approval).

---

#### Screen 20: Goods Receipt Note (GRN) Screen (Mobile Barcode Scanner)
- **Screen Purpose:** Mobile-first field screen to verify delivery at site and capture component serial numbers.
- **Header:** "Record Site Goods Receipt (GRN)", Project Code, Linked PO Number.
- **Delivery Challan Details Section:**
  - Vendor Invoice / Challan Number* & Challan Date*.
  - Upload Challan Photograph* (Camera icon with live preview).
- **Line Items Receipt Grid:**
  `Item Code | Item Name | Ordered Qty | Previously Recd | Recd Now Qty* | Balance Qty`
- **Mandatory Serial Number Capture Module (for Panels, Inverters, Batteries):**
  - Displays required serials count based on `Recd Now Qty` (e.g., "6 Solar Panels - 6 Serials Required").
  - Two input options:
    - *Option A:* Camera Barcode / QR Scanner button `[📷 Scan Barcode]`.
    - *Option B:* Text Area for Bulk Pasting comma/newline-separated serial numbers.
  - Validation feedback: Green check if count matches; live duplicate detection alert if serial already exists in database.
- **Primary CTA:** `[Submit GRN & Update Site Inventory]`.

---

#### Screen 21: Final GST Tax Invoice Screen
- **Screen Purpose:** Single official tax billing document issued at commissioning, compliant with Indian GST rules.
- **Header:** "Tax Invoice - INV/26-27/0001", Linked Project Code, Issue Date, Billing Status.
- **Invoice Structure Layout:**
  - Official EPC Company Name, GSTIN, Address, State Code.
  - Customer Name, Installation Site Address, Customer GSTIN (if C&I).
  - Place of Supply: `Rajasthan (08)`.
  - System Description: `3.3 kW On-Grid Rooftop Solar Photovoltaic Power Plant with Net-Metering Facility`.
  - Single Lump-Sum Taxable Amount with GST split (CGST + SGST or IGST).
  - **Serial Number Equipment Manifest (No Individual Item Prices):**
    - Solar PV Modules (6 Nos): `SLX550DCR-90182, SLX550DCR-90183, SLX550DCR-90184, ...`
    - On-Grid Inverter (1 No): `INV-3KW-GRW-20261109`
    - Bi-directional Net Meter: `MTR-JVVNL-992102`
  - Payment Settlement Summary: Contract Total, Total Received to Date, Current Balance Due.
- **Actions:** `[Download Tax Invoice PDF]`, `[Print]`, `[Export to Tally XML]`.

---

#### Screen 22: Reports & Analytics Hub Screen
- **Screen Purpose:** Strategic business reporting center organized by operational domain with Excel and PDF exports.
- **Layout Split:**
  - *Left Sidebar Menu (25%):* Categorized list of available reports:
    - **Sales:** Lead Source ROI, Salesperson Leaderboard, Pipeline Stage Conversion, Lost Reasons Breakdown, kW Sold by District/Size.
    - **Operations:** Project Ageing Analysis, Milestone Bottleneck Tracker, Delayed Projects Log, Survey Conversion %, Material Variance Report.
    - **Procurement:** Purchase Order Register, Vendor Spend Summary, Pending Deliveries Report, Leftover Material Log, Serial Number Trace.
    - **Money:** Receivables Ageing (Customer vs. Bank), Monthly Collections Register, Subsidy Pipeline Report, Bank Loan Tracker, Vendor Payables Ageing (0-30, 31-60, 61-90, 90+), GST Input/Output Summary, Project P&L Summary (Revenue, Cost, Gross Margin %).
  - *Right Data Canvas (75%):* Active report title, Date range picker, District filter, Data grid with sortable columns, Totals summary row.
- **Actions Bar:** `[Export to Excel (.xlsx)]`, `[Export to PDF]`, `[Print Data Grid]`.

---

#### Screen 23: Notifications Center Screen
- **Screen Purpose:** Centralized inbox for operational alerts, task reminders, and management approvals.
- **Header:** "Notifications Center", Filter `[All | Unread | Approvals Required | System Alerts]`, CTA `[Mark All as Read]`.
- **Notifications Feed (Cards):**
  - *Card 1 (Approval Alert - Red Bar):* "Purchase Order PO-26-0007 exceeds ₹2,00,000 (Value: ₹2,45,000). Owner approval required." → `[Review & Approve]`.
  - *Card 2 (Stuck Subsidy - Amber Bar):* "Project PRJ-26-0002 has been stuck in 'WCR Submitted' for 47 days (>45d threshold)." → `[View Project Subsidy]`.
  - *Card 3 (Milestone Trigger - Blue Bar):* "Testing and Commissioning completed for PRJ-26-0004. WCR submission unlocked." → `[Submit WCR]`.
  - *Card 4 (Follow-up Reminder - Slate Bar):* "Daily Follow-up Digest: 4 customer calls scheduled for today." → `[Open Leads List]`.
- **Interaction:** Clicking any notification card navigates directly to the associated transaction.

---

#### Screen 24: Settings & System Masters Screen
- **Screen Purpose:** Administrative management of master tables, workflow thresholds, and system roles without code deployment.
- **Header:** "Settings & System Masters", Active Section Selector.
- **Tabbed Masters Management:**
  1. *Company Profile:* Legal Name, GSTIN, Registered Address, Bank Account for Invoicing, Official Logo Uploader.
  2. *Geographic Masters:* States, Districts, DISCOMs (Dynamic table to add new distribution companies).
  3. *Item Master:* Item codes, specifications, HSN codes, GST %, serialized flags, standard rates.
  4. *BOM Templates:* Standard system configurations (1kW, 2kW, 3kW, 5kW, 10kW On-grid/Hybrid) with scalable line items.
  5. *Subsidy Slabs:* Central PM Surya Ghar slab table + State per-kW subsidy rates and caps.
  6. *Financiers Master:* Bank and NBFC partner directory for rooftop loans.
  7. *Users & Roles (RBAC):* Employee directory, multi-role assignment, granular module permission toggles.
  8. *Workflow Thresholds:* Quotation discount approval limit (default: 5%), PO approval limit (default: ₹2,00,000), Subsidy stuck threshold (default: 45 days), Loan stuck threshold (default: 21 days), Material variance tolerance (default: 5%).
  9. *Message Templates:* Notification templates for WhatsApp and Email.
- **Actions:** `[+ Add Master Record]`, `[Import CSV]`, `[Save All Settings]`.
