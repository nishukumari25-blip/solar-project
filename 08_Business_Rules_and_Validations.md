# Solaris EPC – Solar ERP System (Phase 1)
## Document 08: Business Rules, Validation Engines & Regulatory Integrity Rules

---

### 1. Introduction & Integrity Manifesto
The business rules and validation mechanisms outlined in this document form the operational core of **Solaris EPC**. As noted in the development specification (Section 13, page 15):
> *"These rules exist because each one failed in the SolarFlow prototype or is a common source of errors in solar EPC operations."*

Every rule in this document is categorized under one of three governance classifications:
- 🟢 **[Confirmed Requirement]**: Explicitly mandated and confirmed in the original 22-page development specification.
- 🔵 **[Proposed System Rule]**: Architectural enhancements, specific validation formats (regex, data types), or operational workflows proposed to implement the specification cleanly in code.
- 🟡 **[Pending Management Confirmation]**: Configurable defaults, approval thresholds, or policy options requiring explicit client sign-off.

---

### 2. Comprehensive Business Rules Catalogue

---

#### BR-01: Financial-Year Gap-Free Document Numbering 🟢 [Confirmed Requirement]
- **Specification Source:** Section 13, Pages 15–16.
- **Rule Statement:** Every transactional document must receive a unique, sequential, gap-free identifier generated strictly by the server. Numbers are never editable by any user.
- **Financial Year Alignment:** Numbering is per Indian financial year (April to March).
- **Enforced Formats (Verbatim from Spec):**
  - **Project:** `PRJ-YY-NNNN` (e.g. `PRJ-26-0001`)
  - **Quotation:** `QT-YY-NNNN-Rn` (e.g. `QT-26-0004-R1`)
  - **Purchase Requisition:** `PR-YY-NNNN` (e.g. `PR-26-0012`)
  - **Purchase Order:** `PO-YY-NNNN` (e.g. `PO-26-0007`)
  - **GRN:** `GRN-YY-NNNN` (e.g. `GRN-26-0003`)
  - **Tax Invoice:** `INV/26-27/NNNN` (e.g. `INV/26-27/0001`)
  - **Receipt:** `RCT-YY-NNNN` (e.g. `RCT-26-0045`)
- **External Numbers (Entered As Received):** DISCOM Service Order (SO) numbers and portal application numbers are entered as received; the system does not generate them.
- **Concurrency Assertion (Test Scenario 11, Page 21):** Create quotes from two users at the same moment; numbers must be unique and sequential without gaps or duplicate key collisions.

---

#### BR-02: Quotation Validity & Versioning
- **Quotation Validity & Automatic Expiry 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 6 (Page 6) & Section 11 (Page 12).
  - Header captures `validity date`. Status `Expired` is set automatically by the system after validity date.
  - Quotation validity defaults to 15 days 🟡 **[Pending Management Confirmation - Configurable Default]** (editable per quote by salesperson).
- **Quotation Versioning 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 6, Page 7.
  - Revising a sent quote creates version `R1`, `R2...` under the same quote number; old versions stay permanently read-only.
  - Acceptance of a quote locks it permanently against changes.

---

#### BR-03: Quotation Commercial Discount Approval
- **Discount Format 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 6 (Page 7) & Section 18 (Page 21).
  - Discount can be entered as a fixed amount (₹) or as a % of the quote; the customer PDF always renders the discount in ₹.
- **Approval Gating 🟢 [Confirmed Requirement]:**
  - Discount above a configurable limit needs Owner approval before the quote can be sent. Status transitions to `Pending Approval`.
- **Discount Threshold 🟡 [Pending Management Confirmation - Configurable Default]:**
  - *Specification Source:* Section 6 (Page 7) & Section 18 (Page 22, "Still open").
  - The default limit is **5% of grand total**, awaiting formal client confirmation.

---

#### BR-04: Non-Negative Net Customer Cost 🟢 [Confirmed Requirement]
- **Specification Source:** Section 6 (Page 6) & Section 13 (Page 16).
- **Rule Statement:**
  $$\text{Net Customer Cost} = \text{Grand Total} - \text{Total Subsidy}$$
- **Validation Guard:** Net Customer Cost must never be below zero ($\ge 0$). The system blocks save if violated.
- **Commercial Meaning:** Net Customer Cost is shown to the customer as their effective cost only for informational purposes. The customer pays the company the full Grand Total and receives the subsidy from the government directly.

