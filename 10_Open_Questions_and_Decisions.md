# Solaris EPC – Solar ERP System (Phase 1)
## Document 10: Confirmed Architectural Decisions, Open Questions & Risk Registry

---

### 1. Introduction
This document captures all formal architectural and business decisions confirmed by client stakeholders on November 20, 2026, alongside all unresolved operational decisions, regulatory questions, and technical assumptions explicitly noted in the project specification.

Per the project directives: **No open decisions may be resolved unilaterally by engineering. Every unresolved item requires explicit stakeholder confirmation.**

---

### 2. Confirmed Client Decisions (Source of Truth)
The decisions below were formally confirmed by client management and override any prior assumptions or prototype behaviors:

| # | Operational Domain | Confirmed Decision | Relevant Modules | Impact on Development |
| :-: | :--- | :--- | :--- | :--- |
| **01** | **Government Subsidy Crediting** | Subsidy under PM Surya Ghar and state schemes is credited by the government **directly into the customer's personal bank account**, never to the company. Staff record credit confirmations manually. **Subsidy is strictly NOT a company receivable.** | Quotation, Subsidy, Finance, Dashboard | Subsidy amounts are excluded from company balance sheet, turnover, and receivables ageing. |
| **02** | **Payment Instalment Structure** | **No fixed split.** The user defines instalments freely on each quotation (any number of instalments, payer: Customer or Bank, trigger event, and amount in ₹ or %). Saved templates are optional shortcuts. | Quotations, Customer Payments | Dynamic form array for payment schedule; validation enforces $\sum \text{Instalments} \equiv \text{Grand Total}$. |
| **03** | **Commercial Discount Input** | Commercial discount can be entered as a fixed amount (₹) or a percentage (%) of the quote. The customer PDF always renders the discount in ₹. | Quotations | Dual input UI with automatic calculation; triggers approval if $>5\%$. |
| **04** | **Launch Geography & Expansion** | Launch operations in **Rajasthan, starting with Jaipur**. Geographic entities (States, Districts, DISCOMs) are database masters so new territories can be added without code modifications. | CRM, Settings, Tax Invoicing | Dynamic master tables; place of supply computes CGST+SGST or IGST automatically. |
| **05** | **Accounting Software Integration** | **Tally** is the confirmed accounting platform. Phase 1 delivers automated XML data export for vouchers (invoices, receipts, vendor bills, payments). | Finance, Reports | Export endpoints generate Tally-compliant XML schemas. |
| **06** | **Customer Messaging Gateway** | **WhatsApp Business API** is already in place with the client. Phase 1 integrates directly with their gateway provider. | CRM, Notifications, Quotes | Automated dispatch of PDF quotes, receipts, and follow-up alerts via WhatsApp. |
| **07** | **Zero-Warehouse Operating Model** | **No central warehouse or godown.** All hardware is purchased specifically for a project and delivered directly to the customer's rooftop installation site. | Procurement, Materials, GRN | Ship-to address on POs defaults to project site; no central stock accounting. |
| **08** | **Structure Fabrication Policy** | Rooftop mounting structure iron is **purchased pre-fabricated and pre-drilled from vendors** and assembled on site. No in-house fabrication workshop exists. | BOM, Procurement | Structure items are standard purchased items; no manufacturing job cards. |
| **09** | **Installation Milestone Sequence** | The **default 7-step milestone template** is accepted: 1. Kickoff, 2. Material received, 3. Structure installed, 4. Panels mounted, 5. Wiring complete, 6. Commissioning, 7. Handover. | Projects, Milestones | Admin can edit template in settings, but default 7-step sequence is baseline. |
| **10** | **Go-Live Data Migration** | **Zero transactional historical data to migrate.** System goes live with clean master data only (Items, Vendors, BOM Templates, Subsidy Rules, Financiers, Users) loaded via CSV. | System Administration | Build CSV master import utilities; no legacy transactional import scripts needed. |
| **11** | **Customer Tax Invoicing Convention** | **Exactly one final GST tax invoice per project**, issued at commissioning. It displays a single lump-sum system value and lists supplied equipment with serial numbers from GRNs **without individual item prices**. | Invoicing, Accounts | Invoice template pulls serials from GRNs; suppresses individual component rates. |
| **12** | **DISCOM Net Metering Mechanics** | After WCR submission, DISCOM issues a Service Order (SO); a DISCOM technician then visits the site and installs the net meter. Net metering is the final technical step and prerequisite for closure. | Subsidy, Projects | SO and Net Metering are entered manually by the liaison user. |
| **13** | **Bank Loan Disbursement Schedule** | Financiers disburse solar loans in two distinct tranches: **Tranche 1 immediately upon loan sanction**, and **Tranche 2 only after WCR and Net Metering are completed**. | Bank Loans, Payments | Tranche 2 displays "Waiting for WCR / SO" until Net Metering is recorded Done. |
| **14** | **Flexible Multi-Role Security** | One user can hold multiple roles simultaneously; entitlements combine additively. Admin can reconfigure permissions without code changes. | Security, Roles | Server-side permission evaluator evaluates union of user's active role privileges. |

---

### 3. Open Questions & Pending Decisions (Awaiting Stakeholder Sign-Off)
The following 4 items are explicitly identified as **"Still Open"** on Page 22 of the original specification:

#### Open Item 01: Managerial Approval Limits
- **Specification Text:** *"Approval limits: above what discount and what PO value is Owner approval needed? (Default: 5% of quote and ₹2,00,000 per PO, both configurable)."*
- **Current System Default:**
  - Quotation Discount Threshold: `5.00% of Grand Total`.
  - Purchase Order Value Threshold: `₹ 2,00,000.00`.
