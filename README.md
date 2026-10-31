# 🏛️ DigitalWelfare | Public Welfare & Direct Subsidy Portal

> **A Next.js 16 citizen-centric portal helping every Indian citizen discover, verify eligibility for, and claim central and state government welfare schemes in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloud Datastore](https://img.shields.io/badge/Cloud_Database-NoSQL_Firestore-FFA611?style=flat-square)](https://cloud.google.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable_%26_Offline_Ready-purple?style=flat-square)](https://web.dev/progressive-web-apps/)
[![Security Audited](https://img.shields.io/badge/Security-20--Point_Hardened-10b981?style=flat-square)](https://github.com/)

---

## 📋 Table of Contents
- [The Problem & Vision](#-the-problem--vision)
- [Key Features](#-key-features)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Scheme Coverage & Benefits](#-scheme-coverage--benefits)
- [Technology Stack](#-technology-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Admin Panel Management & Operational Guide](#-admin-panel-management--operational-guide)
- [20-Point Security & Hardening Architecture](#-20-point-security--hardening-architecture)
- [Deployment Guide (Vercel & Cloud)](#-deployment-guide-vercel--cloud)
- [NPM Scripts Reference](#-npm-scripts-reference)
- [Contributing & Community](#-contributing--community)

---

## 🎯 The Problem & Vision

In India, central ministries and state governments allocate hundreds of thousands of crores annually to direct benefit transfer (DBT), education scholarships, farmer assistance, health security, and social safety nets. 

Despite these resources, **millions of eligible families miss out** due to friction:
1. **Information Fragmentation:** Schemes are scattered across 50+ central portals and state systems (MahaDBT, MP-SIMS, MahaSwayam, BOCW).
2. **Complex Gazettes:** Eligibility rules are buried in lengthy legal resolutions, leaving citizens unsure if their age, income ceiling, or category qualifies.
3. **The "Missing Document" Trap:** Citizens travel miles to Common Service Centres (CSC) or Setu kiosks only to discover they lack specific proofs (e.g., 7/12 extract, Tehsildar income certificate, caste validity).
4. **Offline Barriers:** Poor internet connectivity in rural districts creates failure points when loading dynamic web applications.

**DigitalWelfare** resolves these challenges through a unified, mobile-first Progressive Web Application with instant rule evaluation, tailored document checklists, printable CSC facilitation dossiers, and zero-downtime offline fallbacks.

---

## ✨ Key Features

### 1. 🔍 Fast Scheme Catalog & Discovery (`/schemes`)
- **Stale-While-Revalidate (SWR) Caching:** Schemas load in `< 5ms` from in-memory cache while background validation keeps data fresh.
- **Dynamic Category & State Filters:** Instantly slice schemes across Agriculture, Higher Education, Health, Women & Child, Social Justice, and Skills.
- **Bookmark & Save Schemes:** Synchronized client-side bookmarking across browser tabs via storage listeners.
- **Dedicated Loading Skeletons:** Zero cumulative layout shift (CLS) with route-isolated loading states.

### 2. ⚡ Instant Eligibility Engine (`/eligibility-check`)
- Multi-parameter dynamic matching: Age, Gender, Annual Family Income, Social Category (SC/ST/OBC/General), Occupation, and State.
- Calculates **Total Annual Financial Entitlement** (e.g., ₹18,000/yr for *Majhi Ladki Bahin*, ₹12,000/yr for *PM-KISAN + Namo Shetkari*, ₹5 Lakh *Universal MJPJAY / PM-JAY* cashless health cover).
- Identifies missing criteria with actionable steps to qualify.

### 3. 📄 Standardized CSC / Setu Facilitation Dossier (Print & PDF)
- One-click print format standardized to fixed **A4 dimensions (186mm printable body)**.
- Eliminates responsive layout collapsing on mobile and desktop printing.
- Features formal Directorate mastheads, barcoded verification seals, citizen declaration blocks, and structured document checklists ready for kiosk operator handover.

### 4. ⚖️ 3-Way Scheme Comparator (`/compare`)
- Compare up to 3 schemes side-by-side.
- Contrasts monetary entitlements, income thresholds, eligible age brackets, and mandatory documentation.
- Export or print clean comparative audit sheets.

### 5. 🔔 Scheme Alert Subscriptions (`/api/subscribe-alerts`)
- Citizens subscribe to personalized scheme launch and deadline alerts via WhatsApp, SMS, or Email.
- Captures category and state preferences with automated server validation and rate-limiting.

### 6. 📱 Progressive Web App (PWA) & Offline Resilience
- Fully installable on Android, iOS, Windows, and macOS (`manifest.json`).
- Service worker (`public/sw.js`) provides offline caching and graceful fallback to offline catalogs (`lib/fallback-schemes.ts`).

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Sources [1. Government Data Sources]
        MahaDBT["MahaDBT Portal (Aaple Sarkar)"]
        MPSIMS["MP-SIMS (Scheme Catalog)"]
        MahaSwayam["MahaSwayam (Skill & Employment)"]
        CentralGazettes["Central Ministry Feeds & Gazettes"]
    end

    subgraph Pipeline [2. Intelligence & Ingestion Pipeline]
        Harvester["Data Harvester / Cheerio Scraper"]
        Validator["Data Sanitizer & Dead Link Filter"]
        Normalizer["Marathi / Hindi Translator & Categorizer"]
        RuleExtractor["Rule Engine (Age, Income, Gender, Category)"]
        BenefitExtractor["Entitlement Valuation (DBT & Subsidies)"]
        DocExtractor["Smart Document Checklist Builder"]
    end

    subgraph Datastore [3. Storage & Resilience]
        Firestore[("Cloud Firestore<br/>(schemes, scheme_subscribers)")]
        LocalCatalog[("Offline Fallback Catalog<br/>(lib/fallback-schemes.ts)")]
        SWCache[("Service Worker Cache<br/>(Offline Assets)")]
    end

    subgraph WebApp [4. Citizen Presentation Layer]
        CatalogUI["Scheme Directory (/schemes)"]
        DetailUI["Scheme Detail View (/schemes/[id])"]
        EngineUI["Eligibility Evaluator (/eligibility-check)"]
        CompareUI["Scheme Comparator (/compare)"]
        PrintDossier["Standardized A4 Print Dossier"]
        AdminUI["Protected Admin Control Center (/admin)"]
    end

    Sources --> Harvester --> Validator --> Normalizer
    Normalizer --> RuleExtractor & BenefitExtractor & DocExtractor
    RuleExtractor & BenefitExtractor & DocExtractor --> Firestore
    Firestore -.-> LocalCatalog
    Firestore --> CatalogUI & DetailUI & EngineUI & CompareUI
    EngineUI --> PrintDossier
    AdminUI --> Firestore
```

---

## 📊 Scheme Coverage & Benefits

DigitalWelfare indexes active government welfare programs across central and state departments:

| Department | Highlight Schemes | Target Audience | Key Benefit |
| :--- | :--- | :--- | :--- |
| **Higher & Technical Education** | Rajarshi Shahu Maharaj Fee Waiver, Panjabrao Deshmukh Hostel Allowance | College & Engineering Students | 50% Tuition Waiver + up to ₹30,000/yr Hostel Aid |
| **Social Justice & Assistance** | SC Post-Matric Scholarship, SC Freeship, Swadhar Yojana, Sanjay Gandhi Niradhar | SC Students, Seniors, Destitute | 100% Tuition Fees + ₹51,000/yr Hostel DBT + Pensions |
| **Tribal Development (TDD)** | ST Post-Matric Scholarship, Swayam Yojana, Birsa Munda Krishi Kranti | Scheduled Tribes (ST) | 100% Tuition Waiver + ₹51,000/yr DBT + Farm Subsidies |
| **OBC, VJNT & SBC Welfare** | Post-Matric Scholarship, Savitribai Phule Aadhaar, Modi Awas Gharkul | OBC, VJNT, SBC Citizens | Tuition Reimbursement + ₹60,000/yr Hostel + Housing |
| **Agriculture & Farmers** | Namo Shetkari Samman Nidhi, Baliraja Free Power, Magel Tyala Solar Pump | Farmers & Landowners | ₹6,000/yr State DBT + 100% Free Farm Power + Solar Pumps |
| **Women & Child Welfare** | Mukhyamantri Majhi Ladki Bahin Yojana, Lek Ladki Yojana, Annapurna Free LPG | Women & Girl Children | ₹1,500/month DBT + ₹1.01L girl-child aid + 3 Free Gas Refills/yr |
| **Youth & Employment** | CM Yuva Karya Prashikshan Yojana, MAPS Apprenticeships, Annasaheb Patil Loans | Youth & Job Seekers | ₹6,000–₹10,000/mo Internship Stipend + Interest-Free Loans |
| **Public Health** | Mahatma Jyotirao Phule Jan Arogya Yojana (Universal MJPJAY / PM-JAY) | All Citizens | ₹5,00,000/year Cashless Hospital Care across 1,000+ Hospitals |
| **Labour & Construction (BOCW)** | Bandhkam Kamgar Welfare, Education & Marriage Grants, Atal Aahar | Construction Workers | Safety Kits + ₹5k–₹1L Grants + ₹5 Hot Meals |
| **Divyang & Senior Welfare** | Motorized Tricycles, Laptop Kits, CM Vayoshree Yojana | PwD & Seniors (65+) | Free Assistive Devices + ₹3,000 Direct Aid |

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Framework** | [Next.js (App Router)](https://nextjs.org/) | `16.3.1` | React Server Components, Route Groups, API Routes, Streaming |
| **Frontend Runtime** | [React](https://react.dev/) | `19.2.8` | Modern concurrent primitives, Suspense boundaries, hooks |
| **Styling Engine** | [Tailwind CSS](https://tailwindcss.com/) | `v4.x` | Modern CSS layer architecture, responsive styles, print media rules |
| **Database** | [Cloud NoSQL Datastore (Firestore)](https://cloud.google.com/) | `12.x` | Real-time cloud NoSQL document store with indexed queries |
| **Server Admin** | Cloud Server Admin SDK | `13.x` | Privileged batch writes and secure backend operations |
| **Web Scraping** | [Cheerio](https://cheerio.js.org/) | `1.0.0` | Server-side parsing of government HTML bulletins and portals |
| **Vector Icons** | [Lucide React](https://lucide.dev/) | `^1.16.0` | Accessible iconography for accessibility and responsive layouts |
| **PWA & Offline** | Web App Manifest & Service Workers | Native | Mobile home screen installation and zero-downtime offline cache |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `5.x` | Strict type definitions and safe data transformations |

---

## 📂 Project Directory Structure

```
digital-welfare/
├── app/
│   ├── (public)/                       # Public routes
│   │   ├── compare/                    # 3-Way scheme comparison matrix
│   │   ├── eligibility-check/          # Eligibility calculator & CSC printable dossier
│   │   ├── login/                      # Citizen login / sign-in screen
│   │   └── page.tsx                    # Landing hero, scheme directory highlights
│   ├── admin/                          # Secure Admin Control Center
│   │   └── page.tsx                    # Dashboard, Scheme Editor, Pipeline Trigger, Subscriber List
│   ├── api/                            # Backend API Endpoints (Protected & Public)
│   │   ├── admin/auth/                 # Rate-limited timing-safe admin verification
│   │   ├── schemes/                    # Scheme retrieval, creation, and bulk deletion
│   │   ├── subscribe-alerts/           # Scheme alert subscription management
│   │   └── sync-schemes/               # 10-stage automated pipeline sync
│   ├── schemes/
│   │   ├── (catalog)/                  # Route group for schemes directory with isolated skeleton
│   │   │   ├── loading.tsx             # Directory-specific grid skeleton
│   │   │   └── page.tsx                # Filterable schemes catalog
│   │   └── [id]/                       # Individual scheme detail page
│   │       ├── loading.tsx             # Detail-specific article skeleton
│   │       └── page.tsx                # Comprehensive scheme breakdown & application guide
│   ├── globals.css                     # Tailwind v4 setup & @media print A4 dimensions
│   └── layout.tsx                      # Root layout, Navbar, and PWA registration
│
├── components/                         # Modular React Components
│   ├── Navbar.tsx                      # Responsive top header & navigation
│   ├── PWARegister.tsx                 # Service worker initializer & install prompt
│   ├── SchemeAlertModal.tsx            # Alert modal for citizen notifications
│   ├── SchemeCard.tsx                  # Standard scheme card with benefit badges
│   ├── SchemeDetailView.tsx            # Detail view with government seals & document checklist
│   ├── SchemeList.tsx                  # Client search, category filter, pagination, bookmarking
│   └── SchemeSkeleton.tsx              # Pulse skeleton placeholders
│
├── lib/                                # Core Services & Security Helpers
│   ├── admin-auth.ts                   # Constant-time crypto verification for admin keys
│   ├── client-store.ts                 # Synced external stores with 2-hour session expiry
│   ├── fallback-schemes.ts             # 25+ curated schemes for zero-downtime offline fallback
│   ├── firebase.ts                     # Client Firebase initialization
│   ├── firebase-admin.ts               # Privileged server-side Cloud Server Admin SDK helper
│   ├── rate-limiter.ts                 # Sliding-window rate-limiter for endpoints
│   ├── schemes-service.ts              # SWR scheme fetching and caching service
│   └── pipeline/                       # 10-Stage Data Processing Pipeline
│       ├── benefit-extractor.ts        # Computes monetary benefit amounts
│       ├── doc-extractor.ts            # Builds mandatory document checklists
│       ├── mahadbt-catalog.ts          # Catalog entries for state portals
│       ├── normalizer.ts               # Devanagari translation & category classification
│       ├── pipeline.ts                 # Pipeline orchestrator
│       ├── rule-extractor.ts           # Dynamic age, income, category rule parser
│       └── validator.ts                # Sanitizes input strings and drops duplicates
│
├── public/                             # Static Assets
│   ├── manifest.json                   # Web app manifest
│   ├── sw.js                           # Offline service worker
│   └── icons/                          # Application icon assets
│
├── firestore.indexes.json              # Composite index declarations
├── firestore.rules                     # Declarative database security rules
├── next.config.ts                      # Security headers & Next.js configuration
└── package.json                        # Project dependencies and operational scripts
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js**: `v18.17.0+` or `v20.x+` ([Download Node.js](https://nodejs.org/))
- **NPM**: `v9.x+` or `v10.x+`
- **Cloud Database Project**: An active cloud project with **Firestore** and Authentication enabled.

### 2. Clone & Install
```bash
git clone https://github.com/PrashantJaybhaye/Digital-Welfare.git
cd Digital-Welfare
npm install
```

### 3. Configure Environment Variables
Create `.env.local` in the project root:

```env
# -------------------------------------------------------------
# Cloud Client SDK Configuration (Safe for Browser)
# -------------------------------------------------------------
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# -------------------------------------------------------------
# Admin Master Passcode (Server Only - Never prefix with NEXT_PUBLIC_)
# -------------------------------------------------------------
ADMIN_SECRET=your_custom_strong_admin_passcode

# -------------------------------------------------------------
# Cloud Admin SDK Credentials (Privileged Server Runtimes)
# -------------------------------------------------------------
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

> **Zero-Configuration Offline Mode:** If cloud credentials are not immediately configured, the application automatically mounts its curated offline catalog (`lib/fallback-schemes.ts`), enabling instant local UI testing.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Admin Panel Management & Operational Guide

The Admin Control Center (`/admin`) provides full lifecycle management of the welfare scheme repository, synchronization pipelines, and citizen alert subscriptions.

### Accessing the Admin Panel
1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin).
2. Enter the secret access key configured in your `ADMIN_SECRET` environment variable.
3. Upon successful constant-time authentication:
   - An active administrative session is stored in `sessionStorage`.
   - The session **automatically expires after 2 hours** to protect shared workstations.
   - All subsequent mutating requests send the verified `x-admin-key` header to privileged API routes.

```
┌────────────────────────────────────────────────────────┐
│               DigitalWelfare Admin Gateway              │
├────────────────────────────────────────────────────────┤
│ [ 🔒 Enter Master Admin Access Key ]                   │
│                                                        │
│ [ Unlock Admin Operations ]                            │
│                                                        │
│ 🛡️ Protected Gateway: Authenticate with ADMIN_SECRET.   │
│    Sessions expire automatically after 2 hours.        │
└────────────────────────────────────────────────────────┘
```

### Core Administrative Capabilities
| Section | Action | Description |
| :--- | :--- | :--- |
| **System Overview** | Health & Metric Monitoring | Real-time counts of total schemes, categories, and registered notification subscribers. |
| **Scheme Manager** | Search, Inspect & Delete | Search active database entries, inspect criteria, or perform bulk deletions with single-click confirmation. |
| **Scheme Authoring** | Create & Publish Scheme | Add new central or state schemes with guided inputs for eligibility, benefits, and required documents. |
| **Live Sync Pipeline** | Trigger Harvester | Trigger the 10-stage automated ingestion pipeline that re-scrapes government portals, standardizes data, and updates Firestore. |
| **Subscriber Manager**| Review Alerts | Inspect citizen alert subscriptions segmented by state, interest category, and channel (WhatsApp, SMS, Email). |

### Security Architecture of the Admin Panel
- **Blind Credential Input:** Passcode fields enforce blind masking without client-side helper hints.
- **Timing-Attack Resistance:** Passcode validation uses `crypto.timingSafeEqual` in `lib/admin-auth.ts`, preventing timing attacks.
- **Sliding-Window Rate Limiting:** Login route (`/api/admin/auth`) restricts attempts to a maximum of 5 requests per 15-minute window per IP.
- **Strict Server Verification:** Mutating endpoints (`POST/DELETE /api/schemes`, `POST /api/sync-schemes`, `GET/DELETE /api/subscribe-alerts`) independently verify `x-admin-key` on every request.

---

## 🔒 20-Point Security & Hardening Architecture

The platform adheres to an enterprise security checklist across all layers:

| # | Security Control | Implementation in Codebase |
| :- | :--- | :--- |
| **1** | **Hide API Keys** | Privileged service account credentials (`FIREBASE_PRIVATE_KEY`, `ADMIN_SECRET`) reside exclusively in server environments and are never prefixed with `NEXT_PUBLIC_`. |
| **2** | **Validate Environment Variables** | Server helpers check for environment variables before execution and fail closed if unconfigured. |
| **3** | **Protect Admin Routes** | `/admin` requires cryptographic key authentication. Unauthenticated requests are blocked from loading dashboard controls. |
| **4** | **Proper Authentication** | Constant-time cryptographic comparison via `crypto.timingSafeEqual` prevents timing-based credential brute-forcing. |
| **5** | **Check User Access** | Role-based authorization ensures regular users have read-only access while writes require admin verification. |
| **6** | **Sanitize Form Inputs** | Ingestion pipeline (`lib/pipeline/validator.ts`) strips control characters, HTML tags, and truncates malformed strings. |
| **7** | **Protect Against XSS** | React 19 automatic JSX output escaping is enforced across all dynamic content. Direct HTML injection (`dangerouslySetInnerHTML`) is avoided. |
| **8** | **Rate Limiting** | Sliding-window in-memory rate limiter (`lib/rate-limiter.ts`) restricts brute-force attempts on sensitive endpoints. |
| **9** | **Secure API Endpoints** | Mutating endpoints (`/api/schemes`, `/api/sync-schemes`, `/api/subscribe-alerts`) enforce `verifyAdminRequest()` server-side. |
| **10** | **Enforce Strict CORS** | Next.js API routes restrict cross-origin access and default to same-origin execution. |
| **11** | **HTTP Security Headers** | `next.config.ts` injects `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `HSTS`. |
| **12** | **Disable Debug Information** | Stack traces and raw internal error objects are stripped from production API responses; `poweredByHeader` is set to `false`. |
| **13** | **Dependency Audit** | `npm audit fix` resolves vulnerable dependencies, maintaining modern Next.js 16 and React 19 packages. |
| **14** | **Remove Unused Packages** | Codebase imports only essential dependencies, eliminating unused modules. |
| **15** | **Check for Exposed Files** | Sensitive environment files (`.env`, `.env.local`, `.env.*`) and credentials are explicitly protected in `.gitignore`. |
| **16** | **Secure Firestore Rules** | `firestore.rules` grants public read access while restricting create, update, and delete operations to verified admin tokens. |
| **17** | **Hash Credentials Properly** | Passcodes are compared via cryptographic memory buffers rather than plaintext comparisons. |
| **18** | **Clean Git History** | Git trees and configurations are scrubbed of personal identifiers and accidental credentials. |
| **19** | **Full Security Audit** | Routine `npm run lint` and build validations verify zero compilation or lint errors. |
| **20** | **Zero Mistake Fail-Closed Design** | If the admin secret is omitted or mismatched in production, all administrative mutations fail closed immediately. |

---

## 🌐 Deployment Guide (Vercel & Cloud)

### Deploying to Vercel
1. Push your repository to GitHub:
   ```bash
   git push origin main
   ```
2. Import the project into the [Vercel Dashboard](https://vercel.com/new).
3. Under **Project Settings > Environment Variables**, configure:
   - `ADMIN_SECRET`: Set a secure master passcode (e.g. 24+ alphanumeric string).
   - `FIREBASE_PROJECT_ID`: Your cloud database project ID.
   - `FIREBASE_CLIENT_EMAIL`: Your service account email.
   - `FIREBASE_PRIVATE_KEY`: Your full multi-line service account private key (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`).
   - `NEXT_PUBLIC_FIREBASE_*`: Your client cloud database credentials.
4. Click **Deploy**. Vercel will build the Next.js 16 App Router application and deploy it globally on edge networks.

### Configuring Firestore Rules
Deploy the included declarative database rules via the Cloud Database CLI:
```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

---

## 💻 NPM Scripts Reference

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles the production build, runs type checks, and optimizes pages |
| `npm run start` | Boots the optimized production server |
| `npm run lint` | Runs ESLint analysis across all files |
| `npm run push:schemes` | Executes CLI data harvester to seed and update Firestore with curated schemes |
| `npm run db:seed` | Alias for `npm run push:schemes` |

---

## 🤝 Contributing & Feedback

Contributions, corrections to scheme guidelines, and feature improvements are warmly welcome!

1. Fork the Project Repository.
2. Create your Feature Branch (`git checkout -b feature/NewSchemeModule`).
3. Commit your Changes (`git commit -m "feat: Add new state scholarship pipeline"`).
4. Push to the Branch (`git push origin feature/NewSchemeModule`).
5. Open a Pull Request on GitHub.

---

<div align="center">
  <sub>Built with ❤️ to empower Indian citizens • Digital India & Public Welfare Initiative</sub>
</div>
