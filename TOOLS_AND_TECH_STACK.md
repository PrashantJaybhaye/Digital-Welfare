# 🛠️ Tools, Libraries & Technology Stack Analysis

This document provides a comprehensive technical breakdown of all libraries, dependencies, cloud services, and developer tooling utilized in **DigitalWelfare (Aayush)**.

---

## 📦 1. Core Frameworks & Runtime

| Tool / Library | Version | Role in Project | Technical Justification |
| :--- | :--- | :--- | :--- |
| **Next.js** | `16.3.1` | Full-stack Web Framework & App Router | Provides Server Components, Incremental Static Regeneration (ISR), API Route Handlers, Edge caching, and automated image/font optimization. |
| **React** | `19.2.8` | UI Library & Component Architecture | Powers dynamic client interactions, hooks (`useState`, `useEffect`, `useCallback`, `useMemo`), and React Suspense loading boundaries. |
| **React DOM** | `19.2.8` | DOM Renderer for React | Mounts React component trees into the browser DOM with support for concurrent rendering. |
| **Node.js** | `>= 18.x` | JavaScript Runtime Environment | Executes server-side route handlers, web scraping processes, and build compilation. |

---

## 🎨 2. Styling, Design System & UI Components

| Tool / Library | Version | Role in Project | Technical Justification |
| :--- | :--- | :--- | :--- |
| **Tailwind CSS** | `^4.0.0` | Utility-First CSS Engine | Next-generation styling engine providing zero-runtime styling, custom CSS variables, responsive design breakpoints, and fluid typography. |
| **@tailwindcss/postcss** | `^4.0.0` | PostCSS Plugin for Tailwind v4 | Integrates Tailwind CSS directly with the Next.js compilation pipeline. |
| **Lucide React** | `^1.31.0` | Iconography System | Clean, modern, lightweight SVG icons (`ShieldCheck`, `Lock`, `Key`, `Sparkles`, `RefreshCw`, `Download`, `Search`, etc.) ensuring consistent visual hierarchy. |
| **Vanilla CSS Animations** | Native | Micro-Animations & Glow Effects | Custom keyframes defined in `globals.css` for subtle pulse animations, glow backdrops, and modal transitions. |

---

## ☁️ 3. Backend, Database & Cloud Infrastructure

| Tool / Library | Version | Role in Project | Technical Justification |
| :--- | :--- | :--- | :--- |
| **Google Firebase SDK** | `^12.17.1` | Client Database & Authentication | Client-side SDK connecting to Cloud Firestore (`getDocs`, `collection`, `query`) and Firebase Auth (`signInWithEmailAndPassword`, `signOut`). |
| **Firebase Admin SDK** | `^14.2.0` | Privileged Server Execution | Server-side SDK used in API routes (`/api/sync-schemes`, `/schemes/page.tsx`) to perform secure database upserts with full administrative privileges. |
| **Cloud Firestore** | Cloud Service | NoSQL Document Database | Real-time, highly scalable NoSQL datastore managing `schemes` and `scheme_subscribers` collections with custom composite indexing (`firestore.indexes.json`). |
| **Firestore Security Rules** | v2 Engine | Database Access Control (RBAC) | Restricts write and delete access on scheme data strictly to authenticated administrators while keeping scheme search open for citizens. |

---

## 🕷️ 4. Data Scraping & Automated Ingestion

| Tool / Library | Version | Role in Project | Technical Justification |
| :--- | :--- | :--- | :--- |
| **Cheerio** | `^1.2.0` | Server-side HTML Parser | High-speed DOM scraping library that parses government gazette tables and portal pages directly inside Next.js serverless route handlers. |
| **Google Translate API (GTX)** | Cloud API | Regional Language Translation | Translates Marathi and Hindi government notifications into standardized English during data ingestion. |

---

## 📱 5. Progressive Web App (PWA) Tooling

| Component / Tool | File Location | Purpose & Implementation |
| :--- | :--- | :--- |
| **Web App Manifest** | `public/manifest.json` | Configures mobile app name, splash screen, theme colors (`#020617`), and icons for home-screen installation. |
| **Service Worker** | `public/sw.js` | Intercepts network requests and caches core application assets for offline access. |
| **PWA Bootstrap Component** | `components/PWARegister.tsx` | Automatically detects browser service worker support and registers the worker on mount. |

---

## ⚙️ 6. Developer Tooling & Quality Assurance

| Tool | Version | Role in Project |
| :--- | :--- | :--- |
| **TypeScript** | `^5.0.0` | Enforces strict static type checking, type inference, and interface definitions across the entire codebase. |
| **ESLint** | `^9.0.0` | Analyzes code for potential runtime bugs, deprecated patterns, and formatting inconsistencies. |
| **eslint-config-next** | `16.3.1` | Official Next.js linting rules enforcing best practices for App Router and Core Web Vitals. |
| **Turbopack** | Native (Next.js) | High-speed Rust-based bundler providing instant hot module replacement during local development. |

---

## 📊 Summary Architecture Map

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT BROWSER / PWA                     │
│    Next.js App Router (React 19) • Tailwind v4 • Lucide     │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
               ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │  Client Firestore    │        │  Next.js Server      │
    │  SDK (lib/firebase)  │        │  Route Handlers      │
    └──────────┬───────────┘        └──────────┬───────────┘
               │                               │
               │ (Security Rules Checked)      │ (Admin SDK)
               │                               │
               ▼                               ▼
    ┌──────────────────────────────────────────────────────┐
    │              GOOGLE CLOUD FIRESTORE                  │
    │      • Collection: schemes                           │
    │      • Collection: scheme_subscribers                │
    └──────────────────────────────────────────────────────┘
```
