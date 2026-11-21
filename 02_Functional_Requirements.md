# Solaris EPC – Solar ERP System (Phase 1)
## Document 02: User Roles, Permissions & Functional Requirements Matrix

---

### 1. Architectural Philosophy: Role-Based Access Control (RBAC)
Solaris EPC implements a strict, server-enforced Role-Based Access Control (RBAC) model. Permissions are never merely visual toggles hidden in the user interface; every API endpoint, state transition, and data query evaluates the authenticated user's combined entitlement profile.

#### Core Security Principles:
1. **Server-Side Enforcement:** Hidden UI buttons or restricted menus must be backed by zero-trust backend authorization. Unauthorized payloads return `403 Forbidden`.
2. **Multi-Role Union Assignment:** A single user identity can be mapped to multiple roles (e.g., a branch operations lead acting as both *Project Manager* and *Purchase Officer*). When multiple roles are assigned, permissions **combine additively** (Union of entitlements).
3. **Dynamic Role Configuration:** System Administrators have the ability to rename roles, add new custom roles, and reconfigure granular permissions for any module at runtime via Settings masters without software re-compilation or deployment.
4. **Data Scoping (Ownership & Assignment):**
   - **Sales Executives** can only view and edit their own assigned leads and quotations.
   - **Survey Engineers** can only view and update site surveys assigned directly to them.
   - **Project Managers** manage assigned projects, milestone updates, and material requisitions.
   - **Owner / Admin** holds global visibility (`All`) across all leads, projects, finances, procurement, and system logs.

---

### 2. Comprehensive Role Definitions

#### 2.1 Owner / Admin
- **Business Profile:** Company directors, business owners, and principal system administrators.
- **Operational Responsibility:** Executive governance, gross margin oversight, policy exceptions, financial approvals, and master data control.
- **Key Capabilities & Privileges:**
  - Unrestricted view and edit access across all modules, leads, projects, and transactions.
  - Exclusive approval authority for quotations exceeding discount thresholds (default: >5% of Grand Total).
  - Exclusive approval authority for Purchase Orders exceeding procurement thresholds (default: >₹2,00,000).
  - Exclusive approval authority for vendor bill 3-way match discrepancies (quantity or rate mismatch).
  - Sole authority to execute final **Project Closure** (locks P&L and financial ledger).
  - Sole authority to approve GRN reversal entries.
  - Sole authority to reopen `Lost` leads back to `Contacted`.
  - Full management of master tables, users, roles, templates, and company profiles.

#### 2.2 Sales Executive
- **Business Profile:** Field sales representatives, inside sales agents, and commercial business development personnel.
- **Operational Responsibility:** Prospect qualification, enquiry management, customer consultation, quotation drafting, customer negotiation, and order closing.
- **Key Capabilities & Privileges:**
  - Create and edit their own assigned leads; view lead history and add timeline notes.
  - View site survey outputs and bill of materials (BOM) for their leads.
  - Draft quotations using system BOMs and discount parameters; submit high-discount quotes for Owner approval.
  - Share quotes via WhatsApp and email; execute the "Convert to Order" dialog upon customer acceptance.
  - Track customer payment schedules and payment receipt status for closed projects.
  - Strictly prohibited from viewing or approving procurement orders, vendor payables, or other sales reps' leads.

#### 2.3 Survey Engineer
- **Business Profile:** Technical site surveyors, civil/electrical site assessors, and rooftop engineers.
- **Operational Responsibility:** Physical rooftop inspection, electrical load verification, shadow and structural assessment, and photo evidence collection.
- **Key Capabilities & Privileges:**
  - Access the mobile-first "My Surveys" interface with offline drafting support.
  - Capture survey data: GPS coordinates (auto-captured), roof dimensions, height, shading, structure requirements, cable lengths, electrical meter details, and average monthly kWh.
  - Upload mandatory site photographs (minimum 4: Roof, Meter, Distribution Board, Inverter Wall) and capture customer digital signatures on glass.
  - Recommend system sizing (kWp) and select initial BOM templates based on roof feasibility.
  - Strictly limited to assigned survey tasks; no access to procurement, financial transactions, or unassigned CRM leads.

#### 2.4 Project Manager (PM)
- **Business Profile:** Technical project engineers, site supervisors, and installation managers.
- **Operational Responsibility:** Project execution scheduling, on-site milestone tracking, proof verification, site material oversight, and commissioning.
- **Key Capabilities & Privileges:**
  - Assigned project management from kickoff to customer handover across the 7 default milestones.
  - Submit Purchase Requisitions (PR) auto-generated from the approved BOM.
  - Approve leftover material transfers to other projects.
  - Approve procurement requisitions that exceed BOM quantities by more than 5%.
  - Verify physical material deliveries against Goods Receipt Notes (GRN) on site.
  - Complete technical commissioning, unlocking the regulatory WCR milestone and commissioning payment triggers.
  - Initiate the formal "Request Project Closure" action once all milestones and net metering are verified.

