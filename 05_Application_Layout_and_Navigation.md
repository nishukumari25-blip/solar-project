# Solaris EPC – Solar ERP System (Phase 1)
## Document 05: Application Layout, Shell Architecture & Navigation System

---

### 1. Shell Architecture & Layout Wireframe
The application implements an enterprise desktop-and-mobile-responsive shell featuring a persistent collapsible left sidebar, an omni-functional top navigation bar, and a contextual main work canvas.

```
+---------------------------------------------------------------------------------------------------------+
| [LOGO] Solaris EPC  | [Global Search: Customer / Mobile / Project ID / Serial]  | (🔔 3) | [Admin User ▼] |
+---------------------+-----------------------------------------------------------+--------+---------------+
| NAVIGATION          | BREADCRUMBS: Home > Projects > PRJ-26-0004 > Milestones                             |
| • Dashboard         +-----------------------------------------------------------------------------------+
| • Leads & CRM       | PAGE HEADER: Residential 3.3 kW Rooftop - R. Sharma                               |
| • Site Surveys      | Stage: In Progress | Payment: Bank Loan | Balance: ₹35,000 | Subsidy: WCR Submitted    |
| • Design & BOM      | Primary Action: [Record GRN]  Secondary Actions: [Share PDF] [Add Note]           |
| • Quotations        +-----------------------------------------------------------------------------------+
| • Projects          | SUMMARY TILES:                                                                    |
| • Procurement       | [Total Quoted: ₹1,98,000] [Received: ₹1,63,000] [Due: ₹35,000] [Subsidy: ₹78,000] |
| • Subsidy & DISCOM  +-----------------------------------------------------------------------------------+
| • Payments & Loans  | TABS: [Overview] [★ Milestones] [Materials] [Subsidy] [Payments] [Docs] [Costs]    |
| • Invoices/Receipts +-----------------------------------------------------------------------------------+
| • Vendor Payables   | WORK CANVAS (Active Tab Content):                                                 |
| • Reports           | Milestones Checklist Table with Proof Photo Upload & Status Pills                 |
| • Settings          |                                                                                   |
+---------------------+-----------------------------------------------------------------------------------+
```

---

### 2. Common Layout Components Specification

#### 2.1 Top Navigation Bar (Global Header)
- **Brand Identity:** Company logo with dynamic environment indicator ("Solaris EPC - Jaipur Hub").
- **Global Search Input:**
  - Fast-indexing search input with keyboard shortcut (`Ctrl + K` or `/`).
  - Searchable across: Customer Name, 10-Digit Mobile Number, Project ID (`PRJ-YY-NNNN`), Quotation Number (`QT-YY-NNNN-Rn`), or Serial Number (Panel, Inverter, Battery).
  - Search results display an instant category-grouped dropdown modal.
- **Role & Branch Indicator:** Displays current active role context (e.g., `Owner / Admin - Head Office`).
- **Notification Bell Menu (`🔔`):**
  - Live unread notification counter badge.
  - Dropdown displays latest 5 event notifications with relative timestamps ("10m ago", "2h ago").
  - Categorized into *Action Required* (Approvals, Stuck Stages) and *Informational* (Milestone Done, Payment Recd).
  - "View All Notifications" link to dedicated Notification Center.
- **User Profile Menu:**
  - User avatar with name and primary role.
  - Dropdown options: *My Profile*, *Change Password*, *Switch Active Role* (for multi-role users), *Help & Documentation*, and *Logout*.

#### 2.2 Breadcrumb Navigation
- Persistent breadcrumb trail below the top bar indicating organizational depth:
  `Home > Projects > PRJ-26-0012 > Milestones`
- Each parent segment is an interactive link with hover feedback.

#### 2.3 Contextual Page Header
- **Page Title & Subtitle:** Clear typography indicating entity name, code, or analytical view.
- **Key Metric Ribbon / Status Header (for Project Detail):**
  - Project Stage Badge (e.g., `In Progress` - Amber).
  - Payment Mode Badge (`Bank Loan (SBI)` - Indigo).
  - Balance Due Counter (`Balance: ₹35,000` - Red text if overdue, Slate if pending).
  - Subsidy / DISCOM Stage Indicator (`Stage 4: WCR Submitted` - Blue).
- **Action Control Cluster:**
  - **Contextual "Next Action" Button (Primary CTA):** High-prominence, dynamic button guiding the user to the next logical step (e.g., "Schedule Survey", "Send Quote", "Record GRN", "Submit WCR", "Claim Tranche 2", "Request Closure").
  - **Secondary Actions:** "Print / Share PDF", "Add Note", "Reopen Lead", "Download Tally XML".

