# Solaris EPC – Solar ERP System (Phase 1)
## Document 09: UI/UX Design System, Dashboard & Reporting Architecture

---

### 1. Design System Philosophy & Aesthetic Vision
The **Solaris EPC** design system is engineered specifically for mission-critical enterprise workflows in the Indian solar rooftop market. It rejects frivolous consumer animations in favor of **high-density data presentation, instant visual scannability, bulletproof responsiveness, and professional executive presentation**.

The aesthetic pairs clean modern SaaS principles with solar industry motifs: deep industrial slate for structure, crisp solar indigo for primary actions, warm energetic amber for solar production and alerts, and vibrant emerald for compliance, completed milestones, and financial collections.

---

### 2. Comprehensive Color Palette (HEX & Semantic Tokens)

```
+---------------------------------------------------------------------------------------------------+
| BRAND & SOLAR ENERGETIC PALETTE                                                                   |
| [ #0F172A ] Slate 900  - Primary Headings & Dark Elements                                         |
| [ #1E3A8A ] Navy 900   - Enterprise Brand Accent                                                  |
| [ #2563EB ] Blue 600   - Primary Brand CTA & Active Links                                         |
| [ #F59E0B ] Amber 500  - Solar Power, Quoted Energy & Warnings                                    |
| [ #10B981 ] Emerald 500- Done Milestones, Paid Invoices & Verified Steps                          |
| [ #EF4444 ] Rose 500   - Delayed Projects, Overdue Instalments & Mismatches                       |
| [ #F8FAFC ] Slate 50   - Canvas Background                                                        |
| [ #FFFFFF ] Pure White - Card & Table Surfaces                                                    |
+---------------------------------------------------------------------------------------------------+
```

#### 2.1 Brand & Action Colors
- **Primary Brand / Action:** `#2563EB` (Tailwind `blue-600`) - Used for primary action buttons, active navigation links, and primary progress bars.
  - *Hover State:* `#1D4ED8` (`blue-700`)
  - *Light Tint (Selection/Active Nav):* `#EFF6FF` (`blue-50`)
- **Brand Dark / Primary Typography:** `#0F172A` (`slate-900`) - Used for page headers, card headings, and dark sidebar options.
- **Solar Energy Accent:** `#F59E0B` (`amber-500`) - Used for solar kWp metrics, energy generation badges, and active survey markers.
  - *Light Tint:* `#FEF3C7` (`amber-100`)
- **WhatsApp Integration Green:** `#25D366` - Standardized brand color for one-tap WhatsApp messaging and document sharing.

#### 2.2 Semantic Status Colors
- **Success / Done / Won / Matched / Paid:**
  - Base: `#10B981` (`emerald-500`)
  - Text: `#065F46` (`emerald-800`)
  - Background Tint: `#ECFDF5` (`emerald-50`)
  - Border: `#A7F3D0` (`emerald-200`)
- **Warning / Pending Approval / Due / Under Review:**
  - Base: `#F59E0B` (`amber-500`)
  - Text: `#92400E` (`amber-800`)
  - Background Tint: `#FFFBEB` (`amber-50`)
  - Border: `#FDE68A` (`amber-200`)
- **Danger / Delayed / Overdue / Stuck / Mismatch / Lost:**
  - Base: `#EF4444` (`rose-500`)
  - Text: `#991B1B` (`rose-800`)
  - Background Tint: `#FEF2F2` (`rose-50`)
  - Border: `#FECDD3` (`rose-200`)
- **Informational / Scheduled / Sent / In Progress:**
  - Base: `#3B82F6` (`blue-500`)
  - Text: `#1E40AF` (`blue-800`)
  - Background Tint: `#EFF6FF` (`blue-50`)
  - Border: `#BFDBFE` (`blue-200`)
- **Neutral / Draft / Not Started / Closed:**
  - Base: `#64748B` (`slate-500`)
  - Text: `#334155` (`slate-700`)
  - Background Tint: `#F1F5F9` (`slate-100`)
  - Border: `#CBD5E1` (`slate-300`)

#### 2.3 Neutral & Surface Architecture
- **Application Canvas Background:** `#F8FAFC` (`slate-50`)
- **Card & Modal Surface:** `#FFFFFF` (`white`)
- **Subtle Surface (Table Headers, Disabled Inputs):** `#F1F5F9` (`slate-100`)
- **Component Borders:** `#E2E8F0` (`slate-200`)
- **Divider Lines:** `#CBD5E1` (`slate-300`)
- **Muted Subtext & Metadata:** `#64748B` (`slate-500`)
- **Body Text:** `#334155` (`slate-700`)