#### 2.5 Purchase Officer
- **Business Profile:** Procurement specialists, vendor managers, and supply chain coordinators.
- **Operational Responsibility:** Vendor relationship management, RFQ floating, commercial vendor quote comparison, PO issuance, and site delivery coordination.
- **Key Capabilities & Privileges:**
  - Convert approved Purchase Requisitions into competitive Requests for Quotation (RFQs).
  - Perform multi-vendor quote evaluations with automated lowest-landed-cost highlighting.
  - Generate Purchase Orders (POs) directed to the specific project rooftop address.
  - Monitor delivery timelines and dispatch tracking with vendors.
  - Record Goods Receipt Notes (GRN) on site with partial delivery tracking and mandatory serial number capture for panels, inverters, and batteries.
  - Manage Vendor Masters (GSTIN validation, bank details, ALMM/DCR compliance flags).

#### 2.6 Accounts Officer
- **Business Profile:** Financial controllers, billing accountants, and cash-flow administrators.
- **Operational Responsibility:** Customer invoicing, payment collections, bank loan disbursement tracking, vendor bill auditing, and Tally export synchronization.
- **Key Capabilities & Privileges:**
  - Manage customer payment schedules, record incoming customer receipts (advance, delivery, commissioning).
  - Monitor and log bank loan tranches (Tranche 1 upon sanction; Tranche 2 post-net-metering).
  - Issue the official, single final GST Tax Invoice at commissioning (displaying serialized equipment without itemized pricing).
  - Perform 3-way matching of vendor bills against POs and GRNs; prepare vendor disbursements.
  - Generate financial ageing reports (receivables and payables) and project-level P&L summaries.
  - Configure payment instalment templates and export transactional journals to Tally XML.

#### 2.7 Liaison Officer (Subsidy & DISCOM)
- **Business Profile:** Government regulatory liaisons, DISCOM coordinators, and renewable scheme specialists.
- **Operational Responsibility:** End-to-end management of the PM Surya Ghar and state solar subsidy lifecycle, DISCOM feasibility, WCR filings, and net-metering synchronization.
- **Key Capabilities & Privileges:**
  - Manage the 7-stage subsidy progression: Portal Registration, Feasibility, Installation Upload, WCR Submission, Service Order (SO) Issuance, Net Metering Done, and Customer Subsidy Credit.
  - Validate and upload mandatory compliance documents (Aadhaar, electricity bill, property proof, bank passbook, WCR document, SO document, net-metering photo).
  - Track stuck applications (>45 days) and coordinate DISCOM site inspections.
  - Record customer subsidy credit confirmation (proof of bank SMS / statement).
  - Manage subsidy rule masters (central slab rules and state-specific per-kW rate caps).

---

### 3. Master Role-Permission Matrix

The table below defines the exact entitlement profile across all functional domains, strictly reflecting Section 3 of the specification.

| Functional Domain / Module | Owner / Admin | Sales Executive | Survey Engineer | Project Manager | Purchase Officer | Accounts Officer | Liaison Officer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Leads (CRM)** | **All: V, C, E** | **Own: V, C, E** | Assigned: V | V | — | — | — |
| **Site Survey & BOM** | **V, C, E, A** | V | **Assigned: V, C, E** | V | V | — | — |
| **Quotations** | **V, C, E, A** *(Discounts)* | **Own: V, C, E** | V | V | V | V | V |
| **Projects & Milestones** | **V, C, E** | Own: V | V | **Assigned: V, C, E** | V | V | V |
| **Requisition, RFQ, PO** | **V, A** | — | — | **C** *(Requisition)* | **V, C, E** | V | — |
| **GRN & Site Material** | **V** | — | — | V | **V, C, E** | V | — |
| **Subsidy & WCR** | **V** | V | — | V | — | V | **V, C, E** |
| **Customer Payments & Loans** | **V, A** | V | — | V | — | **V, C, E** | V |
| **Vendor Bills & Payments** | **V, A** | — | — | — | V | **V, C, E** | — |
| **Project Closure** | **A** *(Final Approval)* | — | — | **Request** | — | V | — |
| **Settings & Masters** | **V, C, E** | — | — | — | Vendors, Items: **C, E** | Instalments: **C, E** | Subsidy Rules: **C, E** |