#### 2.4 Summary KPI Tiles (Stat Cards)
- Positioned directly above search/filter toolbars on all list pages.
- Standard layout: 4 to 6 metric cards displaying Key Metric, Subtext, Trend %, and click-to-filter capability.
- Visual hierarchy: Clean white card background, subtle border, large semibold numbers formatted in Indian Rupees (`₹2,21,100`), and category-specific status accent bars.

#### 2.5 Filter and Search Toolbar
- **Debounced Search Field:** Live filtering on tables/lists.
- **Dropdown Filters:** Single-select and multi-select filters for Status, Salesperson, Manager, District, Date Range.
- **Toggle Switches:** E.g., "Show Stuck Only (>45 Days)", "Kanban / List Toggle".
- **Reset Filters Button:** Reverts to system default views.

#### 2.6 Data Tables
- Responsive tabular grid with sticky headers.
- Striped alternating rows with hover highlight.
- Sorting icons on sortable headers (Date, Amount, Status, Customer).
- Column-specific formatting: Right-aligned currency (`₹`), centered status pills, left-aligned entity names with clickable links.
- Row Action Menu (`···`): Quick contextual menu for Edit, Delete/Cancel, Share WhatsApp, Download PDF, View History.
- Server-side pagination with rows-per-page selector (25, 50, 100).

#### 2.7 Status Badges & Pills
- Semantic color-coding:
  - **Green (Done / Paid / Matched / Won):** `bg-emerald-50 text-emerald-700 border-emerald-200`
  - **Amber (In Progress / Pending Approval / Due / Under Review):** `bg-amber-50 text-amber-700 border-amber-200`
  - **Red (Overdue / Stuck / Mismatch / Lost / Rejected):** `bg-rose-50 text-rose-700 border-rose-200`
  - **Blue (Scheduled / Sent / Commissioned / Active):** `bg-blue-50 text-blue-700 border-blue-200`
  - **Slate/Gray (Not Started / Draft / Not Due / Closed):** `bg-slate-100 text-slate-700 border-slate-200`

#### 2.8 Modals & Confirmation Dialogs
- **Form Modals:** Center-aligned responsive overlay with backdrop blur, sticky header with close button (`✕`), scrollable content area, and fixed footer with Cancel and Primary Submit buttons.
- **Irreversible Action Confirmation Dialogs:**
  - Triggered on: *Accept Quote*, *Approve PO*, *Record GRN*, *Approve 3-Way Mismatch*, *Cancel Project*, and *Close Project*.
  - Warning banner in crimson/amber highlighting the permanent business impact.
  - Requires explicit user checkbox confirmation or typing "CONFIRM" for destructive closures.

#### 2.9 UI State Handlers (Loading, Empty, Error)
- **Loading State:** Skeleton loaders matching the exact card/table wireframe structure, avoiding layout shift.
- **Empty State:** Illustrated empty state with descriptive text (e.g., "No stuck subsidies found - all applications are moving on schedule") and a clear primary action button ("Create New").
- **Offline Draft Banner:** Mobile PWA indicator showing "Working Offline - 2 survey drafts saved locally. Syncing when connection restored."

---

### 3. Comprehensive Sidebar Navigation Structure

The sidebar is organized into clean functional modules, strictly mirroring the Phase 1 specification:

```
[NAVIGATION MENU]
├── 1. Dashboard
├── 2. Leads (CRM)
├── 3. Site Surveys
├── 4. Design & BOM
├── 5. Quotations
├── 6. Projects
│   └── (Detail Tabs: Overview, Milestones, Materials, Subsidy, Payments, Docs, Costs, Activity)
├── 7. Procurement
│   ├── Purchase Requisitions (PR)
│   ├── RFQ & Comparison
│   ├── Purchase Orders (PO)
│   ├── Goods Receipt (GRN)
│   └── Leftover Inventory
├── 8. Subsidy & DISCOM
│   ├── Subsidy Pipeline
│   ├── Stuck Subsidies (>45d)
│   └── Pending Subsidy Credit
├── 9. Finance & Accounts
│   ├── Customer Payments & Receipts
│   ├── Bank Loans Pipeline
│   ├── GST Invoices
│   └── Vendor Bills & 3-Way Match
├── 10. Vendors Directory
├── 11. Reports & Analytics
└── 12. Settings & Masters
```