---

### 3. Typography Hierarchy
The design system employs **Inter** (with system-ui fallback) for clean legibility across numeric data tables, paired with **JetBrains Mono** for codes, serial numbers, and financial hashes.

| Style Role | Font Family | Size | Weight | Line Height | Tracking | Usage Example |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Header** | Inter | 24px (1.5rem) | 700 Bold | 32px | -0.02em | Page Main Titles ("Projects Directory") |
| **Section Header** | Inter | 18px (1.125rem)| 600 SemiBold| 26px | -0.01em | Modal Titles, Card Section Headers |
| **Card / Widget Title**| Inter | 14px (0.875rem)| 600 SemiBold| 20px | Normal | KPI Card Labels ("kW Sold This Month") |
| **KPI Metric Value** | Inter | 28px (1.75rem) | 700 Bold | 34px | -0.02em | Monetary & Capacity Metrics (`₹41.2L`) |
| **Body Standard** | Inter | 14px (0.875rem)| 400 Regular | 20px | Normal | General form inputs, table body text |
| **Body Medium** | Inter | 14px (0.875rem)| 500 Medium | 20px | Normal | Interactive links, table primary cells |
| **Small Caption** | Inter | 12px (0.75rem) | 500 Medium | 16px | +0.01em | Status pills, breadcrumbs, timestamps |
| **Code / Serials** | JetBrains Mono| 13px (0.8125rem)| 500 Medium | 18px | Normal | `PRJ-26-0004`, `SLX550DCR-90182` |

---

### 4. Component Design Specifications

#### 4.1 Buttons & Interactive Controls
- **Primary CTA Button:**
  - Class: `h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`
  - Used for: "Record GRN", "Save & Approve BOM", "Submit Quotation".
- **Secondary Button:**
  - Class: `h-10 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-medium rounded-lg shadow-sm transition-all`
  - Used for: "Cancel", "Save Draft", "Export CSV".
- **WhatsApp Action Button:**
  - Class: `h-9 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold rounded-md shadow-sm inline-flex items-center gap-1.5`
  - Displays official WhatsApp icon; used for customer contact and PDF sharing.
- **Danger / Rejection Button:**
  - Class: `h-10 px-4 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-lg shadow-sm`
  - Used for: "Cancel Project", "Reject Quote".

#### 4.2 Form Inputs & Validation States
- **Standard Input Field:**
  - Class: `h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`
  - Stacked label: `text-xs font-semibold text-slate-600 mb-1 block`.
- **Validation Error State:**
  - Input border: `border-rose-500 focus:border-rose-500 focus:ring-rose-500`.
  - Inline error text: `text-xs text-rose-600 mt-1 flex items-center gap-1`.
- **Indian Currency Input Format:**
  - Left-affixed symbol: `₹` in slate-500 container.
  - Formatted display: Real-time lakh grouping (`₹ 2,21,100.00`).

#### 4.3 Data Tables
- **Container:** `bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm`.
- **Header:** `bg-slate-50/75 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider h-11 px-4`.
- **Rows:** `h-12 border-b border-slate-100 hover:bg-slate-50/50 transition-colors px-4 text-sm text-slate-700`.
- **Alignment:** Entity codes and customer names left-aligned; status pills centered; financial amounts right-aligned with monospace numerals.

#### 4.4 Status Badges & Pills
- **Base Class:** `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border`.
- **Renderings:**
  - *Completed / Done / Paid:* `bg-emerald-50 text-emerald-700 border-emerald-200`
  - *In Progress / Pending Approval:* `bg-amber-50 text-amber-700 border-amber-200`
  - *Delayed / Overdue / Stuck (>45d):* `bg-rose-50 text-rose-700 border-rose-200`
  - *Scheduled / Sent:* `bg-blue-50 text-blue-700 border-blue-200`

#### 4.5 Modals & Overlays
- **Backdrop:** `fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4`.
- **Modal Window:** `bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col`.
- **Header:** Sticky top header with title, subtitle, and close button (`✕`).
- **Footer:** Fixed bottom action bar with subtle top divider, holding `Cancel` and primary confirmation CTA.

---

### 5. Multi-Device Responsive Architecture

