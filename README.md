# Spendwise AI — Complete AI-Powered Finance & Expense Management SaaS

**Take control of your money. Make smarter financial decisions.**

Spendwise AI is a full-stack financial intelligence application built for startups, freelancers, founders, and small businesses. It combines real-time multi-account ledger management, atomic double-entry reconciliations, category budgeting, scheduled recurring commitments, runway reserve tracking, and an AI financial assistant grounded in verified Firestore records.

---

## 🌟 Key Capabilities & Architecture

- **Precision Financial Accounting**: All figures are stored in integer minor units (paise for INR, cents for USD) to eliminate IEEE-754 floating-point inaccuracies.
- **Atomic Balance Reconciliation**: Transfers, edits, and deletions dynamically reconcile account balances and budget caps without double counting.
- **Conversational AI Assistant**: Server-side Google Gemini LLM API integration with fallback intelligence grounded strictly in verified balances, recurring burn, and budget caps. Never hallucinates fake balances.
- **Enterprise Multi-Tenancy**: Workspace isolation with Role-Based Access Control (Owner, Admin, Member, Viewer) backed by hardened Firestore Security Rules.
- **CSV Data Ingestion & Export**: Robust CSV import with mapping and preview, plus one-click CSV ledger export and print-friendly audit reports.
- **Multi-Currency & Indian English (Default)**: Native INR (₹) formatting with localized tabular numerals and customizable regional settings.
- **Instant Interactive Demo Mode**: Self-contained fictional workspace with 40+ realistic transactions spanning 6 months, active budgets, recurring schedules, and runway goals.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js `v20+` or `v22+`
- npm `10+`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/spendwise-ai.git
cd spendwise-ai

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the required credentials:
```env
# Public Firebase Client Config (Safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:...

# Server-Side Firebase Admin SDK (Private, Server-Only)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your_firebase_private_key_here

# AI Provider Configuration (Private, Gemini API Server-Side)
GEMINI_API_KEY=AIzaSy...
```

> **Note on Demo Mode**: If Firebase credentials are not yet configured in `.env.local`, Spendwise AI operates seamlessly in **Interactive Portfolio Demo Mode** with fully functional local state and zero setup friction.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🔒 Firebase Security Rules & Storage Deployment

The repository includes pre-configured production rules:
- `firestore.rules`: Workspace membership validation, role permissions (Owner/Admin/Member/Viewer), immutable audit logs.
- `storage.rules`: Strict file type limits (image/pdf) and 10MB size constraints for invoices/receipts.
- `firestore.indexes.json`: Composite indexes for complex transaction sorting and multi-field queries.

Deploy security rules using Firebase CLI:
```bash
firebase deploy --only firestore:rules,storage,firestore:indexes
```

---

## 📂 Application Directory Map

- `src/app/` — Next.js App Router pages:
  - `/` — High-converting fintech SaaS marketing landing page
  - `/pricing` — Multi-tier SaaS subscription plans
  - `/features` — Architectural capabilities overview
  - `/login`, `/signup`, `/forgot-password` — Authentication screens
  - `/onboarding` — Multi-step wizard (regional parameters & entity type)
  - `/dashboard` — KPI cards, Cash flow area charts, and expense donut breakdown
  - `/transactions` — Full ledger with filtering, pagination, CSV import & export
  - `/accounts` — Depository accounts, credit cards, and inter-account atomic transfers
  - `/budgets` — Spending caps with real-time threshold warnings (70%, 90%, 100%)
  - `/categories` — Expense and income cost-center management
  - `/recurring` — Automated subscription management and scheduler
  - `/goals` — Multi-month emergency runway reserve tracking
  - `/reports` — P&L statements, burn rate analysis, and printable audit reports
  - `/ai-assistant` — Conversational financial copilot
  - `/notifications` — Real-time in-app notification center
  - `/settings/*` — Profile, Workspace & RBAC, Billing, and Security
- `src/components/ui/` — Design system components (`Button`, `Card`, `Modal`, `Input`)
- `src/context/` — `AuthContext`, `FinanceContext`, and `ThemeContext`
- `src/lib/` — Currency conversion, minor-unit formatting, and demo fixtures
- `src/types/` — Strict TypeScript domain models