---

### 4. Detailed Specification for Every Sidebar Item

#### 1. Dashboard
- **Purpose:** Executive and operational command center delivering real-time business health metrics across sales, projects, cash-flow, and bottlenecks.
- **Sub-pages:** None (Single cockpit with role-based widget filtering).
- **Summary Cards / Tiles:**
  - *Leads This Month & Conversion %*
  - *kW Sold This Month*
  - *Projects by Status (with Delayed Count in Red)*
  - *Receivables Split: Customer vs. Bank*
  - *Collections This Month (₹)*
  - *Payables Due This Week (₹)*
  - *Pending Deliveries (PO vs. GRN)*
  - *Projects Awaiting WCR / SO / Net Metering*
  - *Stuck Subsidies (>45 Days)*
  - *Loans Awaiting Sanction or Tranche 2*
  - *Customers with Subsidy Not Credited*
  - *Overdue Follow-ups Digest*
- **Main Content:** KPI grid, interactive pipeline charts, urgent action alerts list.
- **Buttons & Actions:** "Add Lead", "Create Survey", "Date Range Filter", "Export Dashboard Summary".
- **Status Indicators:** Red alert badges on bottleneck tiles. Clicking any tile navigates directly to the filtered list behind it.

#### 2. Leads (CRM)
- **Purpose:** Capture every customer enquiry, enforce follow-up accountability, and manage the sales pipeline.
- **Sub-pages:** Leads Kanban Board, Leads Tabular List, Lead Detail View, Add/Edit Lead Page, CSV Import/Export.
- **Summary Cards:** Total Active Leads, Survey Scheduled, Quote Sent, Won This Month, Overdue Follow-ups.
- **Tables / Cards:**
  - *Kanban View:* Columns for `New`, `Contacted`, `Survey Scheduled`, `Quote Sent`, `Negotiation`, `Won`. Cards show customer name, mobile, monthly bill, kW, source badge, follow-up date, and one-tap WhatsApp icon.
  - *Table View:* Columns: Customer Name, Mobile, District, Segment, Load, Status Pill, Assigned Salesperson, Next Follow-up Date, Actions.
- **Buttons & Actions:** "Add Lead", "Import CSV", "Export CSV", "Toggle Kanban/List", "WhatsApp Direct", "Mark Lost", "Reopen Lead" (Owner).
- **Filters:** Status, Lead Source, Assigned Salesperson, State/District, Date Range, Overdue Follow-up toggle.
- **Forms:** Lead Creation Form (Customer info, electricity bill, sanctioned load, DISCOM, roof details, assigned salesperson, follow-up date).

#### 3. Site Surveys
- **Purpose:** Plan, dispatch, and execute technical rooftop site feasibility assessments.
- **Sub-pages:** Survey Schedule Calendar/List, Engineer "My Surveys" Mobile Screen, Survey Execution Form.
- **Summary Cards:** Surveys Pending, Surveys Today, Completed This Week, Average Completion Time.
- **Tables / Cards:** Survey Date/Time, Customer Name, Address/District, Assigned Engineer, Status, Actions ("Start Survey", "View Report").
- **Buttons & Actions:** "Schedule Survey", "Auto-Capture GPS", "Take Site Photos" (min 4), "Capture Customer Signature", "Save Offline Draft", "Submit Survey".
- **Filters:** Engineer, Status (`Scheduled`, `In Progress`, `Completed`), District, Date.
- **Forms:** Mobile-first Survey Form with collapsible sections: Civil Rooftop Dimensions, Electrical & Metering, Shading & Orientation, 4 Photo Uploads, Glass Signature Pad.

#### 4. Design & BOM
- **Purpose:** Configure system capacity (kWp) and build technical Bills of Materials from standardized templates.
- **Sub-pages:** System Design Sizer, BOM Builder, Admin BOM Templates Manager.
- **Summary Cards:** Active BOMs, Standard Templates Count, Average kWp Sizing.
- **Tables / Cards:** BOM Line Items Grid (Item Code, Description, Category, Quantity, Unit, Scalable Flag, Item Master Rate, Extended Amount).
- **Buttons & Actions:** "Calculate Suggested kWp", "Load Template", "Add Item Line", "Recalculate Scaling", "Approve BOM".
- **Filters:** System Type (`On-grid`, `Hybrid`, `Off-grid`), Module Type (`DCR`, `Non-DCR`), Size Band (1-3 kW, 3-5 kW, >5 kW).
- **Forms:** BOM Configuration Form with auto-scaling mathematical rules.

