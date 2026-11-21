# Solaris EPC – Solar ERP System (Phase 1)
## Document 03: Complete 23-Module Functional & Technical Breakdown

---

### 1. Introduction
This document provides an exhaustive, specification-accurate breakdown of all **23 functional modules** comprising **Phase 1 of the Solaris EPC ERP System**. 

For each module, this specification details:
1. Purpose & Business Objective
2. Users Involved & Role Interactions
3. Main Features & Capabilities
4. Required Data Fields & Validation Attributes
5. Associated Screens, Modals & Views
6. Actions, Buttons & Transitions
7. Lifecycle Statuses & Rules
8. Search & Filter Parameters
9. Business Rules & Enforcement Mechanics
10. Validations & Error Handling
11. Upstream & Downstream Inter-Module Relationships

---

### Module 01: Dashboard (Executive & Operations Cockpit)
- **Purpose:** Provide role-specific, real-time executive and operational oversight across the entire solar EPC lifecycle, highlighting commercial progress, project milestones, cash flow, and operational bottlenecks.
- **Users Involved:** Owner / Admin (Global), Sales Executive, Project Manager, Purchase Officer, Accounts Officer, Liaison Officer.
- **Main Features:**
  - 12 real-time KPI metric tiles with drilldown capabilities.
  - Urgent alerts panel for stuck subsidies, overdue follow-ups, and delayed projects.
  - Active project pipeline overview and milestone bottlenecks.
  - Cash-flow monitoring (receivables by customer vs. bank; weekly payables due).
- **Required Fields (Aggregated Metrics):** Leads this month, lead-to-won conversion %, total kWp sold this month, active projects count, delayed projects count, customer receivables (₹), bank loan receivables (₹), monthly collections (₹), weekly payables due (₹), pending deliveries count, projects awaiting net metering / WCR / SO, stuck subsidies count (>45d), stalled loans count (>21d), uncredited subsidies count, overdue follow-ups count.
- **Screens Required:** Executive Dashboard View, Role-specific Dashboard Widgets.
- **Actions & Buttons:** Date range filter, district filter, quick action buttons (`+ Add Lead`, `+ New Project`, `Export Summary`), click-to-filter on all tiles.
- **Statuses:** Aggregates live statuses from underlying operational records.
- **Filters & Search:** Date range filter (today, this week, this month, custom), branch/district filter.
- **Business Rules:**
  - Automated mathematical test required: All dashboard totals must strictly equal the sum of underlying transactional records.
  - Clicking any dashboard tile opens the underlying pre-filtered data list.
- **Validations:** Real-time reconciliation assertion; blocks display if underlying queries produce discrepancies.
- **Relationships:** Aggregates data from Leads, Projects, Milestones, Procurement, Subsidy, Customer Payments, Bank Loans, and Vendor Payables.

---

### Module 02: Leads and CRM
- **Purpose:** Systematically capture every solar enquiry across multiple marketing channels, qualify prospects, enforce follow-up discipline, and prevent lead leakage.
- **Users Involved:** Sales Executive (Own leads), Owner / Admin (All leads), Project Manager (View).
- **Main Features:**
  - Multi-source lead capture with real-time duplicate mobile prevention.
  - Dual view modes: Visual Kanban board by status and high-density tabular grid.
  - One-tap WhatsApp contact icon directly on Kanban cards.
  - Enforced follow-up scheduling with daily 9:00 AM user notification digests.
  - CSV bulk lead import with mobile deduplication and CSV export.
  - Chronological timeline notes logging every call, visit, and user interaction.
- **Required Fields:**
  - `customer_name`* (Text)
  - `mobile`* (10 digits Indian format)
  - `alternate_mobile` (10 digits)
  - `email` (Valid email string)
  - `address`, `city`, `district`*, `state`* (default: Rajasthan), `pin_code`* (6 digits)
  - `lead_source`* (Master list: Walk-in, Referral, Meta ads, Google ads, IndiaMART, Website, Channel partner, Other)
  - `segment`* (Residential / Commercial / Industrial)
  - `monthly_electricity_bill` (₹ Decimal)
  - `sanctioned_load` (kW Decimal)
  - `discom` (Master dropdown: e.g., JVVNL, AVVNL, JdVVNL)
  - `roof_ownership` (Owned / Rented)
  - `roof_type` (Flat RCC, Pitched Tin, Tile)
  - `assigned_to`* (Foreign Key → User)
  - `follow_up_date`* (Date, mandatory for all open leads)
  - `lost_reason` (Text, mandatory when status = `Lost`)
  - `notes` (Text)
  *(\* = Mandatory fields)*
- **Screens Required:** Leads Kanban Board, Leads Tabular List, Lead Detail Page, Add/Edit Lead Modal, CSV Import Modal.
- **Actions & Buttons:** `[+ Add Lead]`, `[Import CSV]`, `[Export CSV]`, `[Toggle Kanban/List]`, `[WhatsApp Icon]`, `[Schedule Survey]`, `[Create Quote]`, `[Add Note]`, `[Mark Lost]`, `[Reopen Lead]` (Owner only).
- **Statuses:** `New` → `Contacted` → `Survey Scheduled` → `Quote Sent` → `Negotiation` → `Won`. Side exits: `Lost` (requires reason), `Junk`.
- **Filters & Search:** Search by customer name, mobile, city; Filters: Status, Lead Source, Assigned Salesperson, State/District, Date Range, "Overdue Follow-ups" toggle.
- **Business Rules:**
  - Real-time duplicate warning when an identical 10-digit mobile number already exists; Admin can merge records.
  - A follow-up date is mandatory for every open lead.
  - Overdue follow-ups show on the dashboard and trigger an automated notification digest to the assigned user at 9:00 AM daily.
  - Every status change, assignment, and note is logged with user ID and timestamp.
  - Status `Won` cannot be set manually; it is set automatically when a quotation is accepted and converted to an order.
  - Status `Lost` can only be reopened to `Contacted` by a user holding the Owner / Admin role.
- **Validations:** Mobile number must be exactly 10 digits; PIN code must be 6 digits; GSTIN mandatory if segment is Commercial.
- **Relationships:** 1 Customer → Many Leads; 1 Lead → Many Surveys, Quotations, Notes; Converted Lead (Won) → 1 Project.

---

### Module 03: Site Survey
- **Purpose:** Empower field survey engineers to assess physical rooftop dimensions, structural feasibility, electrical infrastructure, and shading conditions on-site using a mobile-first, offline-capable interface.
- **Users Involved:** Survey Engineer (Assigned), Owner / Admin, Sales Executive (View), Project Manager (View).
- **Main Features:**
  - Mobile-optimized PWA layout functioning on slow networks with local offline draft saving.
  - Automatic GPS coordinate geo-tagging.
  - Technical feasibility questionnaire (shading, structural condition, connection type).
  - Mandatory 4-photo site capture (Roof, Meter, DB, Inverter Wall).
  - Digital customer signature capture on mobile glass.