- **Architectural Implementation:** Built as dynamic runtime configuration parameters in `Settings > System Thresholds`.
- **Pending Decision from Client:** Confirm whether these initial default thresholds (5% and ₹2,00,000) are acceptable for day-1 go-live, or specify alternate initial limits.

#### Open Item 02: WhatsApp Business API Provider Credentials & Technical Interface
- **Specification Text:** *"WhatsApp Business API provider name and access details for the integration."*
- **Current Status:** Client has confirmed that an API account exists, but the specific provider platform (e.g., Gupshup, Wati, Interakt, AiSensy, Meta Cloud API) and authentication credentials have not been delivered.
- **Architectural Implementation:** Abstracted messaging service adapter in the backend, allowing rapid binding to any webhook/REST provider once credentials arrive.
- **Pending Decision from Client:** Provide technical provider name, API endpoint URLs, Webhook tokens, and approved WhatsApp template message IDs.

#### Open Item 03: GST Tax Treatment on the Single Final Customer Tax Invoice
- **Specification Text:** *"GST treatment on the single final invoice (rates for supply and installation), to be confirmed with the client's CA."*
- **Tax Background in Indian Solar:**
  - *Option A (70:30 Statutory Split):* Under standard MNRE/GST council guidelines, solar projects are treated as 70% Goods (taxed at 12% GST) and 30% Services (taxed at 18% GST), producing an effective blended GST rate of **13.80%**.
  - *Option B (Single Composite Supply):* Billed under Works Contract Services at a flat 12% or 18% GST.
  - *Option C (Single Pure Equipment Supply with Exempt/Standard Labor):* Specific CA billing advice.
- **Architectural Implementation:** The tax engine supports configurable GST calculation rules per template.
- **Pending Decision from Client:** Obtain written determination from the client's Chartered Accountant (CA) on the exact GST invoicing structure and HSN/SAC codes to be rendered on `INV/26-27/NNNN`.

#### Open Item 04: Verification Proof Standard for Customer Subsidy Credit
- **Specification Text:** *"Proof of subsidy credit to the customer: bank SMS or statement upload by staff? (Default: staff upload a screenshot)."*
- **Current System Default:** Staff upload a mobile screenshot of the customer's bank SMS alert or bank statement showing the credit amount and UTR.
- **Pending Decision from Client:** Confirm whether screenshot upload is sufficient, or if a formal bank statement PDF or National Portal subsidy disbursement certificate is required.

---

### 4. Additional Operational & Architectural Clarifications (Identified in Deep Analysis)

The following operational nuances were identified during comprehensive architecture mapping and are cataloged here for client confirmation:

1. **Commercial & Industrial (C&I) Subsidy Exemption Workflow:**
   - *Observation:* C&I clients generally do not qualify for PM Surya Ghar residential subsidies.
   - *Proposed Architecture:* When converting a quote to order for a C&I lead, the system automatically checks "Subsidy Not Applicable" and prompts for an optional justification reason. Project closure evaluates this flag and bypasses subsidy prerequisites.
   - *Confirmation Required:* Confirm whether C&I leads require any state-specific open-access or net-metering approvals before closure.
2. **Loan Rejection Fallback Mechanics:**
   - *Observation:* If a bank rejects a rooftop loan application after order conversion, what happens to the project?
   - *Specification Rule:* "Rejected prompts a change of payment mode on the project."
   - *Proposed Architecture:* System triggers a "Reconfigure Payment Mode" modal, allowing the Accounts team to convert the project to `Self-funded`, readjust the instalment schedule, and collect margin money directly from the customer.
3. **Split Vendor POs from a Single Purchase Requisition:**
   - *Observation:* A single project PR contains diverse components (Panels, Inverter, Structure Iron, BOS Cables). These components are sourced from different specialized vendors.
   - *Proposed Architecture:* The procurement system allows partial PO creation from an RFQ, enabling the Purchase Officer to issue separate POs to Vendor A (Panels), Vendor B (Inverter), and Vendor C (Structure) from a single PR. The PR status moves to `PO Created (Partial)` until all line items are covered.

---

### 5. Risk Assessment & Mitigation Matrix

| Identified Risk | Risk Description | Probability | Impact | Architectural Mitigation Strategy |
| :--- | :--- | :---: | :---: | :--- |
| **R1: Serial Collision at Site** | Site supervisor attempts to enter an already-installed panel serial number. | Medium | High | Hard database uniqueness constraint on `serial_number_string`. Real-time validation alerts supervisor and displays conflicting `Project ID`. |
| **R2: Milestone Sequence Bypass** | Field team attempts to mark commissioning done before structure or panels are installed. | Medium | Critical | Server-side sequential validator blocks milestone progression. Admin override requires typed justification and logs permanent audit trail. |
| **R3: Subsidy Gating Confusion** | Project closed before DISCOM net meter is installed, causing customer dispute. | High | Critical | Triple-lock closure barrier: System physically blocks closure button until Net Metering is recorded Done and balance is ₹0.00. |
| **R4: Working Capital Erosion** | Quotations issued with high commercial discounts without management awareness. | Medium | High | Server-side discount validator (>5%) forces quote into `Pending Approval`, holding dispatch until Owner signs off. |
| **R5: Vendor Over-Billing** | Vendor bills for higher quantities or higher rates than agreed on PO. | High | Medium | Automated 3-way match engine blocks payout approval if Bill Qty > GRN Qty or Bill Rate $\ne$ PO Rate; mismatches route to Owner. |
| **R6: Field Connectivity Loss** | Survey engineer loses cellular signal on rural rooftops in Rajasthan. | High | Medium | Mobile PWA architecture with Service Worker caching, offline draft storage in IndexedDB, and automated background sync upon reconnecting. |