#### 5. Quotations
- **Purpose:** Commercial pricing, central/state subsidy calculation, payment instalment scheduling, and proposal PDF generation.
- **Sub-pages:** Quotations List, Quotation Builder, Quotation PDF Preview & WhatsApp Dispatcher, Approval Requests Screen.
- **Summary Cards:** Quotes Sent This Month, Total Quoted Value, Quotes Pending Discount Approval, Conversion Rate %.
- **Tables / Cards:** Quote Number (`QT-YY-NNNN-Rn`), Date, Customer Name, System Size, Grand Total (₹), Total Subsidy (₹), Net Customer Cost (₹), Status Pill, Actions.
- **Buttons & Actions:** "Create Quote", "Apply Discount (₹ or %)", "Submit for Approval", "Approve Discount" (Owner), "Share WhatsApp PDF", "Revise Quote (Rn)", "Convert to Order".
- **Filters:** Status (`Draft`, `Pending Approval`, `Sent`, `Accepted`, `Rejected`, `Expired`), Salesperson, System Size, Date Range.
- **Forms:** Quotation Builder with line-item pricing, central slab + state subsidy auto-calc, and dynamic payment instalment scheduler.

#### 6. Projects (Master Operational Hub)
- **Purpose:** Central command center for rooftop installation execution from order conversion to final commissioning and closure.
- **Sub-pages / Tabs (within Project Detail):**
  - *Tab 1: Overview:* Customer summary, system specifications, commercial totals, progress bar.
  - *Tab 2: Milestones:* Default 7-stage installation checklist with proof photos, dates, and delay warnings.
  - *Tab 3: Materials:* Quoted BOM vs. Ordered (PO) vs. Received (GRN) vs. Leftover reconciliation.
  - *Tab 4: Subsidy:* 7-stage PM Surya Ghar & DISCOM net-metering lifecycle and document checklist.
  - *Tab 5: Payments:* Customer payment schedule, bank loan status, receipts, and outstanding dues.
  - *Tab 6: Documents:* Repository of customer KYC, site photos, WCR, Service Order, and Net-Meter photos.
  - *Tab 7: Costs:* Real-time project P&L (Materials at PO rate + Labor + Freight + Liaison = Margin %).
  - *Tab 8: Activity:* Immutable audit log of every state change, override, and user timestamp.
- **Summary Cards (on List Page):** Total Active Projects, Projects in Progress, Delayed Projects (Red), Commissioned, Closed.
- **Tables / Cards:** Project ID (`PRJ-YY-NNNN`), Customer Name, kWp, Payment Mode, Assigned PM, Target Date, Status Badge, Delay Indicator.
- **Buttons & Actions:** "Convert to Order", "Assign PM", "Record Milestone", "Request Closure", "Approve Closure" (Owner).
- **Filters:** Project Status, Project Manager, District, Payment Mode, Delayed toggle.

#### 7. Procurement & Site Materials
- **Purpose:** Direct-to-site purchasing, competitive vendor RFQ, PO generation, and mobile GRN with serial numbers.
- **Sub-pages:**
  - *Purchase Requisitions (PR):* Auto-generated from BOM minus leftovers.
  - *RFQ & Comparison:* Multi-vendor quote matrix highlighting lowest landed cost.
  - *Purchase Orders (PO):* Official PO register with project site delivery addresses.
  - *Goods Receipt (GRN):* Mobile receipt with mandatory challan photo and panel/inverter serial scanning.
  - *Leftover Inventory:* Log leftovers, transfer to another project, or return to vendor via debit note.
  - *Serial Number Trace:* Global search for any panel or inverter serial number across all projects.
- **Summary Cards:** Open PRs, POs Pending Owner Approval (>₹2L), Pending Deliveries, Leftover Value.
- **Buttons & Actions:** "Create PR", "Float RFQ", "Issue PO", "Approve PO" (Owner), "Record Site GRN", "Scan Barcode", "Transfer Leftover".
- **Filters:** Vendor, Project ID, Delivery Status, PO Approval Status, Date Range.