- **Required Fields:**
  - `survey_schedule_time`, `survey_completion_time`
  - `engineer_id` (Assigned User)
  - `gps_latitude`, `gps_longitude` (Auto-captured)
  - `roof_type` (Flat RCC, Pitched Tin, Asbestos, Tile)
  - `usable_roof_area_sqft` (Decimal)
  - `roof_height_floors` (Integer)
  - `shading_condition` (None / Partial / Heavy)
  - `roof_orientation` (South, South-West, East, West)
  - `structure_type_needed` (Standard Elevated, Low Profile, Super Structure)
  - `connection_type` (Single Phase / Three Phase)
  - `sanctioned_load_kw` (Decimal)
  - `average_monthly_units_kwh` (Decimal)
  - `earthing_condition` (Adequate / Needs Replacement)
  - `dc_cable_length_m` (Decimal)
  - `ac_cable_length_m` (Decimal)
  - `inverter_location` (Text description)
  - `photos` (Minimum 4: Roof, Meter, Distribution Board, Inverter Mounting Wall)
  - `customer_signature` (Digital Image / Canvas Data URL)
  - `surveyor_notes` (Text)
- **Screens Required:** Survey Scheduling Dialog (on Lead page), Engineer "My Surveys" Mobile Screen, Mobile Survey Execution Form.
- **Actions & Buttons:** `[Schedule Survey]`, `[Auto-Detect GPS]`, `[Upload Photo]`, `[Clear Signature]`, `[Save Offline Draft]`, `[Submit Survey]`, `[Cancel Survey]`.
- **Statuses:** `Scheduled` → `In Progress` → `Completed`; `Cancelled`.
- **Filters & Search:** Filter by Assigned Engineer, Status, Date, District; Search by customer name.
- **Business Rules:**
  - Transitioning status to `Completed` strictly requires all 4 mandatory photographs and recommended system sizing.
  - Survey form caches drafts locally in IndexedDB/localStorage when field connectivity is lost and automatically synchronizes when connection is restored.
- **Validations:** Coordinates cannot be zero/null; photos must be valid images compressed to $\le 1$ MB; area and cable lengths must be positive numbers.
- **Relationships:** Belongs to Lead; Feeds System Design & BOM module.

---

### Module 04: System Design and BOM (Bill of Materials)
- **Purpose:** Translate technical site survey parameters into an optimized solar system design (kWp) and compile a standardized, scalable Bill of Materials.
- **Users Involved:** Survey Engineer, Owner / Admin, Project Manager, Purchase Officer.
- **Main Features:**
  - Automated system capacity recommendation algorithm based on average monthly consumption:
    $$\text{Recommended kWp} \approx \frac{\text{Average Monthly kWh}}{120 \text{ kWh/kWp/mo}}$$
  - Manual engineer override capability for suggested kWp.
  - System type selection: `On-grid`, `Hybrid`, `Off-grid`.
  - Panel type specification: `DCR Compliant` (mandatory for subsidy schemes) vs. `Non-DCR`.
  - Admin-managed BOM templates (e.g., "3 kW On-grid DCR") with dynamic line item scaling by kWp.
  - Direct integration with centralized Item Master.
- **Required Fields:**
  - `system_type` (On-grid / Hybrid / Off-grid)
  - `panel_type` (DCR / Non-DCR)
  - `recommended_kwp` (Decimal)
  - `template_id` (Reference to BOM Template Master)
  - Line Items: `item_id`, `item_name`, `make`, `quantity`, `unit`, `is_scalable_with_kw`.
- **Screens Required:** System Design Sizer, BOM Builder Screen, Admin BOM Template Configuration Screen.
- **Actions & Buttons:** `[Suggest kWp]`, `[Load Template]`, `[Add Line Item]`, `[Recalculate Quantities]`, `[Save BOM]`, `[Approve BOM]`.
- **Statuses:** `Draft`, `Approved`.
- **Filters & Search:** Filter templates by system type and kW capacity; search items by code/name.
- **Business Rules:**
  - DCR panels are mandatory if the project is flagged for PM Surya Ghar or state government subsidy.
  - Saving the approved BOM automatically marks the linked Survey as `Completed` and updates the Lead status to `Quote Sent` once a proposal is generated.
  - The approved BOM is the **single source of truth** for quotation pricing, purchase requisition quantities, and project costing.
- **Validations:** System size must be $> 0$; all line items must exist in Item Master; quantities must be $> 0$.
- **Relationships:** Belongs to Survey & Lead; feeds Quotations, Purchase Requisitions, and Project Materials.

---

### Module 05: Quotations
- **Purpose:** Price the technical BOM, calculate central and state government subsidies, structure customer payment terms, and generate professional customer-facing proposals.
- **Users Involved:** Sales Executive (Own quotes), Owner / Admin (All + Discount Approvals), Accounts Officer, Project Manager.
- **Main Features:**
  - Automatic pricing from Item Master standard rates and GST percentages.
  - Central PM Surya Ghar slab calculation + State per-kW subsidy rule engine.
  - Net Customer Cost computation:
    $$\text{Net Customer Cost} = \text{Grand Total} - \text{Total Subsidy} \quad (\text{Enforced } \ge 0)$$
  - Flexible, user-defined payment schedule builder (any number of instalments; no fixed split).
  - Multi-version quote revisioning under a single identifier (`QT-YY-NNNN-R1`, `QT-YY-NNNN-R2`).
  - Discount approval workflow: Discounts $>5\%$ require Owner approval before quote dispatch.
  - Generation of branded PDF proposals with optional package pricing display.
  - Direct WhatsApp and email proposal dispatching.
- **Required Fields:**
  - `quote_number` (`QT-YY-NNNN-Rn`)
  - `quote_date`, `validity_date` (default: 15 days)
  - `customer_id`, `site_address`, `salesperson_id`
  - Line items: `item_id`, `make`, `quantity`, `unit`, `unit_rate`, `gst_rate`, `line_total`
  - Commercials: `subtotal`, `gst_total` (CGST+SGST or IGST), `discount_type` (₹ or %), `discount_value`, `grand_total`
  - Subsidies: `central_subsidy`, `state_subsidy`, `total_subsidy`, `net_customer_cost`
  - Payment Terms: Array of instalments (`name`, `payer` [Customer/Bank], `amount_inr`, `percentage`, `trigger_event`)
  - Forecasts: `annual_generation_kwh`, `annual_savings_inr`, `payback_years`
  - Terms & conditions text, warranty summary.