---

#### BR-05: Payment Schedule Instalment Total Balancing 🟢 [Confirmed Requirement]
- **Specification Source:** Section 6 (Page 7), Section 10 (Page 11) & Section 13 (Page 16).
- **Rule Statement:** Payment terms are set by the user on each quotation (no fixed split): any number of instalments, each with a name, payer (customer or bank), amount in ₹ or %, and trigger (on order, on a milestone, on loan sanction, after WCR and SO, or a fixed date).
- **Balancing Assertion:**
  $$\sum \text{Instalments} \equiv \text{Grand Total of Accepted Quotation}$$
- **Validation Guard:** Sum of instalments must equal the grand total. The system blocks quotation save or conversion if instalments do not reconcile.

---

#### BR-06: Absolute Segregation of Government Subsidy from Company Receivables 🟢 [Confirmed Requirement]
- **Specification Source:** Section 1 (Page 2), Section 6 (Page 6), Section 9 (Page 9) & Section 13 (Page 16).
- **Rule Statement:** Subsidy under PM Surya Ghar and state schemes is paid by the government **directly into the customer's personal bank account**.
- **Accounting Isolation:** The company tracks the subsidy for the customer but **never receives it**. Subsidy amounts **never enter company receivables or revenue**.

---

#### BR-07: Atomic Order Conversion (Quote to Project) 🟢 [Confirmed Requirement]
- **Specification Source:** Section 6, Page 7.
- **Rule Statement:** When an accepted quotation is converted to an order, the system opens a dialog asking for:
  - Payment mode: `Self-funded` / `Bank loan` / `Loan + margin money`
  - Financier and expected loan amount (if loan mode)
  - Advance received now (optional)
  - Target installation date
- **Atomic Creation Payload:** System atomically creates:
  1. `Project` (with unique `Project ID` `PRJ-YY-NNNN`)
  2. `Payment schedule` from the quotation's instalments
  3. `Subsidy record` (pre-populated with expected subsidy from quotation)
  4. `Loan record` (if loan mode selected)
  5. `Purchase requisition` draft (`PR-YY-NNNN`) from the BOM
- **State Changes:** Lead status becomes `Won` automatically. The accepted quote is permanently locked.

---

#### BR-08: Zero-Warehouse & Direct-to-Site Procurement 🟢 [Confirmed Requirement]
- **Specification Source:** Section 1 (Page 2), Section 8 (Page 8) & Section 18 (Page 21).
- **Rule Statement:** **No warehouse / no godown.** Every purchase belongs to a specific project and is delivered straight to the customer's site.
- **Structure Fabrication Exclusion:** Structure iron is bought from vendors and assembled on site. There is **no in-house fabrication step**.

---

#### BR-09: Purchase Requisition Leftover Deduction & Variance Cap 🟢 [Confirmed Requirement]
- **Specification Source:** Section 8 (Page 8) & Section 13 (Page 16).
- **Rule Statement:**
  $$\text{PR Quantity to Buy} = \text{BOM Quantity} - \text{Any Leftover Already Moved to this Project}$$
- **Excess Procurement Gating:** Ordering more than 5% above BOM quantity for a project needs **Project Manager approval**.

---

#### BR-10: Purchase Order Approval Limit & Cancellation Lock
- **PO Value Approval Limit 🟡 [Pending Management Confirmation - Configurable Default]:**
  - *Specification Source:* Section 8 (Page 9) & Section 18 (Page 22, "Still open").
  - PO above a configurable value (default: **₹2,00,000**, to be confirmed) needs Owner approval.
- **PO Cancellation Restriction 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 11, Page 13 ("Purchase order: Allowed transitions and conditions").
  - **Cancel blocked once any GRN exists.**

---

#### BR-11: Mandatory Site GRN & Serial Number Integrity 🟢 [Confirmed Requirement]
- **Specification Source:** Section 8 (Pages 8–9), Section 12 (Page 14) & Section 13 (Page 16).
- **Receipt Mandate:** Material received on a project is recorded **only through a GRN** (`GRN-YY-NNNN`).
- **Proof Mandate:** Uploading a **photo of the physical challan** is mandatory to record a GRN.
- **Mandatory Component Serialization:** Serial numbers are mandatory for serialized items (panels, inverters, batteries), by barcode scan or bulk paste.
- **Global Uniqueness Enforcement:** A serial number can belong to **only one project** across the system. Attempting to receive a serial already recorded on another project is blocked by the system, displaying the conflicting `Project ID` (Test Scenario 8, Page 21).
- **Immutable GRN History:** A GRN is **never deleted**. Mistakes are fixed by a reversal entry with a reason and Owner approval.

