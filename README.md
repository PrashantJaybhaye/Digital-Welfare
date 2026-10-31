<div align="center">

# 🏛️ DigitalWelfare

### One unified platform for discovering, understanding, and accessing government welfare schemes.

Helping citizens discover schemes, verify eligibility, prepare documents, and access welfare benefits through a simple digital experience.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-digitalwelfare.vercel.app-000000?style=for-the-badge&logo=vercel)](https://digitalwelfare.vercel.app)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloud Datastore](https://img.shields.io/badge/Database-Cloud_Firestore-FFA611?style=flat-square&logo=firebase)](https://firebase.google.com/docs/firestore)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable_%26_Offline_Ready-purple?style=flat-square)](https://web.dev/progressive-web-apps/)
[![Test Suite](https://img.shields.io/badge/Tests-13%2F13_Passing-emerald?style=flat-square&logo=node.js)](tests/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

</div>

---

## ⚡ Project at a Glance

| Property | Implementation Detail |
| :--- | :--- |
| 🚀 **Status** | **Live Prototype** — Deployed and production-built on Next.js 16.3.1 |
| 🌐 **Platform** | Progressive Web Application (PWA) with responsive mobile & desktop views |
| 🎯 **Domain** | Civic Technology / Public Welfare & Direct Benefit Transfer (DBT) |
| 🧩 **Core Stack** | Next.js 16 (App Router, Turbopack) + React 19 + TypeScript 5 + Tailwind CSS v4 |
| ☁️ **Cloud Datastore** | Google Cloud Firestore (NoSQL document catalog) + Firebase Admin SDK |
| 📱 **Offline Capability** | Service Worker (`sw.js`) + 25+ scheme offline fallback bundle (`fallback-schemes.ts`) |
| 🛡️ **Data Privacy** | DPDP Act 2023 aligned — Zero Aadhaar or PII stored on application servers |
| 🏆 **Hackathon Track** | Hack for Social Cause (HSC) • Government and Civic Technology (`HSC \| MH \| 00284`) |

---

## 📋 Table of Contents
- [Why DigitalWelfare?](#-why-digitalwelfare)
- [Core Citizen Value Flow](#-core-citizen-value-flow)
- [Product Showcase](#-product-showcase)
- [Video Demonstration](#-video-demonstration)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Data Intelligence Pipeline](#-data-intelligence-pipeline)
- [Technology Stack](#-technology-stack)
- [Scheme Coverage & Benefits](#-scheme-coverage--benefits)
- [Security Architecture](#-security-architecture)
- [Admin Control Center](#-admin-control-center)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)
- [NPM Scripts Reference](#-npm-scripts-reference)
- [Project Roadmap](#-project-roadmap)
- [Hackathon Submission & Team](#-hackathon-submission--team)
- [License](#-license)

---

## 💡 Why DigitalWelfare?

### The Problem
Every year, central and state governments allocate hundreds of thousands of crores to welfare, scholarships, health insurance, and agricultural subsidies. Yet millions of eligible citizens miss out due to structural friction:

* **Information Fragmentation:** Schemes are scattered across 50+ departmental websites and state portals (MahaDBT, MP-SIMS, myScheme, BOCW).
* **Opaque Legal Gazettes:** Complex government resolutions make it difficult for families to know if their income, age, or landholding qualifies.
* **The "Missing Document" Trap:** Citizens travel miles to Common Service Centres (CSC) or Setu kiosks only to be turned away for missing specific proofs (e.g., 7/12 land extract, caste validity, Tehsildar income certificate).
* **Connectivity Barriers:** Rural citizens frequently face dropouts and blank screens on heavy legacy portals.

### The Solution
**DigitalWelfare** provides a streamlined, transparent citizen gateway that unifies discovery, eligibility evaluation, and application readiness into a single responsive application.

```text
       Traditional Friction                              DigitalWelfare Experience
┌─────────────────────────────────┐               ┌─────────────────────────────────────┐
│ 50+ Separate Gov Websites       │               │ 1 Unified Search & Category Browser │
│ Complex 40-Page PDFs / Gazettes │      ───►     │ Instant 6-Parameter Eligibility     │
│ Multiple Wasted Kiosk Visits    │               │ Standardized A4 Print Dossier       │
│ Unclear Income & Document Rules │               │ Pre-Application Checklist (DigiLocker)
└─────────────────────────────────┘               └─────────────────────────────────────┘
```

---

## 🔄 Core Citizen Value Flow

The platform guides citizens through a structured, 5-stage entitlement journey:

```text
  🔎 DISCOVER             🧠 EVALUATE             📊 COMPARE             📄 PREPARE             🏛️ ACCESS
┌──────────────┐        ┌──────────────┐        ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ Browse 100+  │        │ Input age,   │        │ Contrast up  │       │ Review       │       │ Present A4   │
│ central and  │   ──►  │ income, and  │   ──►  │ to 3 schemes │  ──►  │ required doc │  ──►  │ dossier at   │
│ state welfare│        │ occupation to│        │ side-by-side │       │ checklist &  │       │ CSC / Setu   │
│ programs     │        │ compute aid  │        │ entitlements │       │ guidelines   │       │ kiosk        │
└──────────────┘        └──────────────┘        └──────────────┘       └──────────────┘       └──────────────┘
```

---

## 📸 Product Showcase

<div align="center">
  <img src="public/hero-illustration.png" alt="DigitalWelfare Citizen Interface" width="100%" style="max-width: 820px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.08);" />
  <p><sub>Citizen-Centric Interface • Real-Time Entitlement Slicing • Standardized GovTech Design System</sub></p>
</div>

| Route | View | Description |
| :--- | :--- | :--- |
| `/schemes` | **Scheme Directory** | Instant search with category filters, department badges, and localized bookmarks. |
| `/schemes/[id]` | **Scheme Detail Breakdown** | Official department seals, eligibility breakdown, application window, and step-by-step guides. |
| `/eligibility-check` | **Eligibility Engine** | Demographic calculator delivering personalized subsidy amounts and direct benefit totals. |
| `/compare` | **3-Way Comparator** | Side-by-side comparison matrix contrasting monetary aid, income ceilings, and document proofs. |
| `/admin` | **Control Center** | Protected administrative dashboard for scheme authoring, scraping pipelines, and citizen alert tracking. |

---

## 🎥 Video Demonstration

Watch the complete project walkthrough showcasing real-world citizen scheme discovery, eligibility assessment, and CSC dossier generation:

<div align="center">
  <video src="public/Maharashtra_DigitalWelfare_Explainer_compatible.mp4" controls width="100%" style="max-width: 860px; border-radius: 14px; box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2); border: 1px solid rgba(226, 232, 240, 0.8);">
    Your browser does not support the video tag.
  </video>

  <p align="center" style="margin-top: 10px;">
    <strong>🏛️ Maharashtra DigitalWelfare System Walkthrough</strong><br/>
    <sub>HD Video • Standard H.264 / AAC MP4 • 1080p Compatible</sub>
  </p>

  <p align="center">
    <a href="public/Maharashtra_DigitalWelfare_Explainer_compatible.mp4">
      <img src="https://img.shields.io/badge/▶️_Watch_Video-Local_MP4_(18MB)-E11D48?style=for-the-badge&logo=quicktime" alt="Watch Local Video" />
    </a>
    &nbsp;
    <a href="https://digitalwelfare.vercel.app/Maharashtra_DigitalWelfare_Explainer_compatible.mp4" target="_blank">
      <img src="https://img.shields.io/badge/🌐_Cloud_Stream-Vercel_Edge_CDN-000000?style=for-the-badge&logo=vercel" alt="Cloud Stream" />
    </a>
    &nbsp;
    <a href="public/socialhack-submission-HSCMH00284.pdf" target="_blank">
      <img src="https://img.shields.io/badge/📄_HSC_Dossier-Submission_PDF-4F46E5?style=for-the-badge&logo=adobeacrobatreader" alt="Download Evaluation PDF" />
    </a>
  </p>
</div>

### ⏱️ Demonstration Chapters
| Timestamp | Chapter Module | Key Demonstration Takeaways |
| :--- | :--- | :--- |
| **00:00 – 00:30** | **The Grassroots Reality** | Analysis of the rural welfare divide and the 50+ fragmented portals in Maharashtra. |
| **00:31 – 01:10** | **Smart Scheme Catalog** | Real-time SWR search, instantaneous `<5ms` category filtering, and localized bookmarks. |
| **01:11 – 01:55** | **Eligibility Engine** | 6-parameter algorithmic matching and aggregate annual financial entitlement calculation. |
| **01:56 – 02:40** | **CSC Facilitation Dossier** | Single-click generation of the standardized A4 printable record with DigiLocker checklist. |
| **02:41 – 03:20** | **Admin Control & Sync Pipeline** | Real-time scraper pipeline execution syncing live feeds into Cloud Firestore. |

---

## ✨ Key Features

### 1. 🔎 Smart Scheme Discovery (`/schemes`)
* **Stale-While-Revalidate (SWR) Caching:** Schemas load in `< 5ms` from in-memory cache while background validation keeps data fresh.
* **Multi-Department Filtering:** Instant filtering across Agriculture, Higher Education, Health, Women & Child, Social Justice, and Skills.
* **Persistent Local Bookmarks:** Save schemes directly to browser local storage with multi-tab synchronization.
* **Dynamic Timelines:** Automatically parses real application deadlines or marks universal programs (e.g. PM-KISAN, Ladki Bahin) as year-round.

### 2. 🧠 Dynamic Eligibility Engine (`/eligibility-check`)
* **6-Parameter Evaluation:** Evaluates Age boundaries, Gender targets, Family Income thresholds, Occupation profiles, State boundaries, and Social Category affirmative quotas.
* **Entitlement Valuation:** Calculates total estimated annual aid (e.g., ₹18,000/yr for *Majhi Ladki Bahin*, ₹12,000/yr for *PM-KISAN + Namo Shetkari*, ₹5 Lakh *Ayushman Bharat / MJPJAY* cashless health cover).
* **Decoupled Architecture:** Built on pure, unit-tested engine [`lib/eligibility-engine.ts`](lib/eligibility-engine.ts) with zero UI coupling.

### 3. 📄 Standardized CSC / Setu Facilitation Dossier (Print & PDF)
* **Fixed A4 Printable Body (186mm):** Standardized print layout eliminating responsive layout collapse on desktop and mobile printing.
* **Kiosk-Ready Format:** Includes formal Directorate mastheads, barcoded reference identifiers, DigiLocker verification directives, and Kiosk Operator signature/stamp blocks.
* **Multi-Page Handling:** Dynamically flows across Page 1 and Page 2 when matching more than 6 programs.

### 4. ⚖️ 3-Way Scheme Comparator (`/compare`)
* **Side-by-Side Matrix:** Compare up to 3 welfare schemes concurrently.
* **Direct Contrasting:** Compares monetary grants, income ceilings, age brackets, and required document proofs.
* **Printable Summary:** Generate clean physical comparison reports for citizens evaluating multiple options.

### 5. 🔔 Citizen Alert Subscriptions (`/api/subscribe-alerts`)
* **Targeted Notification Intake:** Citizens register preferences for category (e.g., Higher Education) and residence state.
* **Multi-Channel Selection:** Supports WhatsApp, SMS, or Email preferences.
* **Rate-Limited & Validated:** Protected by sliding-window rate limiters to prevent subscription spam.

### 6. 📱 Progressive Web App (PWA) & Offline Resilience
* **Installable:** Native-like installation on Android, iOS, Windows, and macOS via `manifest.json`.
* **Zero-Downtime Fallback:** Service worker (`public/sw.js`) caches application assets; if Firestore is unavailable, the UI automatically mounts a 25+ scheme curated offline bundle (`lib/fallback-schemes.ts`).

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    subgraph Sources [1. Government Data Sources]
        MahaDBT["MahaDBT Portal (Aaple Sarkar)"]
        MPSIMS["MP-SIMS (Scheme Catalog)"]
        CentralGazettes["Central Ministry Feeds & Gazettes"]
    end

    subgraph Pipeline [2. Ingestion & Intelligence Pipeline]
        Harvester["Data Harvester / Cheerio Scraper"]
        Validator["Input Sanitizer & Dead Link Filter"]
        Normalizer["Devanagari Translation & Normalizer"]
        Extractors["Rule, Benefit, Doc & Timeline Extractors"]
    end

    subgraph Storage [3. Datastore & Offline Bundles]
        Firestore[("Cloud Firestore<br/>(schemes, scheme_subscribers)")]
        OfflineFallback[("Offline Curated Catalog<br/>(lib/fallback-schemes.ts)")]
        SWCache[("Service Worker Cache<br/>(public/sw.js)")]
    end

    subgraph AppLayer [4. Next.js 16 Application Layer]
        Proxy["Proxy Security Guardrail (proxy.ts)"]
        CatalogPage["Scheme Catalog (/schemes)"]
        DetailPage["Scheme Details (/schemes/[id])"]
        EnginePage["Eligibility Engine (/eligibility-check)"]
        ComparePage["Scheme Comparator (/compare)"]
        AdminDashboard["Protected Admin Panel (/admin)"]
    end

    subgraph Actors [5. Citizens & Kiosks]
        Citizen["Indian Citizens / Students / Farmers"]
        CSCOperator["CSC / Setu Kiosk Operator"]
        Admin["Welfare Department Administrator"]
    end

    Sources --> Harvester --> Validator --> Normalizer --> Extractors --> Firestore
    Firestore -.-> OfflineFallback
    Firestore --> AppLayer
    Citizen --> CatalogPage & DetailPage & EnginePage & ComparePage
    EnginePage -->|Generates A4 Dossier| CSCOperator
    Admin --> AdminDashboard --> Firestore
```

The system uses Next.js 16 App Router on Turbopack with React Server Components, server actions, and route-isolated loading states to ensure sub-second navigation across all citizen touchpoints.

---

## 🔄 Data Intelligence Pipeline

The ingestion engine processes raw government announcements into structured, machine-evaluable schemes through an automated pipeline:

```text
1. RAW HARVESTING    ──► Scrapes HTML tables & JSON feeds from MahaDBT, MP-SIMS & Central Gazettes.
2. SANITIZATION      ──► Discards placeholder headers, malformed titles, and discontinued schemes.
3. NORMALIZATION     ──► Translates Devanagari text and standardizes departmental taxonomy (DHE, DTE, TDD).
4. RULE EXTRACTION   ──► Extracts numeric age bounds, income ceilings, caste quotas, and gender targeting.
5. BENEFIT VALUATION ──► Computes quantifiable DBT cash transfer values, fee waivers, and health cover amounts.
6. DOC GENERATION    ──► Builds verified document checklists (7/12 land records, income certificates, caste proofs).
7. TIMELINE PARSING  ──► Extracts official deadlines or dynamically derives current academic / seasonal cycles.
8. FIRESTORE SYNC    ──► Deduplicates against existing slugs and performs batch writes to Cloud Firestore.
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | [Next.js (App Router)](https://nextjs.org/) | `16.3.1` | Turbopack compilation, React Server Components, Route Groups |
| **UI Library** | [React](https://react.dev/) | `19.2.8` | Concurrent rendering, form actions, and client hooks |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `v4.x` | Modern styling engine with dedicated `@media print` A4 rules |
| **Type Safety** | [TypeScript](https://www.typescriptlang.org/) | `5.x` | End-to-end interface contracts and compile-time verification |
| **Database** | [Google Cloud Firestore](https://firebase.google.com/) | `12.x` | Cloud NoSQL document store with composite indexing |
| **Admin Operations**| [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) | `14.x` | Privileged batch writes and secure server mutations |
| **HTML Parsing** | [Cheerio](https://cheerio.js.org/) | `1.0.0` | Scraping government portal tables and circular notices |
| **Iconography** | [Lucide React](https://lucide.dev/) | `^1.31.0` | Clean, accessible SVG iconography |
| **Testing** | Node.js Test Runner / `tsx` | Native | Automated unit tests covering eligibility and timeline logic |
| **Hosting & CDN** | [Vercel](https://vercel.com/) | Edge | Serverless functions, Edge routing, and automatic static optimization |

---

## 📊 Scheme Coverage & Benefits

DigitalWelfare indexes welfare programs across Central and Maharashtra State departments:

| Department / Category | Featured Schemes | Target Beneficiary | Key Monetary Entitlement |
| :--- | :--- | :--- | :--- |
| **Higher & Technical Education** | Rajarshi Shahu Maharaj Tuition Waiver, Panjabrao Deshmukh Hostel Aid | College, Engineering & Medical Students | 50%–100% Tuition Fee Waiver + up to ₹30,000/yr Hostel Aid |
| **Social Justice & Assistance** | SC Post-Matric Scholarship, SC Freeship, Swadhar Yojana, Sanjay Gandhi Niradhar | Scheduled Castes (SC), Seniors, Destitute | 100% Tuition Waiver + ₹51,000/yr Hostel DBT + Pensions |
| **Tribal Development (TDD)** | ST Post-Matric Scholarship, Swayam Yojana, Birsa Munda Krishi Kranti | Scheduled Tribes (ST) | 100% Tuition Waiver + ₹51,000/yr DBT + Farm Subsidies |
| **OBC, VJNT & SBC Welfare** | Post-Matric Scholarship, Savitribai Phule Aadhaar, Modi Awas Gharkul | OBC, VJNT, SBC Families | Tuition Reimbursement + ₹60,000/yr Hostel + Housing |
| **Agriculture & Farming** | Namo Shetkari Samman Nidhi, Baliraja Free Power, Magel Tyala Solar Pump | Farmers & Landholders | ₹6,000/yr State DBT + 100% Free Power + Solar Pumps |
| **Women Empowerment** | Mukhyamantri Majhi Ladki Bahin Yojana, Lek Ladki Yojana | Women & Girl Children | ₹1,500/month (₹18,000/yr Direct DBT) + ₹1.01L at age 18 |
| **Youth & Employment** | CM Yuva Karya Prashikshan Yojana, MAPS Apprenticeships | Job Seekers & Graduates | ₹6,000–₹10,000/month Internship Stipend + Interest-Free Loans |
| **Public Healthcare** | Mahatma Jyotirao Phule Jan Arogya Yojana (Universal MJPJAY / PM-JAY) | All Eligible Citizens | ₹5,00,000/year Cashless Hospitalization across 1,000+ Hospitals |
| **Labour & Construction** | Maharashtra Bandhkam Kamgar Welfare (BOCW), Atal Aahar | Construction & Daily Wage Workers | Safety Kits + ₹5k–₹1L Welfare Grants + ₹5 Hot Meal Scheme |
| **Divyang & Senior Care** | Motorized Tricycles, Laptop Assistance, CM Vayoshree Yojana | PwD Citizens & Seniors (65+) | Free Assistive Devices + ₹3,000 Direct Cash Aid |

---

## 🔐 Security Architecture

### Security at a Glance
The application implements practical defense-in-depth across the application and API layers:

| Security Domain | Applied Mechanism | Protection Value |
| :--- | :--- | :--- |
| **Admin Authentication** | Constant-time `crypto.timingSafeEqual` comparison | Prevents timing attacks on master access keys |
| **Session Expiry** | Automatic 2-hour client session timeout | Protects shared workstations and CSC kiosks |
| **Rate Limiting** | Sliding-window in-memory limiter | Mitigates brute-force attacks on authentication and alert routes |
| **Input Sanitization** | Regex sanitization & control character stripping | Blocks injection attacks and drops malformed payloads |
| **XSS Defense** | React 19 automatic JSX output escaping | Prevents cross-site scripting without unsafe innerHTML |
| **HTTP Security Headers** | `DENY` framing, `nosniff`, `HSTS`, strict CSP | Defends against clickjacking, MIME sniffing, and MITM |
| **Zero PII Storage** | No Aadhaar numbers or biometrics persisted | Aligns with the Digital Personal Data Protection (DPDP) Act 2023 |

<details>
<summary><strong>🔍 Click to expand the 20-Point Technical Security Audit Checklist</strong></summary>

<br/>

| # | Security Control | Codebase Implementation |
| :- | :--- | :--- |
| **1** | **Hide API Keys** | Privileged credentials (`FIREBASE_PRIVATE_KEY`, `ADMIN_SECRET`) reside exclusively in server environments without `NEXT_PUBLIC_` prefixes. |
| **2** | **Validate Environment Variables** | Server helpers check required variables on boot and fail closed if missing. |
| **3** | **Protect Admin Routes** | `/admin` enforces cryptographic key verification before rendering dashboard controls. |
| **4** | **Constant-Time Crypto** | `lib/admin-auth.ts` verifies passcodes using `crypto.timingSafeEqual`. |
| **5** | **Role Authorization** | Unauthenticated clients have read-only access; mutations require verified tokens. |
| **6** | **Input Sanitization** | Ingestion pipeline (`lib/pipeline/validator.ts`) cleans HTML entities and truncates oversized strings. |
| **7** | **XSS Prevention** | React 19 JSX output escaping is enforced universally. |
| **8** | **Rate Limiting** | Sliding-window limiter (`lib/rate-limiter.ts`) restricts sensitive endpoints. |
| **9** | **Protected API Mutations** | Mutating endpoints (`/api/schemes`, `/api/sync-schemes`) verify `x-admin-key` server-side. |
| **10** | **CORS Enforcement** | Next.js API routes default to same-origin execution. |
| **11** | **Security Headers** | `next.config.ts` injects `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `HSTS`. |
| **12** | **Disable Debug Information** | Stack traces are stripped from production responses; `poweredByHeader` is disabled. |
| **13** | **Dependency Auditing** | Maintained zero audit vulnerabilities across dependencies. |
| **14** | **Minimal Surface Area** | Codebase imports only essential packages, eliminating unused dependencies. |
| **15** | **Exposed Files Check** | `.env*` files are strictly registered in `.gitignore`. |
| **16** | **Declarative Firestore Rules** | `firestore.rules` enforces read-only public access and admin-token-only writes. |
| **17** | **Buffer-Based Comparison** | Secret comparisons operate over fixed-length memory buffers. |
| **18** | **Clean Git History** | Git trees are clean of personal credentials or secret keys. |
| **19** | **Continuous Automated Testing** | Automated test suite verifies eligibility logic and timeline parsing on every change. |
| **20** | **Fail-Closed Operations** | In the absence of admin secrets, all write operations fail closed immediately. |

</details>

---

## 🛡️ Admin Control Center

The Admin Control Center (`/admin`) allows welfare coordinators to manage schemes, trigger scrapers, and inspect subscriptions.

```text
┌────────────────────────────────────────────────────────┐
│               DigitalWelfare Admin Gateway              │
├────────────────────────────────────────────────────────┤
│ [ 🔒 Master Admin Security Key: ••••••••••• ]          │
│                                                        │
│ [ Unlock Admin Operations ]                            │
│                                                        │
│ 🛡️ Protected Gateway: Authenticate with ADMIN_SECRET.   │
│    Sessions expire automatically after 2 hours.        │
└────────────────────────────────────────────────────────┘
```

### Administrative Capabilities
| Subsystem | Primary Action | Functional Scope |
| :--- | :--- | :--- |
| **System Overview** | Metrics & Telemetry | Live counts of catalog schemes, central vs state distribution, and subscriber counts. |
| **Scheme Inventory** | Search, Inspect & Delete | Search schemes by keyword or category, inspect details, or execute bulk deletions. |
| **Scheme Authoring** | Ingest & Publish | Multi-step form to publish new schemes with criteria, benefit values, and checklists. |
| **Live Sync Pipeline**| Run Ingestion Engine | Executes the 10-stage harvester syncing real-time data from government portals into Firestore. |
| **Citizen Alerts** | Subscriber Management | Review citizens registered for WhatsApp, SMS, or Email alerts filtered by state and category. |

---

## 📂 Project Directory Structure

```text
digital-welfare/
├── app/                                # Next.js 16 App Router Routes
│   ├── admin/                          # Protected Admin Dashboard & Subcomponents
│   ├── api/                            # Server Endpoints (schemes, sync, alerts, auth)
│   ├── compare/                        # 3-Way Scheme Comparison Matrix
│   ├── eligibility-check/              # Eligibility Evaluator & Controller
│   ├── schemes/                        # Schemes Directory & Dynamic Detail Routes
│   ├── globals.css                     # Tailwind v4 Styles & Print A4 Media Rules
│   └── layout.tsx                      # Root Layout, Navbar & PWA Initializer
│
├── components/                         # Modular React Components
│   ├── admin/                          # Decomposed Admin Tabs (Overview, Schemes, Create, etc.)
│   ├── eligibility/                    # Eligibility Form, Results & A4 Print Dossier
│   ├── Navbar.tsx                      # Navigation Header with Mobile Drawer
│   ├── SchemeCard.tsx                  # Scheme Catalog Card with Dynamic Timeline Badge
│   └── SchemeDetailView.tsx            # Complete Scheme Breakdown with Official Seals
│
├── lib/                                # Core Business Logic & Pipelines
│   ├── eligibility-engine.ts           # Pure 6-Parameter Welfare Scoring Engine
│   ├── pipeline/                       # 10-Stage Scraper, Normalizer, and Extractors
│   ├── fallback-schemes.ts             # Curated 25+ Scheme Offline Fallback Catalog
│   ├── firebase.ts                     # Client-Side Firebase Initialization
│   ├── firebase-admin.ts               # Server-Side Privileged Cloud Datastore Helper
│   └── rate-limiter.ts                 # Sliding-Window Memory Rate Limiter
│
├── tests/                              # Automated Unit Test Suites
│   ├── eligibility-engine.test.ts      # 8 Unit Tests for Eligibility Rules
│   └── timeline-extractor.test.ts      # 5 Unit Tests for Dynamic Date Parsing
│
├── public/                             # Public Static Assets & Service Worker
│   ├── manifest.json                   # Web App Manifest for PWA Installation
│   └── sw.js                           # Offline Caching Service Worker
│
├── firestore.rules                     # Declarative Database Security Rules
├── next.config.ts                      # Next.js Build Configuration & HTTP Headers
└── package.json                        # Dependencies, Operational Scripts & Metadata
```

<details>
<summary><strong>📁 Click to expand detailed file-level architectural breakdown</strong></summary>

<br/>

```text
digital-welfare/
├── app/
│   ├── admin/page.tsx                  # Lightweight Admin Controller (< 300 lines)
│   ├── api/
│   │   ├── admin/auth/route.ts         # Rate-limited timing-safe admin verification
│   │   ├── schemes/route.ts            # GET/POST/DELETE scheme endpoints
│   │   ├── subscribe-alerts/route.ts   # Citizen alert intake endpoint
│   │   └── sync-schemes/route.ts       # Automated ingestion pipeline trigger
│   ├── compare/page.tsx                # Scheme comparison matrix page
│   ├── eligibility-check/page.tsx      # Clean coordinator page (< 150 lines)
│   └── schemes/
│       ├── page.tsx                    # Scheme catalog directory
│       └── [id]/page.tsx               # Dynamic scheme detail page
│
├── components/
│   ├── admin/
│   │   ├── admin-types.ts              # Shared admin interfaces & subscriber types
│   │   ├── CreateSchemeTab.tsx         # Multi-field scheme authoring form
│   │   ├── DiagnosticsTab.tsx          # 10-stage pipeline health & live scraper logs
│   │   ├── OverviewTab.tsx             # Metric cards, quick actions & ingestion log
│   │   ├── SchemeInventoryTab.tsx      # Paginated inventory table with bulk delete
│   │   └── SubscribersTab.tsx          # Citizen notification subscribers table
│   └── eligibility/
│       ├── EligibilityForm.tsx         # Profile inputs & quick-income selectors
│       ├── EligibilityResults.tsx      # Entitlement cards & WhatsApp sharing
│       └── PrintDossier.tsx            # Multi-page A4 printable CSC record
│
├── lib/
│   ├── admin-auth.ts                   # Constant-time crypto verification
│   ├── client-store.ts                 # Synced external stores with 2-hour timeout
│   └── pipeline/
│       ├── benefit-extractor.ts        # Computes monetary benefit amounts
│       ├── doc-extractor.ts            # Builds mandatory document checklists
│       ├── normalizer.ts               # Devanagari translation & category classification
│       ├── pipeline.ts                 # Pipeline orchestrator
│       ├── rule-extractor.ts           # Dynamic age, income, category rule parser
│       ├── timeline-extractor.ts       # Dynamic date & deadline parser
│       └── validator.ts                # Sanitizes input strings and drops duplicates
```

</details>

---

## 🚀 Getting Started & Local Setup

### Prerequisites
* **Node.js**: `v18.17.0+` or `v20.x+` ([Download Node.js](https://nodejs.org/))
* **NPM**: `v9.x+` or `v10.x+`
* **Google Cloud / Firebase Project**: An active project with **Firestore** enabled.

### 1. Clone the Repository
```bash
git clone https://github.com/PrashantJaybhaye/Digital-Welfare.git
cd Digital-Welfare
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the project root:

```env
# -------------------------------------------------------------
# Client-Side Variables (Browser Accessible)
# -------------------------------------------------------------
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# -------------------------------------------------------------
# Server-Only Secrets (Privileged Runtimes - Never expose in browser)
# -------------------------------------------------------------
ADMIN_SECRET=your_custom_strong_admin_passcode
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

> [!TIP]
> **Zero-Configuration Offline Mode:** If cloud credentials are not immediately configured, the application automatically mounts its curated offline catalog (`lib/fallback-schemes.ts`), allowing instant local UI development and testing.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run Automated Unit Tests
```bash
npm test
```

---

## 🔑 Environment Variables

| Variable | Scope | Required | Description |
| :--- | :--- | :---: | :--- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client / Browser | Yes | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client / Browser | Yes | Firebase Auth Domain URL |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client / Browser | Yes | Cloud Datastore Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Client / Browser | Yes | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| Client / Browser | Yes | Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client / Browser | Yes | Firebase Web Application ID |
| `ADMIN_SECRET` | **Server Only** | Yes | Master security key for unlocking `/admin` |
| `FIREBASE_CLIENT_EMAIL` | **Server Only** | Optional | Service Account Email for Admin SDK |
| `FIREBASE_PRIVATE_KEY` | **Server Only** | Optional | Service Account Private Key for Admin SDK |

> [!CAUTION]
> **Security Notice:** Never commit `.env.local`, Firebase service account credentials, private keys, or admin secrets to Git.

---

## 🌐 Deployment Guide

```text
GitHub (main branch) ──► Vercel (Edge CDN Build) ──► Next.js 16 Application ──► Cloud Firestore
```

### Deploying to Vercel
1. Push your changes to GitHub:
   ```bash
   git push origin main
   ```
2. Import the repository into the [Vercel Dashboard](https://vercel.com/new).
3. Under **Project Settings > Environment Variables**, add the variables listed above.
4. Click **Deploy**. Vercel will build the Next.js 16 App Router application and deploy it globally on edge networks.

### Deploying Firestore Rules
Deploy declarative security rules and composite indexes:
```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes
```

---

## 💻 NPM Scripts Reference

| Command | Action |
| :--- | :--- |
| `npm run dev` | Boots local Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles production build, verifies TypeScript, and optimizes static pages |
| `npm run start` | Boots the optimized production server |
| `npm run lint` | Runs ESLint analysis across all files |
| `npm test` | Executes unit test suite for eligibility engine and dynamic timeline extractor |
| `npm run db:seed` | Seeds and updates Firestore with curated Maharashtra & Central welfare schemes |

---

## 🗺️ Project Roadmap

- [x] Multi-parameter dynamic citizen eligibility evaluation
- [x] Standardized A4 printable CSC / Setu Kiosk facilitation dossier
- [x] SWR cached scheme catalog with instant category filtering
- [x] 3-way side-by-side welfare scheme comparison matrix
- [x] Dynamic timeline and application deadline extraction
- [x] PWA offline caching and zero-downtime curated catalog fallback
- [x] Decomposed modular admin control panel with bulk operations
- [x] 10-stage automated GovTech ingestion pipeline
- [x] Comprehensive unit test suite with 13 passing tests
- [ ] Direct DigiLocker document sync integration
- [ ] Automated SMS notification delivery via Indian SMS gateways
- [ ] Expansion to additional state databases (Gujarat, Karnataka, Tamil Nadu)

---

## 🏆 Hackathon Submission & Team

Developed for **Hack for Social Cause (HSC)** under the **Government and Civic Technology** track.

* **Team Name:** AlphaCoders
* **Team ID:** `HSC | MH | 00284`
* **State / UT:** Maharashtra
* **Live Deployment:** [digitalwelfare.vercel.app](https://digitalwelfare.vercel.app)
* **GitHub Repository:** [github.com/PrashantJaybhaye/Digital-Welfare](https://github.com/PrashantJaybhaye/Digital-Welfare)

### Team Composition & Roles
| Member | Role | Core Contribution Focus |
| :--- | :--- | :--- |
| **Prashant Jaybhaye** | Frontend & UI Lead | Next.js 16 App Router, Tailwind CSS, Responsive UI & Print Dossiers |
| **Vaibhavi Mendre** | Backend & Data Lead | Scheme Data Ingestion, Firestore Backend & APIs |
| **Swayam Bana** | QA & Research Lead | Scheme Rule Verification, Criteria Validation & Quality Assurance |

### Official Government Portals Referenced
| Portal Name | Department / Ministry | Official Website |
| :--- | :--- | :--- |
| **MahaDBT 2.0 (Aaple Sarkar)** | Government of Maharashtra | [mahadbt2.maharashtra.gov.in](https://mahadbt2.maharashtra.gov.in) |
| **myScheme Portal** | Ministry of Electronics & IT (MeitY) | [myscheme.gov.in](https://www.myscheme.gov.in) |
| **National Scholarship Portal (NSP)** | Government of India | [scholarships.gov.in](https://scholarships.gov.in) |
| **DBT Bharat** | Cabinet Secretariat, GoI | [dbtbharat.gov.in](https://dbtbharat.gov.in) |
| **PM-KISAN Samman Nidhi** | Ministry of Agriculture & Farmers Welfare | [pmkisan.gov.in](https://pmkisan.gov.in) |
| **Ayushman Bharat (PM-JAY)** | National Health Authority (NHA) | [pmjay.gov.in](https://pmjay.gov.in) |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

```text
Copyright (c) 2026 AlphaCoders (Prashant Jaybhaye, Vaibhavi Mendre, Swayam Bana)
Open-source Digital Public Good created for Hack for Social Cause (HSC).
```

---

<div align="center">
  <sub>Built to empower Indian citizens • Digital India & Public Welfare Initiative</sub>
</div>