- **Screens Required:** Quotation List Screen, Quotation Builder Screen, Proposal PDF Preview & Sharing Dialog, Discount Approval Queue.
- **Actions & Buttons:** `[Create Quote]`, `[Apply Discount]`, `[Submit for Approval]`, `[Approve Quote]` (Owner), `[Send WhatsApp PDF]`, `[Send Email]`, `[Revise Quote]`, `[Convert to Order]`.
- **Statuses:** `Draft` → `Pending Approval` (if discount > 5%) → `Sent` → `Accepted` / `Rejected` / `Expired` (auto after validity date); `Revised`.
- **Filters & Search:** Status, Salesperson, System Size Band, Date Range; Search by quote number or customer name.
- **Business Rules:**
  - Net Customer Cost must never be below zero ($\ge 0$). System blocks saving if violated.
  - Customer pays the full Grand Total to the company; subsidy is credited directly to the customer's personal bank account.
  - Sum of payment instalments must exactly equal Grand Total.
  - Revising a sent quote creates a new version (`R1`, `R2...`); previous versions remain permanently locked as read-only.
  - Acceptance of a quote permanently locks it against further modification.
- **Validations:** Instalments total == Grand Total; Net Cost $\ge 0$; validity date $\ge$ quote date.
- **Relationships:** Belongs to Lead; 1:1 accepted Quotation converts into a `Project`.

---

### Module 06: Projects (Master Execution Hub)
- **Purpose:** Serve as the core operational spine of the ERP, coordinating engineering, procurement, installation, liaisoning, and billing under a single `Project ID`.
- **Users Involved:** Project Manager (Assigned), Owner / Admin (All + Closure), Sales Executive, Purchase Officer, Accounts Officer, Liaison Officer.
- **Main Features:**
  - Generated atomically upon quotation acceptance via the "Convert to Order" dialog.
  - Persistent status header ribbon showing: Project Stage, Payment Mode, Balance Due, and Subsidy Stage.
  - 8 comprehensive tabs: Overview, Milestones, Materials, Subsidy, Payments, Documents, Costs, Activity Log.
  - Automated delay monitoring (planned milestone date < today).
- **Required Fields:**
  - `project_id` (`PRJ-YY-NNNN` - System Generated)
  - `customer_id`, `accepted_quotation_id`, `manager_id`
  - `system_size_kwp`
  - `payment_mode` (Self-funded / Bank loan / Loan + margin money)
  - `financier_id`, `expected_loan_amount` (if bank loan)
  - `target_installation_date`, `commissioning_date`, `closed_date`
  - `site_address`, `status` (Not Started, In Progress, Commissioned, Closed, On Hold, Cancelled)
  - `cancellation_reason`, `pnl_locked` (Boolean).
- **Screens Required:** Projects List (Table & Cards views), Project Master Details Page (with 8 tabs), Convert to Order Modal.
- **Actions & Buttons:** `[Convert to Order]`, `[Assign Project Manager]`, `[Put On Hold]`, `[Resume Project]`, `[Cancel Project]`, `[Request Project Closure]` (PM), `[Approve Project Closure]` (Owner).
- **Statuses:** `Not Started` → `In Progress` → `Commissioned` → `Closed`; Side exits: `On Hold`, `Cancelled`.
- **Filters & Search:** Status, Manager, District, Payment Mode, "Delayed Projects Only" toggle; Search by Project ID, customer name, mobile.
- **Business Rules:**
  - Moves to `In Progress` upon starting the first installation milestone.
  - Moves to `Commissioned` upon marking Milestone 6 ("Testing and commissioning") Done.
  - Moves to `Closed` ONLY when: (1) All customer and bank instalments are Paid (Balance Due = ₹0.00), (2) Subsidy record shows Net Metering Done (or Not Applicable), and (3) Owner approves closure.
  - Customer subsidy credit is NOT a closure prerequisite (tracked post-closure).
  - Deleting a project with transactions is strictly blocked.
  - Cancelling a project requires a reason and is strictly blocked once materials have been received at site.
- **Validations:** Unique `PRJ-YY-NNNN` code; valid completion dates; closure prerequisites evaluation.
- **Relationships:** Central Anchor. 1:1 with accepted Quotation; 1 Project → Many Milestones, Instalments, GRNs, Costs, Documents; 1 Subsidy; 0..1 Loan.

---

### Module 07: Installation Milestones
- **Purpose:** Enforce a strict, proof-backed sequential checklist for on-site solar rooftop installation execution.
- **Users Involved:** Project Manager, Owner / Admin.
- **Main Features:**
  - Default 7-stage installation sequence (admin-editable template).
  - Planned vs. actual completion date tracking.
  - Mandatory site proof photo upload to mark any milestone Done.
  - Automated project delay flagging (red indicator on dashboards and lists).
  - Logged Owner override for exceptional site re-ordering.
- **The 7 Default Milestones:**
  1. *Project kickoff and site plan*
  2. *Material received at site*
  3. *Structure installed*
  4. *Panels mounted*
  5. *Inverter and wiring complete*
  6. *Testing and commissioning*
  7. *Handover to customer (warranty documents, customer signature)*
- **Required Fields (per Milestone):** `milestone_id`, `project_id`, `name`, `sequence_order` (1 to 7), `status` (Pending, In Progress, Done), `planned_date`, `actual_date`, `done_by_user_id`, `proof_photos` (Array of file URLs), `remarks`.
- **Screens Required:** Milestones Tab in Project Detail, Milestone Completion Modal.
- **Actions & Buttons:** `[Start Milestone]`, `[Upload Proof Photos]`, `[Mark Milestone Done]`, `[Admin Override Sequence]`.
- **Statuses:** `Pending`, `In Progress`, `Done`.
- **Filters & Search:** Filter by milestone status, delayed status.
- **Business Rules:**
  - Milestones must complete in order: A milestone cannot be marked Done while an earlier one is Pending (Owner override with logged justification is required).
  - Milestone 2 ("Material received at site") can ONLY be marked Done if at least one valid GRN exists on the project.
  - Milestone 6 ("Testing and commissioning") Done sets the project commissioning date, unlocks WCR submission in the Subsidy module, and unlocks the Commissioning payment instalment.
  - Missing proof photographs strictly blocks marking a milestone Done.
- **Validations:** Actual date $\le$ Today; minimum 1 proof photograph mandatory.
- **Relationships:** Child of Project; drives Subsidy (WCR unlock), Invoicing, and Customer Payments.

---

