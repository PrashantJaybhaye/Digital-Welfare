# 🏛️ DigitalWelfare (Aayush)

> **Next-Generation Public Welfare Discovery, Automated Eligibility Engine & Social Security Portal for India.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFA611?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple?style=flat-square)](https://web.dev/progressive-web-apps/)

---

## 📑 Table of Contents
- [Overview & Problem Statement](#-overview--problem-statement)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Project Directory & File Structure](#-project-directory--file-structure)
- [Technology Stack](#-technology-stack)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Database Schema (Firestore)](#-database-schema-firestore)
- [Security & Access Control](#-security--access-control)
- [Environment Setup & Installation](#-environment-setup--installation)
- [Scripts & Commands](#-scripts--commands)
- [Documentation Index](#-documentation-index)

---

## 🌟 Overview & Problem Statement

In India, hundreds of Central and State welfare programs (Direct Benefit Transfers, health coverage, farmer subsidies, educational scholarships) remain underutilized due to:
1. **Information Asymmetry**: Complex eligibility criteria scattered across disjointed government ministry websites.
2. **Language Barriers**: Gazette notifications published in complex legalese.
3. **Application Friction**: Lack of clarity regarding mandatory documents (7/12 extracts, Caste/Income certificates, Aadhaar seeding).

**DigitalWelfare (Aayush)** bridges this gap by offering a high-performance, single-window GovTech platform that indexes central and state schemes in real time, evaluates citizen eligibility in under 3 seconds, and provides step-by-step guidance to unlock social benefits.

---

## 🚀 Key Features

### 1. 🔍 Intelligent Scheme Directory & Discovery
- Real-time instant search across central and state welfare initiatives.
- Fast category categorization: Central Sector (`CS`), Centrally Sponsored (`CSS`), Agricultural (`Krishi`), Health (`Ayushman`), Scholarships, and State-specific programs.
- Bookmark and offline save functionality with `localStorage` persistence.
- Infinite / Progressive pagination (12 cards per batch) with instant keyword filtering.

### 2. 🎯 Multi-Criteria Citizen Eligibility Engine (`/eligibility-check`)
- Evaluates citizen profiles against age, gender, annual household income, occupation, social category (SC/ST/OBC/EWS), and state residency.
- Computes **Total Estimated Financial Benefit (INR)** and flag-based social safeguards (e.g. ₹5 Lakh Ayushman Health Coverage).
- Dynamically derives customized **Document Checklist** requirements based on identified schemes.
- Built-in **Printable Official Eligibility Report** generation for citizen facilitation centers (CSCs).

### 3. ⚖️ Side-by-Side Scheme Comparison Matrix (`/compare`)
- Compare up to 4 schemes simultaneously in a responsive comparison grid.
- Inspects side-by-side variations in:
  - Annual financial subsidy / DBT transfer amounts
  - Age, income, and occupation restrictions
  - Required KYC documents and verification processes
  - Official application portal routes

### 4. 🔔 Automated Scheme Alert & Notification Subscriptions
- Citizens can subscribe to proactive scheme alerts via SMS / WhatsApp / Email.
- Filter subscriptions by State, Citizen Category, and Notification Channel.
- Securely stored in Firestore collection `scheme_subscribers`.

### 5. 🔒 Restricted Admin Operations Gateway (`/admin`)
- Protected by a **Master Security Passcode** and Firebase Admin Auth session barrier.
- **Live Portal Web Scraper & Ingestion**: Crawls gazette portals (Wikipedia Indian welfare directory and state records) using `cheerio`, translates non-English text automatically, and hydrates Firestore.
- Real-time subscriber analytics and metrics exportable to JSON.
- Scheme creator and editor to manually publish or update official program details.

### 6. 📱 Progressive Web App (PWA) & Offline Capabilities
- Fully installable on Android, iOS, and Desktop devices.
- Service worker caching ensures critical scheme guidelines remain accessible with intermittent internet.

---

## 🏗️ System Architecture

```mermaid
graph TD
    User([Citizen / User]) <-->|HTTPS / PWA| CDN[Next.js Edge CDN / Vercel]
    CDN <--> AppRouter[Next.js 16 App Router]
    
    subgraph Frontend [Client & Server Components]
        Home["/ (Home Landing & Highlights)"]
        SchemesPage["/schemes (ISR Cached Directory)"]
        EligibilityPage["/eligibility-check (Engine)"]
        ComparePage["/compare (Comparison Matrix)"]
        AdminPage["/admin (Protected Operations Hub)"]
        Skeleton["components/SchemeSkeleton.tsx"]
    end

    AppRouter --> Frontend

    subgraph BackendAPI [Route Handlers & Server Actions]
        SyncAPI["/api/sync-schemes (Cheerio Web Scraper)"]
        AlertsAPI["/api/subscribe-alerts (Subscription Handler)"]
        AdminSDK["lib/firebase-admin.ts (Privileged SDK)"]
    end

    Frontend --> BackendAPI
    AdminPage --> SyncAPI

    subgraph DataStore [Google Firebase Cloud]
        FirestoreClient["Firebase Client SDK (lib/firebase.ts)"]
        FirestoreAdmin["Firestore Admin SDK (adminDb)"]
        CollectionSchemes[(Collection: schemes)]
        CollectionSubscribers[(Collection: scheme_subscribers)]
        SecurityRules{{"firestore.rules (RBAC Protection)"}}
    end

    Frontend <-->|Direct Read & Rules Check| FirestoreClient
    BackendAPI <-->|Privileged R/W| FirestoreAdmin
    FirestoreClient --> SecurityRules --> CollectionSchemes
    FirestoreAdmin --> CollectionSchemes
    FirestoreAdmin --> CollectionSubscribers
```

---

## 📂 Project Directory & File Structure

```
d:/aayush/
├── app/                                # Next.js 16 App Router
│   ├── admin/                          # Restricted Admin Operations Hub
│   │   └── page.tsx                    # Operations dashboard, sync trigger, subscriber manager & lock screen
│   ├── api/                            # Backend API Routes
│   │   ├── subscribe-alerts/           # Citizen scheme notification endpoint
│   │   │   └── route.ts
│   │   └── sync-schemes/               # Cheerio-based portal crawler & translation ingestion
│   │       └── route.ts
│   ├── compare/                        # Scheme Comparison Matrix
│   │   └── page.tsx                    # Side-by-side comparison engine & URL state sharing
│   ├── eligibility-check/              # Citizen Multi-Criteria Verification Engine
│   │   └── page.tsx                    # Dynamic criteria matching, subsidy calculation, document checklist & print report
│   ├── login/                          # Citizen authentication portal
│   │   └── page.tsx                    # Firebase Auth (Email/Password & Google Sign-In)
│   ├── schemes/                        # Public Schemes Directory
│   │   ├── [id]/                       # Individual scheme detail page
│   │   │   └── page.tsx
│   │   ├── loading.tsx                 # Suspense loading state with SchemeGridSkeleton
│   │   └── page.tsx                    # Server Component with ISR (revalidate = 3600)
│   ├── favicon.ico                     # Web application favicon
│   ├── globals.css                     # Global styles, animations & Tailwind v4 setup
│   ├── icon.svg                        # Vector brand asset
│   ├── layout.tsx                      # Root layout, PWA bootstrap & Navbar wrapper
│   └── page.tsx                        # Main landing page (Hero, Quick Finder, Statistics, Testimonials)
│
├── components/                         # Modular React UI Components
│   ├── Logo.tsx                        # Brand identity vector logo
│   ├── Navbar.tsx                      # Main navigation bar with responsive drawer & active link indicators
│   ├── PWARegister.tsx                 # Service worker registration for PWA installability
│   ├── SchemeAlertModal.tsx            # Modal dialogue for citizen scheme notification opt-in
│   ├── SchemeDetailView.tsx            # Comprehensive scheme breakdown, benefits, KYC checklist & application flow
│   ├── SchemeList.tsx                  # Client-side searchable directory with filters, bookmarking & pagination
│   └── SchemeSkeleton.tsx              # Pulse skeleton card & grid loaders for CLS-free loading states
│
├── lib/                                # Core Utility & SDK Libraries
│   ├── firebase.ts                     # Client-side Firebase App, Auth, Firestore & Storage initialization
│   └── firebase-admin.ts               # Server-side privileged Firebase Admin SDK singleton
│
├── public/                             # Static Assets & PWA Manifest
│   ├── manifest.json                   # Web app manifest for PWA installation
│   ├── sw.js                           # Service worker implementation for offline asset caching
│   └── [icons...]                      # App icons and graphics
│
├── types/                              # TypeScript Type Definitions
│   └── scheme.ts                       # Scheme data model, Category map, Document & Step application generators
│
├── .env.local                          # Environment secrets (Firebase keys, Admin Secret)
├── firestore.rules                     # Cloud Firestore Security Rules (RBAC)
├── firestore.indexes.json              # Composite database queries & indexing
├── next.config.ts                      # Next.js configuration
├── package.json                        # NPM package dependencies and scripts
├── tsconfig.json                       # TypeScript compiler options
└── README.md                           # Project Documentation
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 16.3.1 (App Router) | High-performance React framework with Server Components & ISR |
| **UI Library** | React 19.2.8 | Latest React library with modern Suspense and hook primitives |
| **Styling** | Tailwind CSS v4, PostCSS | Modern utility-first CSS with CSS variables and custom micro-animations |
| **Language** | TypeScript 5.0 | Type safety, autocompletion, and schema enforcement |
| **Database** | Google Cloud Firestore | NoSQL document database for live schemes and citizen subscriptions |
| **Authentication** | Firebase Auth | Secure Google OAuth and Email/Password authentication |
| **Server Admin** | Firebase Admin SDK 14.2 | Privileged server-side mutations and database management |
| **Web Scraping** | Cheerio 1.2.0 | Fast, flexible HTML parsing for live government scheme ingestion |
| **Icons** | Lucide React | Consistent, lightweight SVG icon system |
| **PWA** | Service Workers + Web Manifest | Offline asset caching and native mobile installability |

---

## 🔌 API Endpoints Reference

### 1. Ingest & Sync Schemes
- **Route**: `POST /api/sync-schemes`
- **Access**: Server-side / Admin Operations
- **Description**: Connects to public gazette databases, parses tabular scheme information, cleans text, auto-translates Marathi/Hindi text to English, and syncs records into Firestore.

### 2. Citizen Alert Subscription
- **Route**: `POST /api/subscribe-alerts`
- **Access**: Public
- **Payload**:
  ```json
  {
    "contact": "9876543210",
    "category": "Agriculture",
    "state": "Maharashtra",
    "channel": "WhatsApp"
  }
  ```
- **Response**: `{ "success": true, "message": "Successfully subscribed to scheme alerts." }`

---

## 📊 Database Schema (Firestore)

### Collection: `schemes`
```typescript
interface Scheme {
  id?: string;
  title: string;                       // e.g. "PM Kisan Samman Nidhi"
  description: string;                 // Scheme summary & purpose
  category: string;                    // "CS", "CSS", "Agriculture", "Health"
  state: string;                       // "All India" or specific State
  minAge?: number | null;              // Minimum age requirement
  maxAge?: number | null;              // Maximum age requirement
  maxIncome?: number | null;           // Annual family income ceiling
  targetGender?: 'Male'|'Female'|'Any';
  targetOccupation?: string | null;    // e.g. "Farmer", "Student", "Artisan"
  socialCategory?: 'All'|'SC/ST'|'OBC'|'General'|'EWS'|'Minority';
  benefits: string[];                  // Bulleted financial & welfare benefits
  requiredDocuments?: string[];        // Aadhaar, Income Certificate, 7/12 extract
  stepsToApply?: string[];             // Step-by-step application instructions
  estimatedBenefitAmount?: number;     // e.g. 6000 (INR/year)
  financialBenefitText?: string;       // e.g. "₹6,000 / year via DBT"
  applyLink?: string;                  // Direct official application URL
  lastSyncedAt: string;                // ISO timestamp of last update
}
```

### Collection: `scheme_subscribers`
```typescript
interface Subscriber {
  id: string;
  contact: string;                     // Mobile number or Email
  category: string;                    // Selected welfare category
  state: string;                       // Citizen's state
  channel: 'SMS' | 'WhatsApp' | 'Email';
  subscribedAt: string;                // ISO timestamp
  isActive: boolean;
}
```

---

## 🛡️ Security & Access Control

1. **Role-Based Firestore Rules (`firestore.rules`)**:
   - `schemes`: Public read access (`allow read: if true`), write/delete restricted to authenticated administrators (`allow write: if request.auth != null`).
   - `scheme_subscribers`: Public create (`allow create: if true`), read/delete restricted to administrators.
2. **Admin Operations Gateway**:
   - Guarded with an authorization key verification check.
   - Credentials and sync operations run on server execution environments (`firebase-admin`), preventing secret leakage to the client browser.
3. **Environment Security**:
   - Private keys (`FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`) are kept strictly in server runtime environments.

---

## 💻 Environment Setup & Installation

### Prerequisites
- Node.js 18.x or 20.x installed
- Firebase Project created on [Firebase Console](https://console.firebase.google.com/)

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/PrashantJaybhaye/Digital-Welfare.git
cd Digital-Welfare
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Client Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

# Admin Dashboard Security
NEXT_PUBLIC_ADMIN_SECRET=your_secure_admin_passcode
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Scripts & Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js local development server with Turbopack / Fast Refresh |
| `npm run build` | Compiles optimized production bundle and checks TypeScript types |
| `npm run start` | Boots the production server |
| `npm run lint` | Runs ESLint analysis across the codebase |

---

## 📚 Documentation Index

- **[Project Synopsis & Technical Analysis](file:///d:/aayush/PROJECT_SYNOPSIS.md)**: In-depth academic & technical analysis, algorithmic formulations, and social problem statement.
- **[Tools, Libraries & Tech Stack](file:///d:/aayush/TOOLS_AND_TECH_STACK.md)**: Exhaustive breakdown of every library, API, and architectural pattern used in this project.

---

<div align="center">
  <sub>Built with ❤️ for Indian Citizens • Digital India & Social Security Initiative</sub>
</div>