#### 8. Subsidy & DISCOM Liaisoning
- **Purpose:** Dedicated tracking of PM Surya Ghar subsidy milestones and DISCOM net-metering synchronization.
- **Sub-pages:** Subsidy Pipeline Master, Stuck Subsidies List (>45 Days), Pending Customer Subsidy Credit Follow-up List.
- **Summary Cards:** Total Subsidy Pipeline Value, Feasibility Approved, WCR Submitted, Net Metered, Stuck Applications (>45d).
- **Tables / Cards:** Project ID, Customer Name, Consumer Number, DISCOM, Current Stage (1 to 7), Days in Current Stage, Stuck Pill, Actions.
- **Buttons & Actions:** "Update Stage", "Upload WCR", "Record Service Order", "Record Net Metering", "Log Subsidy Credit to Customer".
- **Filters:** Subsidy Stage, DISCOM (JVVNL, AVVNL, JdVVNL), "Show Stuck Only (>45 Days)" toggle.

#### 9. Finance & Accounts
- **Purpose:** Manage customer receivables, bank loan tranches, GST tax invoicing, vendor bills, and Tally export.
- **Sub-pages:**
  - *Customer Payments:* Payment schedules, receipts register (`RCT-YY-NNNN`), partial payment allocations.
  - *Bank Loans Pipeline:* Financier tracking, sanction monitoring, Tranche 1 and Tranche 2 disbursement logging.
  - *Tax Invoices:* Single final GST invoice register (`INV/26-27/NNNN`) with serialized items.
  - *Vendor Payables:* Vendor bill entry, automated 3-way match audit, vendor disbursements, ageing buckets (0-30, 31-60, 61-90, 90+).
- **Summary Cards:** Total Receivables (Customer vs. Bank), Collections This Month, Vendor Payables Due, Output vs. Input GST.
- **Buttons & Actions:** "Record Customer Receipt", "Log Loan Disbursement", "Issue Tax Invoice", "Run 3-Way Match", "Approve Mismatch" (Owner), "Export Tally XML".
- **Filters:** Payer Type, Overdue Status, Vendor Match Status, Ageing Bucket, Date Range.

#### 10. Vendors Directory
- **Purpose:** Directory of approved equipment suppliers, structural fabricators, and transport contractors.
- **Sub-pages:** Vendor List, Add/Edit Vendor Profile, Vendor Purchasing & Payment Ledger.
- **Summary Cards:** Total Active Vendors, DCR/ALMM Compliant Vendors, Open PO Commitments.
- **Tables / Cards:** Vendor Name, GSTIN, Contact Person, Mobile, Categories Supplied, ALMM/DCR Badge, Rating, Actions.
- **Buttons & Actions:** "Add Vendor", "Verify GSTIN", "View Ledger & Ageing", "Deactivate Vendor".
- **Filters:** Category Supplied (Panels, Inverters, Structure, Cables), DCR Compliant toggle, State.

#### 11. Reports & Analytics
- **Purpose:** Central reporting suite offering date-filterable analytical reports with Excel and PDF export.
- **Sub-pages / Groupings:**
  - *Sales Reports:* Lead source performance, Salesperson leaderboard, Pipeline value, Quote-to-win %, Lost reasons, kW sold by month/district.
  - *Operations Reports:* Project ageing, Milestone bottlenecks, Delayed projects, Survey-to-quote conversion, Material variance.
  - *Procurement Reports:* PO register, Vendor purchases, Pending deliveries, Leftover material, Serial number history.
  - *Money Reports:* Receivables ageing (Customer vs. Bank), Collections register, Subsidy pipeline, Loan pipeline, Vendor ageing, GST summary, Project P&L summary.
- **Buttons & Actions:** "Select Date Range", "Export to Excel (.xlsx)", "Export to PDF", "Print Grid".

#### 12. Settings & Masters
- **Purpose:** System configuration console for company parameters, role permissions, approval thresholds, and master lists.
- **Sub-pages:**
  - *Company Profile:* Legal Name, GSTIN, Address, Bank Details, Logo.
  - *Geographic Masters:* States, Districts, DISCOMs.
  - *Item Master:* Equipment specifications, HSN codes, GST %, serialized flags, standard rates.
  - *BOM Templates:* Admin-managed system design templates.
  - *Subsidy Slabs:* Central scheme slabs and state per-kW rate caps.
  - *Payment Templates:* Reusable instalment schedules.
  - *Users & Roles:* Multi-role user accounts, role permission configurator.
  - *System Thresholds:* Quote discount approval %, PO approval ₹, Subsidy stuck days (45d), Loan stuck days (21d), Material variance tolerance %.
  - *Message Templates:* WhatsApp and Email notification templates.
- **Buttons & Actions:** "Add Master Item", "Edit Record", "Import CSV", "Save Thresholds", "Test Gateway".