### Module 08: Vendors Directory
- **Purpose:** Maintain an approved vendor registry for solar modules, inverters, structures, cables, and electrical BOS, enforcing regulatory compliance and payment terms.
- **Users Involved:** Purchase Officer, Owner / Admin, Accounts Officer.
- **Main Features:**
  - Vendor directory with category specialization tags.
  - Algorithmic 15-character GSTIN format and checksum verification.
  - ALMM (Approved List of Models & Manufacturers) and DCR compliance tracking for module suppliers.
  - Vendor rating, credit terms, and banking details.
- **Required Fields:**
  - `vendor_name`*
  - `gstin`* (15 characters with checksum validation)
  - `pan` (10 characters)
  - `contact_person`, `mobile`* (10 digits), `email`
  - `billing_address`, `state`*
  - `bank_name`, `bank_account_no`, `bank_ifsc`
  - `payment_terms_days` (Integer)
  - `categories_supplied` (Panels, Inverters, Structure, Cables, BOS, Labor, Transport)
  - `is_almm_compliant` (Boolean), `is_dcr_compliant` (Boolean)
  - `rating` (1 to 5), `is_active` (Boolean).
- **Screens Required:** Vendor List Screen, Add/Edit Vendor Modal, Vendor Profile & Ledger View.
- **Actions & Buttons:** `[+ Add Vendor]`, `[Verify GSTIN]`, `[View Purchase History]`, `[Deactivate Vendor]`.
- **Statuses:** `Active`, `Inactive`.
- **Filters & Search:** Category, State, ALMM/DCR flag, Active status; Search by vendor name, GSTIN, mobile.
- **Business Rules:** Module vendors must have active ALMM and DCR compliance flags to be eligible for selection in government subsidy project RFQs.
- **Validations:** 15-character GSTIN Luhn checksum regex; 10-digit mobile; 11-character IFSC.
- **Relationships:** 1 Vendor → Many RFQs, Purchase Orders, Vendor Bills, Vendor Payments.

---

### Module 09: Procurement Overview
- **Purpose:** Serve as the supply chain mission control monitoring material requisitions, vendor RFQs, active purchase orders, and site delivery commitments.
- **Users Involved:** Purchase Officer, Owner / Admin, Project Manager.
- **Main Features:**
  - Consolidated view of all project purchasing pipelines.
  - Real-time tracking of pending deliveries (PO quantity vs. received GRN quantity).
  - Monitoring of supplier lead times and promised delivery dates.
- **Required Fields:** Aggregate metrics: Open PRs, POs pending approval, total PO commitments (₹), pending deliveries count, late deliveries count.
- **Screens Required:** Procurement Overview Dashboard, Pending Deliveries Report Screen.
- **Actions & Buttons:** `[Create PR]`, `[Float RFQ]`, `[Issue PO]`, `[Filter by Vendor]`, `[Export PO Register]`.
- **Statuses:** Aggregates PR, RFQ, and PO statuses.
- **Filters & Search:** Vendor, Project ID, Delivery Status, Date Range.
- **Business Rules:** Zero-warehouse model: All procurement is direct-to-site for a designated Project ID.
- **Validations:** Cross-module date logic (promised delivery date $\ge$ PO date).
- **Relationships:** Bridges System Design (BOM), Purchasing (PR/RFQ/PO), and Site Receiving (GRN).

---

### Module 10: Purchase Requisition (PR)
- **Purpose:** Generate technical purchasing demand directly from project BOMs while accounting for available leftover site materials.
- **Users Involved:** Project Manager (Submit), Purchase Officer, Owner / Admin.
- **Main Features:**
  - Automated PR draft generation upon quotation acceptance.
  - Net requirement calculation deducting existing leftover inventory:
    $$\text{PR Qty to Buy} = \text{BOM Required Qty} - \text{Leftovers Transferred to Project}$$
  - PM review and formal submission.
  - Variance warning if requested quantities exceed BOM.
- **Required Fields:** `pr_number` (`PR-YY-NNNN`), `project_id`, `requested_by`, `submission_date`, `status`, Line items (`item_id`, `bom_qty`, `leftover_deducted_qty`, `net_required_qty`, `unit`).
- **Screens Required:** PR List Screen, PR Detail & Submission Screen.
- **Actions & Buttons:** `[Review PR]`, `[Submit PR]`, `[Add Line Item]`, `[Cancel PR]`.
- **Statuses:** `Draft` → `Submitted` → `RFQ Sent` → `PO Created` (Partial / Full); `Cancelled`.
- **Filters & Search:** Status, Project ID, Date Range; Search by PR number.
- **Business Rules:** Requisitioning more than 5% above BOM quantity strictly requires Project Manager approval.
- **Validations:** Net required quantity must be $> 0$.
- **Relationships:** Belongs to Project; created from BOM; initiates RFQ and PO.

---

### Module 11: Request for Quotation (RFQ)
- **Purpose:** Conduct multi-vendor competitive price discovery to identify the lowest landed cost for requisitioned solar components.
- **Users Involved:** Purchase Officer, Owner / Admin.
- **Main Features:**
  - Float RFQ lines to one or more approved vendors.
  - Side-by-side comparative evaluation matrix.
  - Automated calculation and highlighting of lowest landed cost per unit (Base rate + GST + Freight/Insurance).
  - Promised delivery lead-time comparison.
- **Required Fields:** `rfq_number`, `pr_id`, `project_id`, `status`, Vendor quotes array (`vendor_id`, `item_id`, `quoted_rate`, `gst_rate`, `freight_amount`, `landed_cost_per_unit`, `delivery_lead_days`, `is_selected`).
- **Screens Required:** RFQ Creation Screen, RFQ Comparison Matrix Screen.
- **Actions & Buttons:** `[Select Vendors]`, `[Send RFQ]`, `[Enter Vendor Rates]`, `[Evaluate Landed Cost]`, `[Generate PO from Winner]`.
- **Statuses:** `Draft`, `Quotes Received`, `Evaluated`, `Closed`.
- **Filters & Search:** PR ID, Project ID, Vendor Name, Status.
- **Business Rules:** The comparison screen automatically highlights the lowest landed cost per line. Winning vendor quote converts into a Purchase Order.
- **Validations:** Quoted rates must be positive decimals; valid tax rates applied.
- **Relationships:** Belongs to PR; generates Purchase Order.

---

### Module 12: Purchase Orders (PO)
- **Purpose:** Issue legally binding purchase contracts to vendors for equipment delivery directly to customer installation sites.
- **Users Involved:** Purchase Officer, Owner / Admin (Approval), Accounts Officer (View).
- **Main Features:**
  - Auto-generated from chosen vendor RFQ quote.
  - Project site address pre-populated as delivery ship-to destination (editable for site logistics).
  - Automated Owner approval routing for POs exceeding ₹2,00,000.
  - Branded PO PDF generation and direct WhatsApp/email dispatch.