---

#### BR-12: Leftover Material Disposition 🟢 [Confirmed Requirement]
- **Specification Source:** Section 8, Page 9.
- **Rule Statement:** After installation, leftover items are recorded on the project.
- **Allowed Actions:** Each leftover is either:
  1. Moved to another project (**Project Manager approval required**; reduces target project PR demand).
  2. Returned to the vendor (**Debit note against the vendor bill**).

---

#### BR-13: Installation Milestone Progression & Gating
- **Seven Default Milestones 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 7 (Pages 7–8) & Section 18 (Page 22).
  - 1. Project kickoff and site plan; 2. Material received at site; 3. Structure installed; 4. Panels mounted; 5. Inverter and wiring complete; 6. Testing and commissioning; 7. Handover to customer (warranty documents, customer signature).
- **Sequential Completion Enforcement 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 7 (Page 8), Section 11 (Page 12) & Section 13 (Page 16).
  - Milestones complete in order: A milestone cannot be marked Done while an earlier one is Pending.
- **Milestone 2 GRN Dependency 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 7, Page 8.
  - "Material received at site" can **only be marked Done after at least one GRN exists for this project**.
- **Proof Photo Requirement 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 7, Page 8.
  - Proof photos are required to mark any milestone Done.
- **Delayed Project Flagging 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 7, Page 8.
  - A project is `Delayed` when today is past a milestone's planned date and it is not Done; shown in red on lists and dashboard.
- **Milestone Sequence Admin Override 🔵 [Proposed System Rule Needing Management Policy Approval]:**
  - *Specification Note:* The specification mentions parenthetically on Pages 8, 12, 16, and 20: `(admin override with a reason is logged)`.
  - *Policy Classification:* Because bypassing sequence order violates engineering integrity, allowing an Owner/Admin override with a logged justification reason is categorized as a **Proposed System Rule requiring formal client sign-off**.

---

#### BR-14: Commissioning Trigger & Unlocks 🟢 [Confirmed Requirement]
- **Specification Source:** Section 7 (Page 8) & Section 10 (Page 11).
- **Rule Statement:** Marking Milestone 6 ("Testing and commissioning") as Done sets the project commissioning date.
- **Dual Unlocks:**
  1. Unlocks the WCR step in the subsidy record.
  2. Unlocks the commissioning payment instalment as due.
  3. Enables issuance of the single final GST tax invoice.

---

#### BR-15: Single Final GST Tax Invoice Specification 🟢 [Confirmed Requirement]
- **Specification Source:** Section 10 (Page 11) & Section 18 (Page 22).
- **Rule Statement:** Exactly **one final GST tax invoice per project** (`INV/26-27/NNNN`), issued at commissioning (or when the accounts user chooses).
- **Invoice Content Mandate:**
  - System description (e.g. 3 kW on-grid rooftop solar system) and a single lump-sum value with GST.
  - The list of supplied items with make, quantity, and **serial numbers (panels, inverter, battery) taken from the project's GRNs**.
  - **No per-item prices** are shown on the tax invoice.
  - Payments already received and the balance due.
- **E-Invoice Readiness:** Numbering per financial year. E-invoice and e-way bill fields are stored for later integration.

---

#### BR-16: Government Subsidy & DISCOM Sequential Progression
- **Strict Sequential Order 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 9 (Pages 9–10), Section 11 (Page 13) & Section 13 (Page 16).
  - Lifecycle: `Application registered` $\rightarrow$ `DISCOM feasibility` $\rightarrow$ `Installation details uploaded` $\rightarrow$ `WCR submitted` $\rightarrow$ `Service Order (SO) issued` $\rightarrow$ `Net metering done` $\rightarrow$ `Subsidy credited to customer`.
  - WCR Submitted **only after project commissioning milestone is Done**.
  - Service Order (SO) Issued **only after WCR is submitted**.
  - Net Metering Done **only after SO is issued**.
- **Stuck Subsidy Alerting 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 9, Page 10.
  - A record is `Stuck` when it has stayed in one stage longer than the threshold. Stuck records show on the dashboard and notify the liaison user weekly.
