# Solaris EPC – Solar ERP System (Phase 1)

A complete, production-grade, full-stack Enterprise Resource Planning (ERP) platform built specifically for rooftop solar EPC (Engineering, Procurement, and Construction) companies operating under India's **PM Surya Ghar: Muft Bijli Yojana** and commercial/industrial solar programmes.

Solaris EPC streamlines the entire lifecycle of solar projects—from lead acquisition and rooftop LIDAR/physical surveys to quotation generation, atomic order conversion, direct-to-site procurement, serial-number-verified site delivery (GRN), 7-stage installation milestone tracking, DISCOM net metering, government subsidy liaisoning, and triple-lock project closure with automated P&L locking.

---

## Table of Contents

1. [Architectural Overview](#architectural-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Core Business & Regulatory Integrity Rules](#core-business--regulatory-integrity-rules)
5. [Prerequisites](#prerequisites)
6. [Quick Start & Installation](#quick-start--installation)
7. [Environment Variables](#environment-variables)
8. [Database Seeding & Demo User Credentials](#database-seeding--demo-user-credentials)
9. [Automated Testing Suite](#automated-testing-suite)
10. [Comprehensive REST API Reference](#comprehensive-rest-api-reference)
11. [Module Workflow & Functional Highlights](#module-workflow--functional-highlights)
12. [Production Deployment Guidelines](#production-deployment-guidelines)
13. [External Integrations & Simulation Notes](#external-integrations--simulation-notes)

---

## 1. Architectural Overview

Solaris EPC adopts a decoupled, modern multi-tier architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   CLIENT TIER (React 18 + Vite)                        │
│  - Tailwind CSS UI with Solar EPC Theme (#163A5F Navy, #F4B740 Amber)  │
│  - React Router v6 Multi-Module Navigation (23 Functional Views)        │
│  - Centralized Axios API Client with JWT Interceptors & Error Toasts   │
│  - Dynamic Role-Based Access Control (RBAC) & Persona Switching        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / REST (JSON) + Bearer JWT
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   SERVER TIER (Node.js + Express.js)                   │
│  - Express RESTful API with Centralized Error Handling                 │
│  - JWT Authentication Middleware & Role Guard (requireRole)            │
│  - Atomic Business Logic Services:                                     │
│      * atomicConvertQuotationToOrder (Project + 7 Milestones + PRs)    │
│      * verifyAndRegisterSerials (System-wide uniqueness check)         │
│      * executeProjectClosure (Triple-Lock Receivables & Net Metering)  │
│      * Approval Threshold Routing (Discount > 5%, PO > ₹2,00,000)      │
│  - Gap-Free Sequential FY Numbering Engine (FY 2026-27 Format)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Mongoose ODM
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   DATA TIER (MongoDB Database)                         │
│  - 20 Relational-grade Mongoose Schemas with Referential Integrity     │
│  - Indexed Unique Serial Numbers, Quotations, and Projects             │
│  - Embedded Audit Trails, Milestone Timelines & Transaction Ledgers    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Project Structure

The project is organized into two completely separate folders inside one main project directory:

```text
epc/
├── frontend/                     # React 18 + Vite Client Application
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── components/           # Reusable UI & Layout Components
│   │   │   ├── common/           # Button, Modal, Card, StatusBadge, StatCard, etc.
│   │   │   └── layout/           # Sidebar, Navbar, Topbar, AppLayout
│   │   ├── context/              # React Context Providers
│   │   │   ├── AuthContext.jsx   # Real JWT Authentication & Role Switcher
│   │   │   └── ERPContext.jsx    # Real-time state management connected to backend
│   │   ├── pages/                # 23 Phase 1 Module Pages
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LeadsPage.jsx
│   │   │   ├── SurveysPage.jsx
│   │   │   ├── QuotationsPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   ├── MilestonesPage.jsx
│   │   │   ├── ProcurementPage.jsx
│   │   │   ├── GRNPage.jsx
│   │   │   ├── ProjectMaterialsPage.jsx
│   │   │   ├── SubsidyPage.jsx
│   │   │   ├── CustomerPaymentsPage.jsx
│   │   │   ├── BankLoansPage.jsx
│   │   │   ├── InvoicesReceiptsPage.jsx
│   │   │   ├── VendorBillsPage.jsx
│   │   │   ├── ProjectPnLPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── ApprovalsQueuePage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── services/             # Centralized API service client (Axios)
│   │   │   └── api.js
│   │   ├── utils/                # Formatting, calculations & Indian numbering
│   │   ├── App.jsx               # Route definitions
│   │   ├── main.jsx              # Application bootstrap
│   │   └── index.css             # Tailwind base styles
│   ├── .env.example              # Frontend environment template
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js        # Design system & color tokens
│   └── vite.config.js            # Vite configuration (port 3000)
│
├── backend/                      # Node.js + Express + MongoDB Server
│   ├── src/
│   │   ├── config/               # Environment & Database connections
│   │   │   ├── db.js             # Mongoose connection handler
│   │   │   └── env.js            # Dotenv configuration
│   │   ├── controllers/          # 14 Module Controllers
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── crmController.js
│   │   │   ├── surveyController.js
│   │   │   ├── quotationController.js
│   │   │   ├── projectController.js
│   │   │   ├── milestoneController.js
│   │   │   ├── procurementController.js
│   │   │   ├── grnController.js
│   │   │   ├── subsidyController.js
│   │   │   ├── financeController.js
│   │   │   ├── approvalController.js
│   │   │   ├── notificationController.js
│   │   │   └── settingController.js
│   │   ├── middleware/           # Auth, Roles & Error Handling
│   │   │   ├── auth.js           # JWT verifyToken & requireRole
│   │   │   └── errorHandler.js   # Centralized error handler
│   │   ├── models/               # 20 Mongoose Schemas
│   │   │   ├── User.js, Lead.js, SiteSurvey.js, BOMTemplate.js, Quotation.js
│   │   │   ├── Project.js, Milestone.js, Vendor.js, PurchaseRequisition.js
│   │   │   ├── PurchaseOrder.js, GRN.js, SerialNumber.js, ProjectMaterial.js
│   │   │   ├── LeftoverMaterial.js, Subsidy.js, WCR.js, ServiceOrder.js
│   │   │   ├── NetMetering.js, CustomerPayment.js, BankLoan.js, Invoice.js
│   │   │   ├── Receipt.js, VendorBill.js, ProjectPnL.js, Approval.js
│   │   │   ├── Notification.js, Setting.js
│   │   ├── routes/               # Express Router Definitions
│   │   ├── services/             # Core Business Logic & Invariant Engines
│   │   │   ├── projectService.js # Atomic Quotation->Order & Triple-Lock Closure
│   │   │   ├── serialService.js  # Global Serial Uniqueness Engine
│   │   │   └── approvalService.js# Discount & PO Threshold Router
│   │   ├── utils/                # Seed scripts & Sequential FY Numbering
│   │   │   ├── numbering.js      # PRJ-YY-NNNN, QT-YY-NNNN, PO-YY-NNNN, etc.
│   │   │   ├── seedData.js       # Complete Phase 1 master demo dataset
│   │   │   └── seed.js           # Database seeder execution script
│   │   ├── validators/           # Mobile, GSTIN, PAN, PIN, Net Cost validators
│   │   └── app.js                # Express app setup, CORS, routes & health check
│   ├── tests/                    # Backend Integration Test Suite
│   │   └── erp.test.js           # 15 Invariant & Integrity automated tests
│   ├── .env.example              # Backend environment template
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Entry point listening on port 5000
│
├── README.md                     # Master documentation (this file)
└── .gitignore                    # Root gitignore protecting secrets & builds
```

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18.3+ with Vite 6
- **Routing:** React Router DOM v6.22
- **Styling:** Tailwind CSS 3.4 with custom typography and Solar EPC color tokens
- **Icons:** Lucide React
- **Visualizations:** Recharts (Area charts, bar charts, and pie charts)
- **HTTP Client:** Axios with bearer authentication interceptors
- **Date Formatting:** date-fns

### Backend
- **Runtime:** Node.js (v18.0.0 or higher recommended)
- **Web Framework:** Express.js 4.19+
- **Database ODM:** Mongoose 8.3+
- **Security & Auth:** JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing, CORS
- **Validation:** Custom regulatory format validators (GSTIN checksum, Indian PAN, 10-digit mobile, PIN code)
- **Logger:** Morgan HTTP request logger

### Database
- **Database Engine:** MongoDB Community / Enterprise / Atlas (v6.0+)

---

## 4. Core Business & Regulatory Integrity Rules

Solaris EPC strictly enforces the operational and compliance mandates outlined in the Solar EPC specification:

1. **Zero-Warehouse Direct-to-Site Procurement Model:**
   The company holds no intermediate warehouse. All Purchase Orders (POs) require mandatory delivery to the customer's rooftop coordinates (`shippingAddress`). Materials are physically verified and entered into inventory at the customer site via Site Goods Receipt Note (GRN).
2. **Pre-Fabricated Structure Installation:**
   No in-house steel fabrication occurs on site. Standardized pre-fabricated, hot-dip galvanized mounting structures (elevated or flush) are procured directly from certified structural vendors.
3. **PM Surya Ghar DBT Subsidy Isolation:**
   Central Government financial assistance (Direct Benefit Transfer) is credited directly to the customer's personal bank account by the Ministry of New & Renewable Energy (MNRE). **It is completely excluded from company revenue and accounts receivables.** The project closure engine forbids treating subsidy receipt as a company payment condition.
4. **Global Serial Number Uniqueness Engine:**
   Every solar module, grid-tie inverter, and battery serial number captured during Site GRN is indexed in a centralized registry. The system throws a regulatory violation error if an attempt is made to reuse a serial number across different projects.
5. **Milestone Sequence Gating & Physical Dependency:**
   Seven installation milestones must proceed sequentially:
   - *Milestone 1:* Site Preparation & Civil Work
   - *Milestone 2:* Structure Installation — **Strictly gated:** Blocked until Site GRN is completed and materials are verified on site.
   - *Milestone 3:* Module Mounting
   - *Milestone 4:* Electrical Wiring & Inverter Setup
   - *Milestone 5:* Testing & Commissioning
   - *Milestone 6:* Work Completion Report (WCR) & Joint Inspection — Unlocks final commercial GST invoice generation.
   - *Milestone 7:* DISCOM Net Metering & Bi-directional Meter Sync — Unlocks second tranche of customer bank loan.
6. **Triple-Lock Project Closure Engine:**
   A project can be formally marked as `Closed` if and only if three locks are satisfied simultaneously:
   - **Lock 1 (Financial Integrity):** Total customer and bank dues must equal exactly ₹0.00.
   - **Lock 2 (Statutory Compliance):** DISCOM Net Metering must have status `Installed & Synchronized`.
   - **Lock 3 (Role Authorization):** The initiating user must possess the `Owner / Admin` role.
   - *Post-Closure Action:* The project's Profit & Loss (P&L) ledger is locked permanently against further alterations.
7. **Multi-Level Approval Thresholds:**
   - Quotations with discounts $> 5.0\%$ are placed in `Pending Approval` and route to the Owner Approvals Queue.
   - Purchase Orders with value $> ₹2,00,000$ require explicit Owner/Admin sign-off prior to vendor dispatch.
8. **Two-Tranche Bank Loan Tracking:**
   Tracks nationalized bank loan disbursements (Tranche 1 upon structural completion; Tranche 2 post net-meter synchronization) with automated alerts if disbursement exceeds 21 days.

---

## 5. Prerequisites

Before running Solaris EPC, ensure you have the following installed on your machine:

1. **Node.js:** v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
2. **npm:** v9.0.0 or higher (packaged with Node.js)
3. **MongoDB:** v6.0.0 or higher running locally on default port `27017` or a remote MongoDB Atlas connection URI ([Download MongoDB Community](https://www.mongodb.com/try/download/community))

Check your versions:
```bash
node -v
npm -v
mongod --version
```

---

## 6. Quick Start & Installation

Clone or navigate to the project directory:
```bash
cd /Users/navgurukul/Desktop/epc
```

### Step 1: Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
4. Verify the MongoDB daemon is active on port `27017`.
5. Seed the database with Phase 1 master data and demo accounts:
   ```bash
   npm run seed
   ```
6. Start the backend API server:
   ```bash
   npm start
   # Server will start on http://localhost:5000
   ```

### Step 2: Frontend Setup

Open a new terminal window:

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file:
   ```bash
   cp .env.example .env
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   # Vite dev server will start on http://localhost:3000
   ```
5. Open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 7. Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port for Express REST API server |
| `NODE_ENV` | `development` | Runtime environment (`development` / `production`) |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/solaris_epc` | Connection string for MongoDB |
| `JWT_SECRET` | `solaris_epc_super_secure_jwt_secret_phase_1_2026` | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | Token expiry duration |
| `CLIENT_URL` | `http://localhost:3000` | Allowed CORS origin for frontend client |

### Frontend Configuration (`frontend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Base URL for backend REST API endpoints |

---

## 8. Database Seeding & Demo User Credentials

The database seeder populates realistic operational data for 6 solar projects (residential PM Surya Ghar 3kW/5kW, commercial 25kW, and industrial 50kW), 7 installation milestones each, procurement records, serial numbers, subsidy files, and accounting ledgers.

All demo user accounts share the default password: **`password123`**

| Full Name | Email Address | Assigned Role(s) | Operational Scope |
| :--- | :--- | :--- | :--- |
| **Ashok Sharma** | `ashok@solarisepc.in` | **Owner / Admin** | Complete system authority, Discount approvals, PO approvals, Triple-lock project closure |
| **Rahul Verma** | `rahul@solarisepc.in` | **Sales Executive** | Lead nurturing, CRM, customer quotation generation, advance payment tracking |
| **Amit Patel** | `amit@solarisepc.in` | **Survey Engineer** *(+ Sales)* | Technical rooftop surveys, shadow analysis, structure type selection, photo uploads |
| **Vikram Singh** | `vikram@solarisepc.in` | **Project Manager** | Execution oversight, Site GRN verification, 7 milestone updates, WCR sign-off |
| **Suresh Kumar** | `suresh@solarisepc.in` | **Purchase** | Vendor selection, Purchase Orders, direct-to-site dispatch, leftover transfers |
| **Priya Nair** | `priya@solarisepc.in` | **Accounts** | Customer invoicing, receipt recording, vendor bills, bank loan tranches, P&L audit |
| **Manoj Joshi** | `manoj@solarisepc.in` | **Liaison (Subsidy)** | DISCOM portal filing, Net Metering coordination, meter synchronization, PM Surya Ghar DBT |

> **Persona Switcher:** In the top header bar of the frontend application, click the **User Persona** dropdown to instantly switch between roles and observe real-time permission adaptations and action restrictions!

---

## 9. Automated Testing Suite

The backend includes an integration test suite validating business rules, database invariants, and regulatory compliance.

To execute the test suite:
```bash
cd backend
npm test
```

### Test Coverage Highlights (15 Tests)
1. **User Authentication & RBAC:**
   - Password encryption with bcrypt.
   - Owner/Admin role authorization.
   - Multi-role support (e.g., Survey Engineer who also holds Sales permissions).
2. **CRM & Lead Validation:**
   - Mobile number validation (10 digits).
   - Duplicate mobile number rejection.
3. **Serial Number Regulatory Engine:**
   - Global serial number registration.
   - System-wide duplicate serial number rejection across projects.
4. **Atomic Project Order Conversion:**
   - Transactional conversion from approved quotation to active project.
   - Automatic calculation of balance due based on advance receipt.
   - Atomic generation of all 7 sequential installation milestones with Milestone 1 `In Progress` and Milestone 2 `Pending`.
5. **Triple-Lock Project Closure Verification:**
   - Blocked when customer balance due $> ₹0.00$ (Lock 1).
   - Blocked when non-admin user attempts closure (Lock 3).
   - Permanent locking of Project P&L record upon verified closure.

---

## 10. Comprehensive REST API Reference

All backend endpoints are prefixed with `/api`. Protected routes require an `Authorization: Bearer <token>` header.

### 1. Authentication & Users (`/api/auth`)
- `POST /api/auth/login` — Authenticate user with email and password; returns JWT token and profile.
- `GET /api/auth/me` — Retrieve current authenticated user profile.
- `GET /api/auth/users` — List all registered team members and roles.

### 2. Dashboard & Analytics (`/api/dashboard`)
- `GET /api/dashboard/stats` — High-level KPI summary (Active Projects, Pipeline Capacity kWp, Total Revenue, Receivables, Average Profit Margin).
- `GET /api/dashboard/charts` — Aggregated time-series data for Monthly Revenue, Project Status distribution, Milestone breakdown, and Pipeline funnel.

### 3. CRM & Lead Management (`/api/leads`)
- `GET /api/leads` — List leads with search, status filters, and pagination.
- `POST /api/leads` — Create new lead (validates 10-digit mobile, detects duplicates, calculates proposed system size).
- `GET /api/leads/:id` — Retrieve lead details, timeline, and linked surveys/quotations.
- `PUT /api/leads/:id` — Update lead status and details.

### 4. Site Surveys (`/api/surveys`)
- `GET /api/surveys` — List site survey records.
- `POST /api/surveys` — Create technical site survey (shadow analysis, rooftop dimensions, structure type, DISCOM details).
- `GET /api/surveys/:id` — View full survey record including verified rooftop proof photos.

### 5. Quotations & System Design (`/api/quotations`)
- `GET /api/quotations` — List quotations with revision history (`-R1`, `-R2`).
- `POST /api/quotations` — Generate quotation with auto-calculated GST, subsidy, and milestone payment schedule. Automatically routes to Owner Queue if discount $> 5\%$.
- `POST /api/quotations/:id/convert-to-order` — Atomically convert accepted quotation into an active Project with Milestones and PRs.
- `GET /api/quotations/bom-templates` — Fetch standard Bill of Materials (BOM) templates (3kW, 5kW, 10kW, 25kW, 50kW).

### 6. Projects Management (`/api/projects`)
- `GET /api/projects` — List active, completed, and closed projects with capacity and financial health.
- `GET /api/projects/:id` — Detailed project dashboard (milestones, materials, financial ledger, subsidy status).
- `POST /api/projects/:id/close` — Execute Triple-Lock project closure (validates receivables, net metering, admin role).

### 7. Installation Milestones (`/api/milestones`)
- `GET /api/milestones` — List milestones filtered by project (`?projectId=...`).
- `PUT /api/milestones/:id` — Update milestone progress. Enforces sequential completion; gates Milestone 2 until Site GRN is complete.

### 8. Procurement, Vendors & Materials (`/api/procurement`)
- `GET /api/procurement/vendors` — List registered vendors with GSTIN and ratings.
- `POST /api/procurement/vendors` — Register new vendor with GSTIN format validation.
- `GET /api/procurement/purchase-requisitions` — List PRs generated from project BOMs.
- `GET /api/procurement/purchase-orders` — List POs. Flags orders $> ₹2,00,000$ as requiring approval.
- `POST /api/procurement/purchase-orders` — Create PO with direct-to-site rooftop delivery address.
- `GET /api/procurement/materials` — View site inventory and allocated materials per project.
- `GET /api/procurement/leftovers` — View surplus materials reported post-installation.
- `POST /api/procurement/leftovers/:id/transfer` — Transfer leftover materials to another active project.

### 9. Site Goods Receipt Note (GRN) & Serials (`/api/grn`)
- `GET /api/grn` — List Site GRNs with physical delivery verification status.
- `POST /api/grn` — Record rooftop GRN, upload delivery challan photo, and register unique module/inverter serial numbers.
- `POST /api/grn/:id/reverse` — Reverse GRN in case of supplier dispatch error or damaged delivery.

### 10. Subsidy, WCR & DISCOM Net Metering (`/api/subsidy`)
- `GET /api/subsidy` — Track PM Surya Ghar DBT application pipeline and stages.
- `PUT /api/subsidy/:id` — Update subsidy application status and reference numbers.
- `GET /api/subsidy/wcr` — List Work Completion Reports.
- `POST /api/subsidy/wcr` — Generate WCR post-Milestone 5 commissioning.
- `GET /api/subsidy/net-metering` — Track DISCOM net meter application, testing, and bi-directional meter installation.

### 11. Finance, Invoices, Bank Loans & P&L (`/api/finance`)
- `GET /api/finance/payments` — Customer payment records and stage milestones.
- `POST /api/finance/payments` — Record customer payment with automatic receipt generation.
- `GET /api/finance/invoices` — List tax invoices (Advance, Milestone, Final GST Invoice).
- `POST /api/finance/invoices` — Generate GST-compliant invoice with FY numbering (`INV/26-27/NNNN`).
- `GET /api/finance/receipts` — List payment receipts (`RCT-26-NNNN`).
- `GET /api/finance/bank-loans` — Nationalized bank loan tranches (Sanction, Tranche 1, Tranche 2).
- `GET /api/finance/vendor-bills` — Vendor bills matched with POs and GRNs.
- `GET /api/finance/pnl` — Real-time project cost accounting, gross margin, and net profit ledger.

### 12. Approvals Queue (`/api/approvals`)
- `GET /api/approvals` — List pending approvals for discounts, high-value POs, and BOM variances.
- `POST /api/approvals/:id/decide` — Approve or reject pending request (Owner / Admin only).

### 13. System Notifications (`/api/notifications`)
- `GET /api/notifications` — Retrieve actionable user notifications and statutory alerts.
- `PUT /api/notifications/:id/read` — Mark notification as acknowledged.
- `POST /api/notifications/mark-read` — Mark all alerts as read.

### 14. Company Settings & System Masters (`/api/settings`)
- `GET /api/settings` — Get company profile, GSTIN, DISCOM master list, and approval thresholds.
- `PUT /api/settings/thresholds` — Update discount approval threshold (default 5%) and PO threshold (default ₹2,00,000).

---

## 11. Module Workflow & Functional Highlights

Solaris EPC provides an end-to-end solar business workflow:

```
[1. Lead Captured] ──> [2. Rooftop Site Survey] ──> [3. System Design & BOM]
                                                            │
                                                            ▼
[5. Atomic Order Conversion] <── [4. Quotation Approved & Advance Paid]
         │
         ├──> Generates Project Record (PRJ-26-XXXX)
         ├──> Initializes 7 Sequential Milestones (M1 In Progress)
         ├──> Spawns Direct-to-Site Purchase Requisitions (PR)
         └──> Creates Subsidy Application & Advance Receipt
         │
         ▼
[6. Direct-to-Site PO Dispatched] ──> [7. Rooftop Site GRN & Serial Scan]
                                                   │
                                                   ▼ (Unlocks M2)
[9. Commissioning & WCR] <── [8. Milestone Execution (M2 -> M5)]
         │
         ├──> Milestone 6: Final GST Invoice Generated
         └──> Milestone 7: DISCOM Net Meter Sync & Loan Tranche 2
         │
         ▼
[10. Triple-Lock Project Closure] ──> [11. P&L Locked & Archived]
```

---

## 12. Production Deployment Guidelines

### Frontend Deployment

#### Option A: Vercel / Netlify
1. Connect your Git repository to Vercel or Netlify.
2. Set **Root Directory** to `frontend`.
3. Set **Build Command** to `npm run build`.
4. Set **Output Directory** to `dist`.
5. Configure Environment Variable:
   - `VITE_API_BASE_URL`: `https://api.yourdomain.com/api`

#### Option B: Nginx Web Server
Build the production bundle:
```bash
cd frontend
npm run build
```
Copy the contents of `frontend/dist/` to your web root (e.g., `/var/www/solaris-epc/`). Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name solaris.yourdomain.com;

    root /var/www/solaris-epc;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Backend Deployment

#### Option A: PM2 Process Manager (Ubuntu / Debian Linux)
1. Install PM2 globally:
   ```bash
   npm install -g pm2
   ```
2. Navigate to backend:
   ```bash
   cd backend
   npm install --production
   ```
3. Create your production `.env` pointing to MongoDB Atlas or local secured instance.
4. Start with PM2:
   ```bash
   pm2 start server.js --name "solaris-backend"
   pm2 startup
   pm2 save
   ```

#### Option B: Docker Containerization
Create a `Dockerfile` in `backend/`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

---

## 13. External Integrations & Simulation Notes

Solaris EPC integrates cleanly with essential third-party services. In Phase 1, external network dependencies are implemented with production-ready fallback adapters:

1. **WhatsApp Messaging:**
   Generates pre-formatted `https://wa.me/` direct dispatch links enabling sales executives and project managers to send quotations and milestone progress alerts to customers directly from web or mobile without requiring costly paid BSP APIs during Phase 1.
2. **Site Photo Capture & Inspection Proofs:**
   Uses standard HTML5 media capture (`<input type="file" accept="image/*" capture="environment">`) allowing site survey engineers and site technicians to snap real-time photos directly from mobile phone cameras on rooftop sites.
3. **Banking & Loan Disbursement Simulator:**
   Simulates nationalized bank loan validation and disbursement callbacks, testing Tranche 1 and Tranche 2 workflows with realistic verification delays.

---

## License & Intellectual Property

Copyright © 2026 Solaris EPC. All rights reserved.
Developed for rooftop solar contractors, installers, and project developers in India.