- **Required Fields:** `po_number` (`PO-YY-NNNN`), `project_id`, `vendor_id`, `po_date`, `promised_delivery_date`, `ship_to_address`, `terms_conditions`, `subtotal`, `gst_amount`, `total_po_value`, `status`, `approved_by`, `approval_date`, Line items (`item_id`, `quantity`, `unit_rate`, `gst_rate`, `total_amount`).
- **Screens Required:** PO Register Screen, PO Builder Screen, PO Approval View, PO PDF Preview.
- **Actions & Buttons:** `[Generate PO]`, `[Submit for Approval]`, `[Approve PO]` (Owner), `[Send WhatsApp/Email PDF]`, `[Cancel PO]`.
- **Statuses:** `Draft` → `Pending Approval` (if value > ₹2,00,000) → `Approved` → `Sent` → `Partially Received` → `Received` → `Closed`; `Cancelled`.
- **Filters & Search:** Vendor, Project ID, Approval Status, Delivery Status, Date Range; Search by PO number.
- **Business Rules:**
  - PO value exceeding the configurable threshold (default: ₹2,00,000) strictly requires Owner approval before dispatch.
  - PO cancellation is strictly blocked once any GRN exists against it.
- **Validations:** Total value $> 0$; promised delivery date $\ge$ PO date.
- **Relationships:** Belongs to Project & Vendor; links to PR; parent to GRN and Vendor Bill.

---

### Module 13: Goods Receipt Note (GRN at Site)
- **Purpose:** Formally acknowledge physical hardware arrival at customer rooftop sites, capturing delivery challan evidence and mandatory equipment serial numbers.
- **Users Involved:** Project Manager, Site Installer, Purchase Officer, Accounts Officer (View).
- **Main Features:**
  - Mobile-first field screen with barcode/QR camera scanning and bulk serial pasting.
  - Partial delivery tracking across multiple challans.
  - Mandatory delivery challan/invoice photo upload.
  - Mandatory serial number capture for Solar Panels, Inverters, and Batteries.
  - System-wide serial uniqueness enforcement.
  - Immutable reversal mechanics (GRNs are never deleted).
- **Required Fields:** `grn_number` (`GRN-YY-NNNN`), `po_id`, `project_id`, `received_by`, `receipt_date`, `vendor_challan_no`*, `vendor_challan_date`*, `challan_photo_url`*, `status` (Submitted, Reversed), Line items (`item_id`, `ordered_qty`, `previously_recd_qty`, `recd_now_qty`, `balance_qty`), Serial numbers array (for serialized items).
- **Screens Required:** GRN Register, Record GRN Mobile Form (with Barcode Scanner), GRN Detail View, GRN Reversal Dialog.
- **Actions & Buttons:** `[Record GRN]`, `[📷 Scan Barcode]`, `[Bulk Paste Serials]`, `[Upload Challan Photo]`, `[Submit GRN]`, `[Create Reversal Entry]` (Owner only).
- **Statuses:** `Draft`, `Submitted`, `Reversed`.
- **Filters & Search:** Project ID, PO Number, Vendor, Date; Search by GRN number or Serial number.
- **Business Rules:**
  - Material received on a project is recorded ONLY through a GRN.
  - Serialized items cannot be received without serial numbers. Count of serials must exactly equal received quantity.
  - Serial numbers must be globally unique across the entire system. Attempting to scan a serial registered to another project is blocked.
  - A GRN is NEVER deleted. Errors require an official reversal entry with logged justification and Owner approval.
  - At least one valid GRN is mandatory before Milestone 2 can be marked Done.
- **Validations:** Challan photo mandatory; serials count == received quantity; serial uniqueness validation.
- **Relationships:** Child of PO & Project; populates Project Materials and Serial Register; unlocks Milestone 2 and Vendor Bill 3-Way Match.

---

### Module 14: Project Materials
- **Purpose:** Maintain a real-time material balance sheet per project, reconciling quoted BOM against purchase orders, site GRNs, and leftover residue.
- **Users Involved:** Project Manager, Purchase Officer, Accounts Officer, Owner / Admin.
- **Main Features:**
  - Real-time 4-way material reconciliation table: BOM vs. PO vs. GRN vs. Leftovers.
  - Visual highlighting of material variances exceeding 5%.
  - Leftover material disposition management: Transfer to another project or return to vendor via debit note.
  - Complete serialized hardware roster per project.
- **Required Fields:** `project_id`, `item_id`, `bom_qty`, `ordered_po_qty`, `received_grn_qty`, `leftover_qty`, `unit_rate`, `variance_percentage`, `leftover_action` (Moved to Project / Returned to Vendor), `target_project_id`, `debit_note_ref`.
- **Screens Required:** Materials Tab in Project Detail, Leftover Material Allocation Modal, Serial Number Drilldown.
- **Actions & Buttons:** `[Log Leftover]`, `[Transfer to Project]` (PM Approval), `[Return to Vendor (Debit Note)]`, `[Search Serial Number]`.
- **Statuses:** `In Balance`, `Variance Flagged (>5%)`, `Leftover Transferred`, `Leftover Returned`.
- **Filters & Search:** Variance filter (>5%), Item Category; Search by item name or serial number.
- **Business Rules:**
  - Material variances exceeding 5% between BOM and GRN are highlighted in amber/red on project views and reports.
  - Moving leftover material to another project requires PM approval and automatically reduces the target project's PR demand.
  - Leftovers returned to vendor generate a debit note reducing vendor payables.
- **Validations:** Leftover quantity $\le$ Received GRN quantity.
- **Relationships:** Reconciles BOM, PO, and GRN; feeds Project Costs and reduces subsequent Project PRs.

---

### Module 15: Subsidy Tracking (PM Surya Ghar & State)
- **Purpose:** Track customer government capital subsidy and DISCOM liaison milestones from portal registration to final net metering.
- **Users Involved:** Liaison Officer, Owner / Admin, Accounts Officer, Sales Executive (View).
- **Main Features:**
  - Strict 7-stage sequential regulatory workflow:
    1. *Application Registered:* Portal App No, Reg Date, Consumer No, Scheme.
    2. *DISCOM Feasibility:* Feasibility Approval Date, Approval Document.
    3. *Installation Uploaded:* Portal Upload Date.
    4. *WCR Submitted:* WCR Submission Date, WCR Document, Photos (Gated: Requires Milestone 6 Done).
    5. *Service Order (SO) Issued:* SO Number, SO Date, SO Document (Gated: Requires WCR).
    6. *Net Metering Done:* DISCOM Visit Date, Net Meter Serial No, Date (Gated: Requires SO; Unlocks Bank Tranche 2).
    7. *Subsidy Credited to Customer:* Amount, Credit Date, Proof (Bank SMS/statement screenshot).
  - Document verification checklist (Aadhaar, Electricity bill, Property proof, Bank passbook, WCR, SO, Net-Meter photo).
  - Automated "Stuck" alerting for records exceeding 45 days in a single stage.
  - "Pending Subsidy Credit" follow-up list.
  - Strict accounting segregation: Subsidy is credited to customer bank account; never company revenue.