- **Subsidy Stuck Threshold 🟡 [Pending Management Confirmation - Configurable Default]:**
  - Default threshold is **45 days**, configurable by admin without code changes.
- **Commercial Subsidy Exemption 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 9, Page 9.
  - One subsidy record is created per project on order conversion (skip with a reason if the project is not eligible, e.g. commercial).

---

#### BR-17: Bank Loan Two-Tranche Disbursement Rules
- **Disbursement Schedule 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 1 (Page 2), Section 10 (Page 11) & Section 18 (Page 22).
  - The schedule always contains three parts:
    1. **Margin money** (payer: customer), usually as advance.
    2. **Bank tranche 1** (payer: bank), due on loan sanction; the bank releases it immediately after approval.
    3. **Bank tranche 2** (payer: bank), due **only after the WCR is submitted and the SO / net metering is done**.
- **Tranche 2 Status Display 🟢 [Confirmed Requirement]:**
  - Tranche 2 explicitly displays *"Waiting for WCR / SO"* until those subsidy stages are recorded.
- **Stuck Loan Alerting 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 10, Page 11.
  - A loan record is `Stuck` after exceeding the status duration threshold.
- **Loan Stuck Threshold 🟡 [Pending Management Confirmation - Configurable Default]:**
  - Default threshold is **21 days**, configurable by admin without code changes.
- **Loan Rejection Handling 🟢 [Confirmed Requirement]:**
  - *Specification Source:* Section 11, Page 13.
  - If a loan is marked `Rejected`, the system prompts a change of payment mode on the project.

---

#### BR-18: Three-Way Match for Vendor Bill Payout Approval 🟢 [Confirmed Requirement]
- **Specification Source:* Section 10 (Pages 11–12) & Section 11 (Page 13).
- **Rule Statement:** Vendor bill entered against PO and GRN (bill number, date, amount, GST, TDS).
- **Match Criteria:** Bill can be approved for payment **only when bill qty $\le$ GRN qty and rate = PO rate** (tolerance configurable).
- **Mismatch Routing:** Mismatches go to **Owner for approval** before payment can proceed.

---

#### BR-19: Project Closure Triple-Lock Condition 🟢 [Confirmed Requirement]
- **Specification Source:** Section 11 (Page 12) & Section 17 (Page 20, Test Scenario 5).
- **Rule Statement:** A project transitions to `Closed` if and only if **all three** of the following conditions are met:
  1. **All customer and bank instalments are in `Paid` status** (Customer and bank dues fully cleared; Outstanding = ₹0.00).
  2. **The subsidy record shows `Net Metering Done`** (or `Not Applicable` as explicitly specified on Page 12 for projects where subsidy was skipped with a reason, e.g. commercial).
  3. **The closure is approved by the Owner.**
- **Closure Independence from Subsidy Credit:** Subsidy credit to the customer is **not a closure condition** (it is recorded when customer confirms and can be updated after the project is closed).
- **Closure P&L Locking:** Project closure permanently locks the final project P&L.

---

#### BR-20: Deletion Restrictions & Project Cancellation 🟢 [Confirmed Requirement]
- **Specification Source:** Section 11 (Page 12) & Section 13 (Page 16).
- **Lead Deletion Guard:** Deleting a lead with an active project is blocked.
- **Project Deletion Guard:** Deleting a project with transactions is blocked. Use Cancel instead.
- **Project Cancellation Barrier:** Cancelling a project requires entering a reason and is **strictly blocked once material has been received at site**.

---

### 3. Field Formats & Data Integrity Validations Summary Table