```
+-----------------------------------------------------------------------------------+
| DESKTOP VIEWPORT (>= 1280px)                                                      |
| [260px Persistent Sidebar] | [64px Header]                                        |
|                            | [Multi-column Data Cards & Full Tables]              |
+-----------------------------------------------------------------------------------+
| TABLET VIEWPORT (768px - 1279px)                                                  |
| [Icon-Collapsed Sidebar]   | [Header with Compact Search]                         |
|                            | [2-Column Grid / Horizontally Scrollable Tables]     |
+-----------------------------------------------------------------------------------+
| MOBILE VIEWPORT (< 768px) - Field PWA Mode                                        |
| [Hamburger / Slide Drawer] | [Top App Bar with Sync Status]                       |
| [Single Column Touch-Optimized Cards & Step Wizard Forms]                         |
| [Bottom Sticky Quick Action: "Take Photo / Scan Barcode"]                         |
+-----------------------------------------------------------------------------------+
```

#### 5.1 Desktop Architecture (>= 1280px)
- Persistent 260px left sidebar with nested sub-menus.
- Multi-column data layouts (e.g., 4-column KPI grid; 65/35 split lead detail).
- Full desktop keyboard shortcuts (`/` for search, `Esc` to close modals).

#### 5.2 Tablet Architecture (768px - 1279px)
- Sidebar collapses to slim 72px icon-only navigation bar (expands on hover/click).
- Grid cards reflow to 2 columns.
- Data tables maintain sticky first columns with smooth horizontal scroll for extended metrics.

#### 5.3 Mobile Architecture (< 768px) & PWA
- Off-canvas slide-out navigation drawer toggled via top-left hamburger menu.
- Critical field screens (Site Survey, Milestone Updates, GRN at Site) adopt mobile-first single-column stepper forms.
- Touch-friendly tap targets (minimum 44×44px).
- Bottom sticky Action Bar on mobile: `[Record GRN]`, `[Take Site Photo]`, `[Capture Signature]`.
- PWA offline status ribbon fixed to top when field connectivity drops.

---

### 6. Master Dashboard & Reporting Plan

#### 6.1 Executive Dashboard Tile Registry
Below is the definitive mapping of all **12 Dashboard Summary Tiles** specified in Section 14 of the specification, defining the data formula and the exact filtered list opened upon clicking:

| Tile No | Metric Display Title | Data Formula / Source | Visual Style / Badge | Target List Opened on Click |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **Leads This Month & Conversion %** | Total leads created this calendar month and % in `Won` status. | Neutral Card with trend % | Leads List filtered by `created_date = Current Month` |
| **02** | **kW Sold This Month** | $\sum \text{kWp}$ across all projects created from quotes accepted this month. | Amber Accent Card | Projects List filtered by `order_date = Current Month` |
| **03** | **Projects by Status (Delayed Count)** | Total active projects broken down by stage + count of delayed projects. | Red Warning Pill (`[Delayed: N]`) | Projects List filtered by `is_delayed = true` |
| **04** | **Receivables Split: Customer vs Bank**| Total unpaid customer instalments vs total unpaid bank loan tranches. | Dual Slate / Indigo Card | Receivables Overview filtered by `status != Paid` |
| **05** | **Collections This Month** | $\sum \text{Payment Receipts}$ recorded between 1st and end of current month. | Emerald Success Card | Payment Receipts Register for `Current Month` |
| **06** | **Payables Due This Week** | $\sum \text{Approved Vendor Bills}$ with due date $\le$ end of current week. | Slate / Rose Accent | Vendor Payables List filtered by `due_date <= EndOfWeek` |
| **07** | **Pending Deliveries** | Open PO lines where $\text{Ordered Qty} > \text{Received GRN Qty}$. | Amber Alert Badge | Pending Deliveries Report (PO vs GRN) |
| **08** | **Awaiting WCR / SO / Net Metering** | Projects where Milestone 6 is Done but Net Metering is not completed. | Blue Pipeline Card | Subsidy Pipeline filtered by `stage IN (WCR, SO, NetMeter)` |
| **09** | **Stuck Subsidies (>45 Days)** | Count of subsidy records in a single stage for $> 45$ consecutive days. | High-Alert Crimson Card | Subsidy List filtered by `is_stuck = true` |
| **10** | **Loans Awaiting Sanction / Tranche 2** | Loans in `Applied` status or Sanctioned waiting for Net Metering. | Amber Alert Badge | Bank Loans Pipeline filtered by `pending_action = true` |
| **11** | **Pending Subsidy Credit** | Projects where Net Metering is Done but Customer Subsidy Credit is unrecorded. | Slate Follow-up Card | "Pending Subsidy Credit" customer follow-up list |
| **12** | **Overdue Follow-ups Digest** | CRM leads assigned to user where `follow_up_date < Today` and status is open. | Rose Alert Pill | Leads List filtered by `is_overdue = true` |