- **Required Fields:** `subsidy_id`, `project_id`, `scheme_type`, `expected_subsidy_amount` (copied from quote, read-only), `current_stage`, `stage_entry_date`, stage-specific dates, numbers, and document URLs.
- **Screens Required:** Subsidy Tab in Project Detail, Subsidy Pipeline Overview, Stuck Subsidies Dashboard List, Pending Subsidy Credit Follow-up List.
- **Actions & Buttons:** `[Update Stage]`, `[Upload Document]`, `[Mark Verified]`, `[Record Net Metering]`, `[Record Subsidy Credit]`.
- **Statuses:** `Registered` → `Feasibility Approved` → `Installation Uploaded` → `WCR Submitted` → `SO Issued` → `Net Metering Done` → `Credited to Customer`; `Not Applicable`, `Rejected`.
- **Filters & Search:** Stage, DISCOM, "Show Stuck Only (>45 Days)" toggle; Search by application no, consumer no, Project ID.
- **Business Rules:**
  - One subsidy record created per project on order conversion (skip with reason if not eligible e.g. commercial).
  - Sequence enforced: WCR before SO; SO before Net Metering.
  - WCR submission is unlocked ONLY after Milestone 6 ("Testing and commissioning") is Done.
  - Net Metering Done is the final regulatory milestone and mandatory condition for Project Closure; it also unlocks Bank Loan Tranche 2.
  - Subsidy credit to customer can be recorded after project closure and does not affect company receivables.
- **Validations:** Sequence rules enforcement; mandatory document uploads per stage.
- **Relationships:** Belongs 1:1 to Project; feeds Milestone gating, Bank Tranche 2 unlock, and Project Closure prerequisites.

---

### Module 16: Customer Payments
- **Purpose:** Administer customer payment schedules, instalment milestones, payment receipts, partial collections, and balance reconciliations.
- **Users Involved:** Accounts Officer, Owner / Admin, Sales Executive (View), Project Manager (View).
- **Main Features:**
  - Payment schedule derived directly from quotation instalments.
  - Clear payer assignment: Customer (Margin/Delivery/Commissioning) vs. Bank (Tranche 1/Tranche 2).
  - Recording of incoming receipts with partial payment allocation.
  - Generation of official payment receipts (`RCT-YY-NNNN`) with WhatsApp dispatch.
  - Automated overdue balance calculation:
    $$\text{Overdue Amount} \le \text{Outstanding Amount} = \text{Total Due} - \text{Total Received}$$
- **Required Fields:**
  - Instalments: `instalment_id`, `project_id`, `description`, `payer` (Customer/Bank), `amount_due`, `due_trigger`, `due_date`, `amount_received`, `balance_amount`, `status` (Not Due, Due, Partially Paid, Paid, Overdue).
  - Receipts: `receipt_id`, `receipt_number` (`RCT-YY-NNNN`), `project_id`, `receipt_date`, `mode` (Cash, UPI, Cheque, NEFT/RTGS, Bank Disbursement), `reference_utr`, `amount_received`, `allocations`.
- **Screens Required:** Payments Tab in Project Detail, Receivables Overview Screen, Record Payment Modal, Receipt PDF Preview.
- **Actions & Buttons:** `[Record Payment]`, `[Allocate Instalments]`, `[Generate Receipt PDF]`, `[Share WhatsApp]`, `[Send Payment Reminder]`.
- **Statuses:** Instalment: `Not Due` → `Due` → `Partially Paid` → `Paid`; `Overdue`.
- **Filters & Search:** Payer, Status, Overdue filter, Date Range; Search by customer name, Project ID, receipt no.
- **Business Rules:**
  - Sum of instalments must equal quotation Grand Total.
  - An instalment becomes `Due` when its operational trigger occurs.
  - An instalment is `Paid` ONLY when received == due; partial payments set status to `Partially Paid` showing the balance.
  - Outstanding balance must reach ₹0.00 for Project Closure.
- **Validations:** Amount received $\le$ balance due; valid payment reference/UTR.
- **Relationships:** Belongs to Project; driven by Quote terms and Milestones; mandatory prerequisite for Project Closure.

---

### Module 17: Bank Loans
- **Purpose:** Track bank loan applications, credit underwriting documentation, sanction approvals, and 2-tranche disbursement mechanics for financed solar installations.
- **Users Involved:** Accounts Officer, Liaison Officer, Owner / Admin, Sales Executive (View).
- **Main Features:**
  - Integration with approved Financiers Master.
  - Tracking of loan application stages and pending credit documents.
  - Enforced two-tranche disbursement schedule:
    - *Tranche 1:* Released immediately upon formal loan sanction.
    - *Tranche 2:* Released strictly post-WCR and DISCOM Net Metering.
  - Automated alert for stalled loans (>21 days in one status).
  - Fallback workflow upon loan rejection (prompts reconfiguring payment mode).
- **Required Fields:** `loan_id`, `project_id`, `financier_id`, `loan_type`, `applied_date`, `requested_amount`, `documents_pending_list`, `sanction_date`, `sanctioned_amount`, `tranche_1_amount`, `tranche_1_date`, `tranche_1_utr`, `tranche_2_amount`, `tranche_2_date`, `tranche_2_utr`, `rejection_reason`, `status`.
- **Screens Required:** Loan Pipeline Screen, Loan Details Card in Payments Tab, Stuck Loans Alert List, Record Disbursement Modal.
- **Actions & Buttons:** `[Apply for Loan]`, `[Record Sanction]`, `[Record Tranche 1]`, `[Claim Tranche 2]`, `[Record Tranche 2]`, `[Mark Rejected]`.
- **Statuses:** `To Apply` → `Applied` → `Documents Pending` → `Sanctioned` → `Tranche 1 Received` → `Fully Disbursed`; `Rejected`.
- **Filters & Search:** Financier, Loan Status, "Show Stuck Only (>21 Days)" toggle; Search by customer, loan account no, Project ID.
- **Business Rules:**
  - Tranche 2 displays status *"Waiting for WCR / SO"* until Net Metering is recorded Done.
  - Loan record is flagged as `Stuck` after 21 days in one status.
  - Loan rejection prompts user to change project payment mode to Self-funded.
