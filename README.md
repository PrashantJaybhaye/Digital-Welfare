# 🏛️ DigitalWelfare (Aayush)

> **Helping every citizen discover, check eligibility for, and claim government welfare schemes — in seconds.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFA611?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![PWA](https://img.shields.io/badge/PWA-Installable-purple?style=flat-square)](https://web.dev/progressive-web-apps/)

---

## 📖 The Story Behind DigitalWelfare

In India, central and state governments spend thousands of crores every year on life-changing welfare programs — from farmer subsidies and girl-child support to full college tuition waivers and free healthcare. 

Yet, **millions of eligible families miss out** on benefits they rightfully qualify for.

### Why does this happen?
- **Information is scattered everywhere:** Schemes are spread across 50+ central ministries and state portals (like MahaDBT, MP-SIMS, MahaSwayam). Finding the right one feels like finding a needle in a haystack.
- **Eligibility rules are confusing:** Rules are buried in 30-page official government gazettes. People can't easily tell if an income cap is per-person or per-family, or if their land size or category qualifies.
- **The "Missing Document" headache:** Citizens travel miles to a Common Service Centre (CSC) or Setu office, wait in long queues, only to be told they forgot a specific document (like a Tehsildar income certificate, 7/12 land record, or caste validity).
- **Missed deadlines:** By the time word reaches a village or community, the application window is often closed.

**DigitalWelfare (Aayush)** bridges this gap. It gives every citizen a simple, friendly, one-stop portal to search schemes, check their eligibility with one click, calculate their total financial benefits, and get an exact checklist of documents before heading to an application center.

---

## ⚡ What You Can Do With DigitalWelfare

### 1. 🔍 Browse & Search Schemes Easily (`/schemes`)
- Search by keyword across Central and Maharashtra government programs.
- Filter instantly by category: Agriculture, Higher Education, Health, Women & Child, Social Justice, Skill Development, and more.
- Bookmark your favorite schemes to look at later.
- Fast loading with smooth skeleton placeholders and client-side caching.

### 2. 🎯 Instant Eligibility Matcher (`/eligibility-check`)
- Enter basic details: age, gender, annual family income, occupation, social category, and state.
- Get a clear list of every scheme you qualify for.
- See your **estimated annual financial benefit** (e.g., ₹18,000/year for *Ladki Bahin*, ₹12,000/year for *PM-KISAN + Namo Shetkari*, ₹5 Lakh *Ayushman/MJPJAY* health cover).
- Generate an instant **2-Page Printable Facilitation Dossier** that CSC/Setu operators or citizens can print out.

### 3. 📋 Tailored Document Checklist
- No more guessing what papers you need.
- Based on your profile and selected schemes, the system builds an exact checklist (e.g. *7/12 extract*, *Aadhaar e-KYC*, *Caste Validity*, *CAP Allotment Letter*, *Income Certificate*).

### 4. ⚖️ Side-by-Side Scheme Comparison (`/compare`)
- Compare up to 3 schemes at a time.
- See how financial benefits, age limits, income ceilings, and paperwork requirements stack up next to each other.
- Export or print clean comparative audit sheets.

### 5. 🔔 Scheme Alert Subscriptions (`/api/subscribe-alerts`)
- Sign up for alerts via WhatsApp, SMS, or Email.
- Get notified when new schemes launch or when application deadlines approach for your state and category.

### 6. 📱 Built for Real-World Conditions (PWA & Offline-Ready)
- Installable on mobile phones and desktops just like a native app.
- Built-in service worker caching and offline fallbacks mean citizens and field workers can look up scheme info even with poor rural internet connectivity.

### 7. 🛠️ Live Data Pipeline & Admin Hub (`/admin`)
- Automated pipeline that ingests, cleans, translates Marathi/Hindi, extracts eligibility rules, and updates Firestore.
- Protected admin operations hub for monitoring updates, subscriber stats, and managing scheme records.

---

## 💡 How It Works Under the Hood

Here is how data flows from official government portals into the hands of citizens:

```mermaid
flowchart TD
    subgraph Sources [1. Verified Official Portals]
        MahaDBT["MahaDBT (Aaple Sarkar DBT)"]
        MPSIMS["MP-SIMS (Scheme Information System)"]
        Mahaswayam["MahaSwayam (Skills & Jobs)"]
        CentralGazette["National Scheme Portals"]
    end

    subgraph Pipeline [2. Intelligence & Extraction Pipeline]
        Harvester["Data Collector & Scraper"]
        Validator["Data Validation & Junk Filter"]
        Normalizer["Translation (Devanagari to English) & Categorization"]
        RuleExtractor["Smart Rule Extractor (Age, Income, Gender, Category)"]
        DocExtractor["Smart Document Checklist Builder"]
        BenefitExtractor["Financial Valuation & Benefit Breakdown"]
    end

    subgraph Storage [3. Database & Caching]
        Firestore[("Firebase Firestore<br/>(schemes, scheme_subscribers)")]
        FallbackCatalog[("Local Offline Catalog<br/>(Zero-Downtime Fallback)")]
    end

    subgraph CitizenExperience [4. Citizen Portal & Tools]
        Matcher["Eligibility Matcher (/eligibility-check)"]
        Directory["Scheme Directory (/schemes)"]
        Details["Scheme Details (/schemes/[id])"]
        Compare["Comparison Matrix (/compare)"]
        PrintDossier["Printable CSC Facilitation Dossier"]
    end

    Sources --> Harvester --> Validator --> Normalizer
    Normalizer --> RuleExtractor --> Firestore
    Normalizer --> DocExtractor --> Firestore
    Normalizer --> BenefitExtractor --> Firestore
    Firestore -.-> FallbackCatalog
    Firestore --> Matcher & Directory & Details & Compare
    Matcher --> PrintDossier
```

---

## 🏛️ Government Schemes & Departments Covered

DigitalWelfare indexes active welfare initiatives across key departments:

| Department | Highlight Schemes | Who It's For | Key Benefits |
| :--- | :--- | :--- | :--- |
| **Higher & Technical Education** | Rajarshi Shahu Maharaj EBC Fee Waiver, Panjabrao Deshmukh Hostel Allowance | College & Engg. Students | 50% Tuition Waiver + up to ₹30,000/yr Hostel Aid |
| **Social Justice & Assistance** | SC Post-Matric Scholarship, SC Freeship, Swadhar Yojana, Sanjay Gandhi Niradhar | SC Students, Seniors, Destitute | 100% Tuition Fees + ₹51,000/yr Hostel DBT + Pensions |
| **Tribal Development (TDD)** | ST Post-Matric Scholarship, Swayam Yojana, Birsa Munda Krishi Kranti | Scheduled Tribes (ST) | 100% Tuition Waiver + ₹51,000/yr DBT + Farm Subsidies |
| **OBC, VJNT & SBC Welfare** | Post-Matric Scholarship, Savitribai Phule Aadhaar Yojana, Modi Awas Gharkul | OBC, VJNT, SBC Citizens | Tuition Reimbursement + ₹60,000/yr Hostel + Housing Grants |
| **Agriculture & Farmers** | Namo Shetkari Samman Nidhi, Baliraja Free Power, Solar Pump Yojana (Magel Tyala) | Farmers | ₹6,000/yr State DBT + 100% Free Farm Electricity + Solar Pumps |
| **Women & Child Welfare** | Mukhyamantri Majhi Ladki Bahin Yojana, Lek Ladki Yojana, Annapurna Free Cylinders | Women & Girls | ₹1,500/month DBT + ₹1.01L girl-child aid + 3 Free Gas Refills/yr |
| **Youth & Employment** | CM Yuva Karya Prashikshan Yojana, MAPS Apprenticeships, Annasaheb Patil Loans | Youth & Job Seekers | ₹6,000–₹10,000/mo Internship Stipend + Interest-Free Loans |
| **Public Health** | Mahatma Jyotirao Phule Jan Arogya Yojana (Universal MJPJAY / PM-JAY) | All Citizens | ₹5,00,000/year Cashless Hospital Care across 1,000+ Hospitals |
| **Labour & Construction (BOCW)** | Bandhkam Kamgar Welfare, Education & Marriage Grants, Atal Aahar | Construction Workers | Safety Kits + ₹5k–₹1L Student Grants + ₹5 Hot Meals |
| **Divyang & Senior Welfare** | Motorized Tricycles, Laptop Kits, CM Vayoshree Yojana | PwD & Seniors (65+) | Free Assistive Devices + ₹3,000 Direct Aid |

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 16 (App Router)](https://nextjs.org/) | Server components, static generation with ISR, API routes, and optimized assets |
| **UI & Interactivity** | [React 19](https://react.dev/) | Component architecture, responsive client state, Suspense loading boundaries |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS, fast styles, clean typography, responsive design |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible, lightweight vector icons |
| **Database & Auth** | [Google Firebase & Firestore](https://firebase.google.com/) | Real-time cloud database, secure user authentication, and indexing |
| **Admin Operations** | [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) | Secure server-side batch writes and privileged data syncs |
| **Web Scraping** | [Cheerio](https://cheerio.js.org/) | Fast server-side HTML parsing for government portal feeds |
| **PWA & Offline** | Service Workers & Web App Manifest | Add-to-Home-Screen capability and offline asset caching |
| **Type Safety** | [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety, models, and interfaces |

---

## 📂 Project Structure

```
d:/aayush/
├── app/                                # Next.js App Router Pages & APIs
│   ├── admin/                          # Admin Dashboard (Pipeline sync, subscriber overview)
│   ├── api/                            
│   │   ├── subscribe-alerts/           # Citizen scheme alert subscription API
│   │   └── sync-schemes/               # Data pipeline synchronization endpoint
│   ├── compare/                        # Scheme comparison matrix & printable report
│   ├── eligibility-check/              # Interactive eligibility matcher & CSC dossier generator
│   ├── login/                          # Citizen login / sign-in page
│   ├── schemes/                        # Searchable public directory & scheme details ([id])
│   ├── globals.css                     # Global styles & Tailwind v4 theme setup
│   ├── layout.tsx                      # Root layout, navbar, and PWA registration
│   └── page.tsx                        # Homepage with hero, highlights, and quick search
│
├── components/                         # Reusable UI Components
│   ├── Navbar.tsx                      # Responsive top navigation bar
│   ├── SchemeCard.tsx                  # Scheme card with benefit badges & key info
│   ├── SchemeDetailView.tsx            # Full scheme breakdown, eligibility criteria & document list
│   ├── SchemeList.tsx                  # Search, filter, pagination, and bookmarking logic
│   ├── SchemeAlertModal.tsx            # Alert subscription popup
│   ├── SchemeSkeleton.tsx              # Pulse skeleton loaders (zero layout shift)
│   └── PWARegister.tsx                 # Service worker registration
│
├── lib/                                # Utilities & Core Logic
│   ├── pipeline/                       # Automated Scheme Intelligence Pipeline
│   │   ├── validator.ts                # Cleans and filters junk data
│   │   ├── normalizer.ts               # Translates Devanagari & standardizes departments
│   │   ├── rule-extractor.ts           # Extracts age, income, category, and occupation rules
│   │   ├── doc-extractor.ts            # Builds customized required document checklists
│   │   ├── benefit-extractor.ts        # Calculates numeric financial value & summary badges
│   │   ├── mahadbt-catalog.ts          # Departmental catalogs for Maharashtra portals
│   │   └── pipeline.ts                 # Master pipeline orchestrator
│   ├── fallback-schemes.ts             # Instant offline catalog for zero-downtime resilience
│   ├── firebase.ts                     # Client Firebase initialization
│   └── firebase-admin.ts               # Server Firebase Admin SDK helper
│
├── public/                             # Public static files
│   ├── manifest.json                   # PWA manifest
│   ├── sw.js                           # Offline service worker
│   └── logo.svg                        # Logo asset
│
├── scripts/
│   └── push-curated-schemes.ts         # CLI script to run the pipeline and seed Firestore
│
├── types/
│   └── scheme.ts                       # TypeScript interfaces for schemes and subscribers
│
├── firestore.rules                     # Firestore Security Rules
├── firestore.indexes.json              # Composite database indexes
└── package.json                        # Project scripts and dependencies
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js**: Version 18.x or 20.x installed ([Download Node.js](https://nodejs.org/))
- **Firebase Project**: A free Firebase project on [Firebase Console](https://console.firebase.google.com/) (with Firestore & Auth enabled).

### 1. Clone the Repository
```bash
git clone https://github.com/PrashantJaybhaye/Digital-Welfare.git
cd Digital-Welfare
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env.local` file in the root folder and add your Firebase credentials:

```env
# Client Firebase Keys (Found in Project Settings > General)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Server Firebase Admin Credentials (Found in Project Settings > Service Accounts)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Admin Dashboard Passcode
NEXT_PUBLIC_ADMIN_SECRET=your_admin_passcode
```

> **Note:** Even without Firebase keys set up immediately, DigitalWelfare automatically loads its rich offline fallback catalog (`lib/fallback-schemes.ts`) so you can explore the entire UI right away!

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💻 Available Scripts

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Starts the local Next.js development server at `localhost:3000` |
| `npm run build` | Builds the optimized production application and checks types |
| `npm run start` | Runs the production build |
| `npm run lint` | Runs ESLint to check for code issues |
| `npm run push:schemes` | Runs the 10-stage pipeline via CLI and seeds Firestore |
| `npm run db:seed` | Shortcut alias for `npm run push:schemes` |

---

## 🔒 Security & Privacy

- **Data Protection**: Scheme search and public browsing require zero personal data and collect no tracking cookies.
- **Role-Based Access Control (`firestore.rules`)**: Public users have read-only access to schemes. Only authorized administrators can write or modify scheme records.
- **Server-Side Security**: Administrative actions (like portal synchronization) execute solely on server runtimes via Firebase Admin SDK. Master keys are never exposed to the client.

---

## 🗺️ What's Next (Roadmap)

- [ ] **Voice Search in Regional Languages**: Speak to search schemes in Hindi, Marathi, Tamil, or Telugu using speech recognition.
- [ ] **DigiLocker Integration**: One-click verification of Aadhaar, caste certificates, and marksheets.
- [ ] **AI Application Assistant**: Step-by-step interactive helper for filling out complex government forms.
- [ ] **WhatsApp Bot**: Check eligibility and receive scheme alerts directly on WhatsApp.

---

## 🤝 Contributing & Feedback

Contributions, feature suggestions, and scheme corrections are warmly welcome!
- If you find a bug or missing scheme, please open an [Issue](https://github.com/PrashantJaybhaye/Digital-Welfare/issues).
- Want to contribute code? Feel free to submit a [Pull Request](https://github.com/PrashantJaybhaye/Digital-Welfare/pulls).

---

<div align="center">
  <sub>Built with ❤️ to empower Indian citizens • Digital India & Social Welfare Initiative</sub>
</div>