---

#### 6.2 The Four Standard Report Categories & Specifications
Every report includes date-range filtering and instant export to **Microsoft Excel (.xlsx)** and **Adobe PDF (.pdf)**.

#### Category 1: Sales Intelligence Reports
1. **Lead Source Performance:** Tracks leads, conversion rate %, total kWp sold, and revenue generated per marketing source (Meta Ads, Google, Referrals, IndiaMART, Walk-ins).
2. **Salesperson Leaderboard:** Ranks sales executives by leads handled, average response time, conversion %, total kWp sold, and revenue generated.
3. **Pipeline Value by Stage:** Evaluates total pipeline financial value across `New`, `Contacted`, `Survey Scheduled`, `Quote Sent`, and `Negotiation`.
4. **Quote-to-Win Conversion Rate:** Tracks time-lag and percentage conversion from initial quote generation to accepted order.
5. **Lost Reasons Analysis:** Categorizes reasons for lost deals (Price High, Competitor Chosen, Roof Infeasible, Loan Rejected, Customer Dropped).
6. **kW Sold Matrix:** Multi-dimensional matrix reporting capacity sold broken down by Month, District (e.g., Jaipur, Ajmer), and System Size Band (1-3 kW, 3-5 kW, >5 kW).

#### Category 2: Operations & Execution Reports
1. **Project Ageing Report:** Measures total cycle time in days elapsed from order conversion to final commissioning across all projects.
2. **Milestone Bottleneck Tracker:** Calculates average days spent in each of the 7 installation milestones to pinpoint operational delays.
3. **Delayed Projects Register:** Comprehensive log of all projects exceeding milestone planned target dates with assigned PM and reason notes.
4. **Survey-to-Quote Conversion:** Measures turnaround time from site survey completion to initial quotation issuance.
5. **Material Variance by Project:** Compares quoted BOM quantities against actual received GRN quantities and leftover residues.

#### Category 3: Supply Chain & Procurement Reports
1. **Purchase Order Register:** Complete audit log of all POs issued with vendor name, project code, line totals, GST, and approval metadata.
2. **Vendor-Wise Purchase Spend:** Aggregates annual and monthly spend per supplier, highlighting Tier-1 module and inverter volumes.
3. **Pending Deliveries Report:** Item-level tracking of quantities ordered on POs versus quantities physically acknowledged at site via GRNs.
4. **Leftover Material Register:** Audit log of all unused materials recorded across projects, detailing transfers to other sites or vendor debit notes.
5. **Hardware Serial Number History:** Full traceability search tool identifying the exact project, customer, address, PO, and GRN associated with any panel or inverter serial string.

#### Category 4: Financial & Money Reports
1. **Receivables Ageing by Payer:** Classic ageing report (Current, 1-30, 31-60, 61-90, 90+ days) strictly bifurcated by payer: **Customer Margin** versus **Bank Loan Tranches**.
2. **Monthly Collections Register:** Comprehensive record of all payments received (`RCT-YY-NNNN`) by payment mode (Cash, UPI, NEFT, Cheque, Bank Disbursement).
3. **Subsidy Liaison Pipeline:** Real-time financial status of all active subsidy applications moving through WCR, Service Order, and Net-Metering stages.
4. **Bank Loan Pipeline Tracker:** Tracks requested versus sanctioned loan capital and schedules Tranche 1 and Tranche 2 inflows.
5. **Vendor Payables Ageing:** Accounts payable ageing schedule (0-30, 31-60, 61-90, 90+ days) tracking pending liabilities owed to vendors.
6. **GST Summary Report:** Pre-accounting tax report computing Output GST (from customer tax invoices) versus Input Tax Credit (from 3-way matched vendor bills).
7. **Project P&L Register:** Real-time profitability ledger per project:
   $$\text{Gross Margin (₹)} = \text{Contract Revenue} - (\text{Materials at PO Rate} + \text{Labor} + \text{Freight} + \text{Liaison} + \text{Misc})$$
   $$\text{Margin \%} = \frac{\text{Gross Margin (₹)}}{\text{Contract Revenue}} \times 100$$