- **Validations:** Tranche 1 + Tranche 2 $\le$ Sanctioned amount; Tranche 2 blocked until Net Metering Done.
- **Relationships:** Belongs 0..1 to Project; feeds Customer Payments schedule; interfaces with Subsidy module.

---

### Module 18: Invoices and Receipts
- **Purpose:** Generate legally compliant GST tax billing documents and official financial payment vouchers.
- **Users Involved:** Accounts Officer, Owner / Admin.
- **Main Features:**
  - Exactly one final GST Tax Invoice issued per project at commissioning (`INV/26-27/NNNN`).
  - Lump-sum system pricing with applicable GST breakdown (CGST+SGST or IGST).
  - Complete serialized hardware manifest (panels, inverter, battery) from GRNs displayed **without per-item prices**.
  - Generation of official payment receipts (`RCT-YY-NNNN`).
  - Pre-configured data schema for e-invoice IRN and e-way bill integrations.
  - Tally XML voucher export.
- **Required Fields:**
  - Tax Invoice: `invoice_number` (`INV/26-27/NNNN`), `financial_year`, `invoice_date`, `project_id`, `customer_gstin`, `place_of_supply`, `system_description_lump_sum`, `taxable_value`, `cgst_amount`, `sgst_amount`, `igst_amount`, `total_invoice_value`, `serialized_items_manifest`, `payments_received`, `balance_due`, `status`.
  - Receipt: `receipt_number` (`RCT-YY-NNNN`), `project_id`, `receipt_date`, `mode`, `reference_utr`, `amount_received`.
- **Screens Required:** Tax Invoice Register, Invoice Preview & Print Screen, Receipt Register, Receipt Preview.
- **Actions & Buttons:** `[Generate Final Tax Invoice]`, `[Download PDF]`, `[Print]`, `[Export to Tally XML]`, `[Share Receipt WhatsApp]`.
- **Statuses:** Invoice: `Draft`, `Issued`, `Cancelled`. Receipt: `Issued`, `Cancelled`.
- **Filters & Search:** FY, Date Range, Customer Name, Project ID; Search by invoice or receipt number.
- **Business Rules:**
  - One final invoice per project, issued at commissioning. Displays supplied items and serial numbers without individual prices.
  - Sequential FY numbering (`INV/26-27/NNNN`).
- **Validations:** GSTIN format; tax math balances; serial numbers match project GRNs.
- **Relationships:** Belongs to Project; links to GRN serials and Customer Payments.

---

### Module 19: Vendor Bills and Payments
- **Purpose:** Audit vendor payables through automated Three-Way Matching against POs and GRNs, and manage vendor disbursements.
- **Users Involved:** Accounts Officer, Purchase Officer, Owner / Admin (Mismatch Approvals).
- **Main Features:**
  - Vendor bill entry against linked PO and site GRN.
  - Automated Three-Way Match audit:
    $$\text{Bill Qty} \le \text{GRN Qty} \quad \text{AND} \quad \text{Bill Rate} = \text{PO Rate}$$
  - Mismatch exception workflow routing to Owner for approval.
  - Vendor payment logging and vendor payables ageing buckets (0-30, 31-60, 61-90, 90+ days).
  - Tally XML export for payables.
- **Required Fields:** `bill_id`, `vendor_bill_number`, `bill_date`, `vendor_id`, `po_id`, `grn_id`, `taxable_amount`, `gst_amount`, `tds_amount`, `net_payable_amount`, `three_way_match_status` (Draft, Matched, Mismatch, Approved, Partially Paid, Paid), `mismatch_justification`, `payment_records`.
- **Screens Required:** Vendor Bills List, Enter Vendor Bill Form, 3-Way Match Verification View, Vendor Ageing Report.
- **Actions & Buttons:** `[Enter Vendor Bill]`, `[Run 3-Way Match]`, `[Submit Mismatch for Approval]`, `[Approve Mismatch]` (Owner), `[Record Vendor Payment]`, `[Export Tally XML]`.
- **Statuses:** Vendor Bill: `Draft` → `Matched` / `Mismatch` → `Approved` → `Partially Paid` → `Paid`.
- **Filters & Search:** Vendor, PO Number, Match Status, Payment Status, Ageing Bucket; Search by bill number.
- **Business Rules:**
  - Vendor bill can be approved for payment ONLY when bill qty $\le$ GRN qty and rate = PO rate. Mismatches require Owner approval.
  - Debit notes generated from leftover material returns automatically offset outstanding vendor bills.
- **Validations:** Bill amount == Line totals + GST - TDS; GRN must exist.
- **Relationships:** Belongs to Vendor; links to PO and GRN; feeds Project Costs and Vendor Ageing.

---

### Module 20: Project Costs and P&L
- **Purpose:** Track real-time rooftop project profitability by aggregating direct materials, labor, transport, liaisoning, and miscellaneous expenses.
- **Users Involved:** Owner / Admin, Accounts Officer, Project Manager (View).
- **Main Features:**
  - Automated material cost computation derived from actual received GRN quantities at agreed PO rates.
  - Direct expense logging categorized by Labor, Freight/Transport, Liaisoning, and Miscellaneous.
  - Real-time gross margin calculation (₹ and %):
    $$\text{Gross Margin (₹)} = \text{Quotation Revenue} - \text{Total Direct Project Costs}$$
  - Automatic, permanent locking of project P&L upon final Project Closure.
- **Required Fields:** `project_id`, `revenue` (Quotation Grand Total), `material_costs` (Itemized: GRN qty $\times$ PO rate), `labor_costs`, `transport_costs`, `liaisoning_costs`, `miscellaneous_costs`, `total_project_cost`, `gross_margin_inr`, `gross_margin_percentage`, `pnl_locked` (Boolean).
- **Screens Required:** Costs Tab in Project Detail, Project P&L Summary Screen, Multi-Project Margin Comparison Report.
- **Actions & Buttons:** `[Add Expense Line]`, `[Upload Expense Voucher]`, `[Recalculate Margin]`, `[Export P&L Report]`.
- **Statuses:** `Open / Live`, `Locked` (Post-Closure).
- **Filters & Search:** Project ID, Manager, Margin Band (<15%, 15-25%, >25%), Date Range.
- **Business Rules:**
  - Material costs pull strictly from received GRN quantities at PO rates.
  - Project Closure permanently freezes and locks the project P&L ledger.
