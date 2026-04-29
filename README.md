# Oxerfy

**Your Growth. Our Mission.**

Oxerfy is a full-stack digital agency website built for businesses looking to grow online — offering WordPress Web Development, AI Automation, Meta Marketing, and Social Media Management. Based in Dhaka, serving clients worldwide.

🌐 Live: [oxerfy.vercel.app](https://oxerfy.vercel.app)

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS v4** — styling
- **Framer Motion** + **GSAP** — animations
- **Three.js** + **React Three Fiber** — 3D effects
- **Firebase** (Firestore + Storage) — database & file storage
- **React Helmet Async** — SEO meta management

---

## Features

- Multi-page layout: Home, About, Services, Portfolio, FAQ, Contact
- Secure Admin Panel for managing content dynamically
- Real-time Firebase Firestore database sync
- **Dynamic Portfolio** — project showcase updated live via Admin
- **AI Automation Section** — showcasing AI-powered service offerings
- **Testimonials** — animated client review columns
- **CountUp Stats** — animated impact metrics
- Custom animated cursor throughout the site
- Image uploads via Firebase Storage
- Fully responsive across all devices
- SEO optimized with React Helmet Async
- GSAP scroll-triggered animations
- Environment-variable-based configuration

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/oxerfy/oxerfy.git
cd oxerfy
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables
```bash
cp .env.example .env
```

Fill in your values in `.env` — refer to `.env.example` for all required keys.

### 4. Run locally
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## Deployment

Hosted on **Vercel**. Steps to deploy:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repository
3. Set **Framework Preset** to `Vite`
4. Add all environment variables from `.env.example` under:
   **Vercel Dashboard → Project → Settings → Environment Variables**
5. Click **Deploy**

> The `vercel.json` file is already configured for SPA routing — no extra setup needed.

---

## Firebase Setup

Create the following collections in your **Firestore** database:

```
site_assets     →  Dynamic images (hero, favicon, logo, etc.)
portfolio       →  Portfolio project entries
testimonials    →  Client testimonials
team            →  Team member profiles
faqs            →  Frequently asked questions
```

Configure your Firebase credentials in `.env` using the keys from `.env.example`.

---

## Project Structure
```
src/
├── components/         # Reusable UI components
│   ├── ui/             # Base UI elements (Button, Navbar, Skeleton…)
│   └── blocks/         # Larger section blocks (Hero, etc.)
├── lib/                # Firebase client & utility functions
├── pages/              # Page-level components
│   └── admin/          # Admin panel pages
└── App.tsx             # Root component & routing
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

---

## Development Notes

This project was developed with the assistance of **Google AI Studio** and **Claude (Anthropic)** — used for code generation, debugging, security hardening, and deployment guidance.

All architectural decisions, content, design direction, and final implementation were led and managed by **Kazi Shakib**.

---

## Author

**Kazi Shakib**
[Website](https://kazishakib.vercel.app) · [GitHub](https://github.com/thekazishakib) · [LinkedIn](https://linkedin.com/in/kazishakib) · [Instagram](https://instagram.com/thekazishakib)

---

© 2026 Kazi Shakib. All rights reserved.