*Legend: V = View, C = Create, E = Edit, A = Approve, — = No Access.*

---

### 4. Granular Functional Permissions Matrix

| Granular Action / Feature | Owner / Admin | Sales | Survey | PM | Purchase | Accounts | Liaison |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| View Unassigned / Peer Leads | Yes | No | No | Yes | No | No | No |
| CSV Lead Import & Export | Yes | No | No | No | No | No | No |
| Reopen Lost Lead to Contacted | Yes | No | No | No | No | No | No |
| Schedule Site Survey | Yes | Yes | No | Yes | No | No | No |
| Execute Offline Survey & Submit Draft | Yes | No | Yes | No | No | No | No |
| Override Recommended kWp | Yes | No | Yes | Yes | No | No | No |
| Create / Edit BOM Templates | Yes | No | No | No | Yes | No | No |
| Approve Quotation Discount (>5%) | Yes | No | No | No | No | No | No |
| Convert Accepted Quote to Order | Yes | Yes | No | No | No | No | No |
| Re-order Milestone Sequence (Override) | Yes (Logged) | No | No | No | No | No | No |
| Mark "Material Received" Milestone | Yes | No | No | Yes (Req GRN) | No | No | No |
| Submit Purchase Requisition | Yes | No | No | Yes | Yes | No | No |
| Approve PO Value (>₹2,00,000) | Yes | No | No | No | No | No | No |
| Cancel Purchase Order | Yes | No | No | No | Yes (No GRN) | No | No |
| Barcode Scan / Bulk Paste Serials | Yes | No | No | Yes | Yes | No | No |
| Record GRN Reversal Entry | Yes (Approval) | No | No | No | No | No | No |
| Approve Leftover Material Transfer | Yes | No | No | Yes | Yes | No | No |
| Update DISCOM Feasibility & SO | Yes | No | No | No | No | No | Yes |
| Submit WCR Document | Yes | No | No | No | No | No | Yes (Post-Comm) |
| Record Customer Subsidy Credit | Yes | No | No | No | No | Yes | Yes |
| Record Customer Receipts (Bank/Cash) | Yes | No | No | No | No | Yes | No |
| Record Bank Loan Tranche 1 / 2 | Yes | No | No | No | No | Yes | No |
| Issue Final GST Tax Invoice | Yes | No | No | No | No | Yes | No |
| Approve Vendor Bill 3-Way Mismatch | Yes | No | No | No | No | No | No |
| Record Vendor Bill Payment | Yes | No | No | No | No | Yes | No |
| Perform Final Project Closure | Yes | No | No | No | No | No | No |
| Export Data to Tally XML Format | Yes | No | No | No | No | Yes | No |
| Modify State / DISCOM Masters | Yes | No | No | No | No | No | No |
| Configure Approval Thresholds & Stuck Days | Yes | No | No | No | No | No | No |

---

### 5. Multi-Role User Execution Scenarios
In practical solar EPC organizations, operational roles overlap depending on organization size and branch structure:

1. **Scenario A: Combined Operations Lead (Project Manager + Purchase Officer)**
   - The user inherits: `Assigned: V, C, E` on Projects + `V, C, E` on Requisitions, RFQ, POs, and GRNs.
   - The user can create the PR, float the RFQ, issue the PO, receive material on-site with serial barcode scanning, and mark the "Material received at site" milestone Done.
2. **Scenario B: Commercial Lead (Sales Executive + Liaison Officer)**
   - The user manages the sales pipeline, generates quotations, and directly handles DISCOM portal registrations, WCR submissions, and subsidy follow-ups.
3. **Scenario C: Financial Controller (Accounts Officer + System Admin)**
   - The user issues GST invoices, reconciles 3-way matches, logs bank disbursements, approves financial variances, and exports audit journals to Tally.

### 6. Data Integrity & Authorization Safeguards
- **Ownership Partitioning:** Sales users querying the `/api/leads` endpoint receive records filtered strictly by `assigned_to = current_user_id`. Attempting to retrieve an unassigned lead returns `404 Not Found` or `403 Forbidden`.
- **Status Gating:** No role (including Admin) can push a record into a status without satisfying mandatory predecessor criteria (e.g., WCR cannot be submitted unless "Testing and Commissioning" milestone is marked Done; Project Closure is blocked unless Net Metering is recorded and outstanding balance is ₹0.00).
- **Audit Immutability:** Every permission check failure, manual override, status alteration, and financial transaction creates a permanent, non-deletable record in the `Activity Log`.