- **Validations:** Costs must be non-negative decimals.
- **Relationships:** Consolidates Quotation (revenue), PO/GRN (materials), and manual expense logs; child of Project.

---

### Module 21: Reports & Business Intelligence
- **Purpose:** Deliver actionable business intelligence across Sales, Operations, Procurement, and Financial domains with Excel and PDF export capabilities.
- **Users Involved:** Owner / Admin, Accounts Officer, Project Manager, Purchase Officer, Sales Executive (Scoped).
- **Main Features:**
  - Standardized domain-based report catalog.
  - Date-range filtering and branch/district slicing.
  - Instant export to Microsoft Excel (.xlsx) and Adobe PDF (.pdf).
  - Automated reconciliation test assertions.
- **Standard Reports (All 4 Categories):**
  - **Sales:** Lead Source Performance, Salesperson Leaderboard, Pipeline Value by Stage, Quote-to-Win Conversion %, Lost Reasons Analysis, kW Sold by Month/District/Size.
  - **Operations:** Project Ageing, Milestone Bottleneck Tracker, Delayed Projects Register, Survey-to-Quote Conversion %, Material Variance by Project.
  - **Procurement:** PO Register, Vendor Purchase Spend, Pending Deliveries (PO vs GRN), Leftover Material Register, Serial Number History Trace.
  - **Money:** Receivables Ageing by Payer (Customer vs Bank), Monthly Collections Register, Subsidy Pipeline, Bank Loan Tracker, Vendor Payables Ageing (0-30, 31-60, 61-90, 90+), GST Summary (Input vs Output), Project P&L Summary.
- **Screens Required:** Reports Hub Screen, Active Report Data Grid, Export Options Modal.
- **Actions & Buttons:** `[Select Date Range]`, `[Apply Filters]`, `[Export to Excel]`, `[Export to PDF]`, `[Print Data Grid]`.
- **Statuses:** Dynamically generated output.
- **Filters & Search:** Date range, District, Salesperson, Vendor, Margin band.
- **Business Rules:** Report totals must strictly equal the sum of underlying transactional records (automated test required). Receivables ageing total = sum of open instalments. Pending deliveries = PO quantity - GRN quantity.
- **Validations:** From date $\le$ To date.
- **Relationships:** Aggregates data from all ERP modules.

---

### Module 22: Notifications Engine
- **Purpose:** Orchestrate omnichannel operational reminders, management approvals, and bottleneck alerts.
- **Users Involved:** All system roles (targeted by event).
- **Main Features:**
  - In-app notification bell menu and full notification center.
  - Daily 9:00 AM follow-up digests for sales executives.
  - Weekly stuck pipeline digests for liaison and accounts officers.
  - Automated WhatsApp and SMTP email dispatch for external communications.
  - Configurable message templates in Settings.
- **The 14 System Notification Triggers:**
  1. *Lead assigned* → Sales Executive (In-app, WhatsApp)
  2. *Follow-up due today / overdue* → Assigned User (In-app daily 9:00 AM digest)
  3. *Survey scheduled* → Survey Engineer, Customer (In-app, WhatsApp)
  4. *Quote pending approval* → Owner (In-app)
  5. *Quote shared* → Customer (WhatsApp / Email with PDF)
  6. *Order confirmed* → PM, Purchase, Accounts, Liaison (In-app)
  7. *PO pending approval* → Owner (In-app)
  8. *Delivery due today / late* → Purchase, PM (In-app)
  9. *Milestone done* → Customer (WhatsApp optional per project)
  10. *Commissioning done: submit WCR* → Liaison (In-app)
  11. *Net metering done: claim bank tranche 2* → Accounts (In-app)
  12. *Instalment due / overdue* → Accounts; Customer reminder (In-app, WhatsApp)
  13. *Subsidy or loan stuck* → Liaison / Accounts (Weekly in-app digest)
  14. *Project ready to close* → Owner (In-app)
- **Screens Required:** Topbar Notification Bell Dropdown, Notifications Center Screen, Template Editor (Settings).
- **Actions & Buttons:** `[Mark as Read]`, `[Clear All]`, `[Click to Open Record]`, `[Edit Template]`.
- **Statuses:** `Unread`, `Read`, `Archived`, `Failed Delivery`.
- **Filters & Search:** Event type, Read/Unread status, Date.
- **Business Rules:** In-app delivery is guaranteed and mandatory. External channels dispatch when configured.
- **Validations:** Valid 10-digit mobile for WhatsApp; valid email format for SMTP.
- **Relationships:** Event-driven hooks triggered across all transactional modules.

---

### Module 23: Settings and System Masters
- **Purpose:** Provide an administrative configuration console allowing system administrators to modify operational parameters, masters, thresholds, and role permissions without writing code.
- **Users Involved:** Owner / Admin (Global), Purchase Officer (Vendors, Items), Accounts Officer (Instalments), Liaison Officer (Subsidy rules).
- **Main Features:**
  - **Company Profile:** Legal name, GSTIN, registered address, logo, bank details for invoices.
  - **Geographic Masters:** Dynamic tables for States, Districts, DISCOMs (Initial launch: Rajasthan, Jaipur, JVVNL).
  - **Item Master:** Equipment specifications, categories, units, HSN codes, GST %, serialized flags, standard rates.
  - **BOM Templates:** Standard system design templates (1 kW to 10 kW On-grid/Hybrid) with scalable line items.
  - **Subsidy Masters:** Central PM Surya Ghar slabs and State per-kW subsidy rules and caps.
  - **Payment Templates:** Reusable instalment schedules.
  - **Users and Roles:** Multi-role user administration and granular permission configurator.
  - **System Thresholds:** Quotation discount approval limit (default: 5%), PO approval limit (default: ₹2,00,000), Subsidy stuck threshold (default: 45 days), Loan stuck threshold (default: 21 days), Material variance tolerance (default: 5%), 3-way match tolerance %.
  - **Communication Templates:** WhatsApp and email message text templates.
- **Screens Required:** Settings Hub, Master Data Management Tables, Role Permissions Editor, Thresholds Configuration View.
- **Actions & Buttons:** `[Add Master Item]`, `[Edit Record]`, `[Import Masters CSV]`, `[Save Thresholds]`, `[Test Gateway]`.
- **Statuses:** `Active`, `Inactive`.
- **Filters & Search:** Search masters by code, name, category.
- **Business Rules:** System starts with clean masters at go-live; zero transactional data migration. Masters must be modifiable without software recompilation.
- **Validations:** Unique master codes; positive numeric thresholds; valid tax percentages.
- **Relationships:** Foundation for every operational transaction, calculation engine, and workflow rule in the ERP.