| Data Field | Validation Rule & Format Standard | Classification | Source Reference |
| :--- | :--- | :---: | :--- |
| **Mobile Number** | Exactly 10 digits, Indian format (`^[6-9]\d{9}$`). Duplicate check on save; admin can merge. | 🟢 Confirmed Requirement | Spec Page 5, 17 |
| **PIN Code** | Exactly 6 digits (`^[1-9][0-9]{5}$`). | 🟢 Confirmed Requirement | Spec Page 5, 17 |
| **GSTIN Format** | 15 characters with checksum validation (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`). | 🟢 Confirmed Requirement | Spec Page 8, 17 |
| **PAN Format** | 10-character alphanumeric Indian PAN format (`^[A-Z]{5}[0-9]{4}[A-Z]{1}$`). | 🔵 Proposed System Rule | Spec Page 8, 14 mentions PAN; regex format proposed |
| **IFSC Code** | 11-character Indian banking code (`^[A-Z]{4}0[A-Z0-9]{6}$`). | 🔵 Proposed System Rule | Spec Page 8, 14 mentions bank details; IFSC format proposed |
| **Survey Photos** | Minimum 4 mandatory photos: Roof, Meter, DB, Inverter Wall. | 🟢 Confirmed Requirement | Spec Page 6 |
| **Milestone Proof Photos** | Proof photos required to mark milestone Done (minimum 1 photo upload). | 🟢 Confirmed Requirement | Spec Page 8 |
| **Milestone Photo Taxonomy** | Specific photo categories/angles per milestone (e.g. clamp torque, earthing pit). | 🔵 Proposed System Rule | Proposed operational guideline (not mandated in spec) |
| **GRN Challan Photo** | Photo of physical vendor delivery challan mandatory to submit GRN. | 🟢 Confirmed Requirement | Spec Page 9, 14 |
| **Net Meter Photo** | Photo of net meter mandatory at net metering stage. | 🟢 Confirmed Requirement | Spec Page 10 |
| **Subsidy Proof File** | Bank SMS or statement screenshot proving government subsidy credit to customer. | 🟢 Confirmed Requirement / 🟡 Pending Confirmation | Spec Page 10, 22 (proof format awaiting client choice) |
| **System Size (kWp)** | Positive decimal number $> 0.00$. Suggested from monthly kWh units. | 🟢 Confirmed Requirement | Spec Page 6 |
| **Instalment Total** | Sum of instalments $\equiv$ Quotation Grand Total (rounded to 2 decimal places). | 🟢 Confirmed Requirement | Spec Page 7, 11, 16 |
| **Net Customer Cost** | Grand Total $-$ Total Subsidy $\ge 0.00$. Block save if negative. | 🟢 Confirmed Requirement | Spec Page 6, 16 |
| **Overdue Amount** | Overdue Amount $\le$ Outstanding Amount (Total Due $-$ Total Received). | 🟢 Confirmed Requirement | Spec Page 16 |
| **Serial Numbers** | Serial string cannot be empty; unique across system; count must equal received quantity. | 🟢 Confirmed Requirement | Spec Page 9, 14, 16, 21 |
| **Photo Upload Size** | Photos compressed on upload (max 1 MB each); documents up to 10 MB. | 🟢 Confirmed Requirement | Spec Page 19 |

---

### 4. Categorized Summary of Rules

#### 4.1 Confirmed Rules from the Original PDF 🟢
1. Unique, gap-free, server-generated numbering per FY (`PRJ-YY-NNNN`, `QT-YY-NNNN-Rn`, `PR-YY-NNNN`, `PO-YY-NNNN`, `GRN-YY-NNNN`, `INV/26-27/NNNN`, `RCT-YY-NNNN`).
2. Automatic quotation expiration after validity date.
3. Quotation revision versioning (`R1`, `R2...`) with previous versions read-only.
4. Non-negative net customer cost ($\text{Grand Total} - \text{Total Subsidy} \ge 0$; block save if negative).
5. Payment instalment balancing ($\sum \text{Instalments} \equiv \text{Grand Total}$).
6. Subsidy credited directly into customer bank account; never company revenue or receivable.
7. Atomic order conversion creating Project, payment schedule, subsidy, loan, and PR draft; locks quote; lead becomes Won.
8. Zero-warehouse, direct-to-site procurement.
9. Pre-fabricated structure iron; no in-house fabrication.
10. PR leftover deduction ($\text{Qty to buy} = \text{BOM} - \text{leftover}$).
11. Excess procurement approval: Ordering $>5\%$ above BOM requires PM approval.
12. PO cancellation strictly blocked once any GRN exists.
13. Mandatory site GRN with physical delivery challan photo.
14. Mandatory serial numbers for panels, inverters, and batteries via barcode scan or bulk paste.
15. Global serial uniqueness: A serial number can belong to only one project across the entire system.
16. GRNs are never deleted; mistakes fixed by reversal entry with reason and Owner approval.
17. Leftovers moved to another project (PM approval) or returned to vendor (debit note).
18. Seven installation milestones completed in strict sequence.
19. Milestone 2 ("Material received at site") blocked without at least one recorded site GRN.
20. Milestone proof photos mandatory to mark any milestone Done.
21. Commissioning Done sets commissioning date and unlocks WCR submission, final GST invoice, and commissioning payment.
22. Single final GST invoice listing supplied equipment and GRN serial numbers without per-item prices.
23. Subsidy sequential progression: WCR before SO, SO before Net Metering.
24. Bank loan schedule: Margin money + Tranche 1 (on sanction) + Tranche 2 (strictly post-WCR and Net Metering).
25. Three-way match: Bill Qty $\le$ GRN Qty and Bill Rate = PO Rate; mismatches route to Owner.
26. Project closure triple-lock: Customer and bank dues cleared (balance = ₹0.00), Net Metering Done (or Not Applicable for commercial), and Owner approval.
27. Subsidy credit to customer is not a closure condition.
28. Deleting leads with projects or projects with transactions is blocked.
29. Project cancellation blocked once materials reach site.
30. Format validations: 10-digit Indian mobile, 15-character GSTIN with checksum validation, 6-digit PIN.

#### 4.2 Proposed Rules Needing Approval 🔵
1. **Milestone Sequence Admin Override:** Allowing Owner/Admin to bypass milestone sequence with logged justification. *(Note: Mentioned parenthetically in the PDF, but isolated as a proposed policy requiring explicit client governance approval).*
2. **PAN Format Validation Regex:** Enforcing `^[A-Z]{5}[0-9]{4}[A-Z]{1}$`.
3. **IFSC Banking Code Format Regex:** Enforcing `^[A-Z]{4}0[A-Z0-9]{6}$`.
4. **Milestone Proof Photo Taxonomy:** Specific sub-category labels per milestone (e.g., structure foundation, inverter wiring terminal).
5. **Precision Data Types:** Using `DECIMAL(14,2)` for financial fields and UUIDs for internal primary keys.

#### 4.3 Pending Management Decisions 🟡
1. **Quotation Validity Default:** Default duration of 15 days awaiting client operational confirmation.
2. **Quotation Discount Approval Threshold:** Default limit of **>5% of grand total** for Owner approval awaiting sign-off.
3. **Purchase Order Approval Limit:** Default limit of **>₹2,00,000** for Owner approval awaiting sign-off.
4. **Subsidy Stuck Alert Threshold:** Default threshold of **>45 days** in one stage awaiting sign-off.
5. **Bank Loan Stuck Alert Threshold:** Default threshold of **>21 days** in one status awaiting sign-off.
6. **Customer Subsidy Proof Document:** Choosing whether staff upload a mobile screenshot of bank SMS/statement or require an official bank statement PDF / National Portal certificate.
7. **Final Customer Invoice GST Treatment:** Written CA determination on tax treatment (70:30 Goods/Services split vs. Composite Supply).
8. **WhatsApp Business API Gateway:** Provider platform name and credentials.

---

### 5. Correction Summary
- **Classification Applied:** Every single business rule and validation in Document 08 has been explicitly tagged with its governance status (🟢 Confirmed, 🔵 Proposed, or 🟡 Pending Confirmation).
- **Quotation Expiry:** Documented automatic expiration as Confirmed, and the 15-day duration as a configurable default awaiting confirmation.
- **Cancellation Restrictions:** Confirmed verbatim against PDF Page 12 (project cancellation blocked once material received at site) and PDF Page 13 (PO cancellation blocked once GRN exists).
- **Milestone Sequence Override:** Isolated the admin override bypass as a proposed operational exception requiring explicit managerial sign-off, preserving the strict sequential completion as Confirmed.
- **Stuck Alerts:** Preserved the alerting mechanism as Confirmed, and marked the 45-day subsidy and 21-day loan durations as configurable proposals awaiting confirmation.
- **Project Closure Conditions:** Re-anchored project closure strictly to: (1) Customer and bank dues cleared (balance = ₹0.00), (2) DISCOM Net Metering completed, and (3) Owner approval. Clarified that `(or Not Applicable)` is strictly limited to commercial subsidy-exempt projects.
- **Subsidy Accounting:** Preserved absolute separation of subsidy from company receivables and confirmed it is not a closure condition.
- **Field Validations:** Confirmed 15-character GSTIN with checksum validation, 10-digit mobile, 6-digit PIN, 4 survey photos, and GRN challan photo from the PDF; labeled PAN regex, IFSC regex, and milestone photo taxonomies as proposed rules.
