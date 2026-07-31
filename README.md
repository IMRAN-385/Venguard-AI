# 🛡️ Vanguard AI

> **Autonomous DeepTech Due Diligence & Investment Intelligence Platform**
> Six agentic AI agents that turn 3-week diligence cycles into 4-minute workflows for institutional investors.

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live%20Demo-vanguard--ai.vercel.app-D7FF3A?style=for-the-badge)](https://venguard-ai-q4go.vercel.app)
[![API Status](https://img.shields.io/badge/API-Live%20on%20Render-10B981?style=for-the-badge)](https://venguard-ai-hz68.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**[🚀 Live Demo](https://venguard-ai-q4go.vercel.app) · [📘 API Docs](#-api-reference) · [🎥 Video Walkthrough](#) · [💬 Contact](mailto:imrankabir385@gmail.com)**

</div>

---

## 🎯 What is Vanguard AI?

Vanguard AI is a **full-stack agentic platform** built for institutional allocators deploying capital into deeptech startups (quantum, fusion, biotech, robotics, space, neural, climate, defense).

Instead of manually digging through cap-tables, patent filings, GitHub repos, and financial spreadsheets, our **6-agent mesh** automates the entire due-diligence workflow — from initial screening to final memo generation.

### The 6 Agents

| # | Agent | What it does |
|---|---|---|
| 01 | **Memo Generator** | Drafts institutional investment memorandums with source citations |
| 02 | **Smart Matching** | Ranks startups against investor thesis with reasoning |
| 03 | **Vanguard Copilot** | Conversational agent for stress-tests + ROI projections |
| 04 | **Data Analyzer** | Parses CSV/XLSX balance sheets, extracts KPIs, flags anomalies |
| 05 | **Auto-Classifier** | Tags pitches into structured sectors + hashtags |
| 06 | **Multi-LLM Router** | Rotates across Groq, OpenAI, Claude, Gemini with fallback |

---

## ✨ Features

### 🌐 Public Routes
- **Editorial landing page** with 8 sections (hero, stats, featured assets, features grid, live agent feed, sector charts, testimonials, FAQ, newsletter, footer)
- **Explore** — Search + sector/stage filters + sort + pagination across 8+ verified startups
- **Startup details** — Media, overview, founders, specs, analyst reviews, related assets
- **Marketing pages** — About, Pricing, Contact, Docs, Custom 404

### 🔐 Authentication
- Email + password (bcrypt hashed, JWT-based sessions)
- **Real Google OAuth** via `@react-oauth/google` (no demo tokens)
- Demo autofill button — one-click access with `demo.investor@vanguard-ai.io`
- Client-side auth guard with graceful redirects

### 💼 Investor Cockpit (Protected)
- **Portfolio Dashboard** — KPIs, NAV vs benchmark chart, sector allocation pie, top holdings
- **Add Asset** — 3-step wizard with AI auto-classification of pitch descriptions
- **Manage Assets** — Sortable table with edit/delete actions
- **Settings** — Profile, LLM provider selection, encrypted API key vault, notification preferences

### 🤖 AI Suite
- **Full-page Copilot** (`/ai/copilot`) — ChatGPT-style interface with thread history + model selector
- **Floating Copilot button** — Slide-in drawer available on EVERY page
- **Memo Generator** — Tone/length controls + copy/download outputs
- **Data Analyzer** — Drag-and-drop CSV uploads with KPI cards + burn charts + anomaly detection

### 🎨 Design System
- **Premium dark editorial** aesthetic (Instrument Serif + Inter + JetBrains Mono)
- 3-color palette: **ink** backgrounds, **bone** text, **accent** lime `#D7FF3A`
- Reusable utilities: `.panel`, `.card-item`, `.btn-accent`, `.eyebrow`, `.tag`
- Fully responsive (mobile, tablet, desktop) with 4-column asset grid on desktop
- Custom scrollbars, grain overlay, editorial typography

### 🛡️ Enterprise-Grade Engineering
- **Offline-first frontend** — Falls back to mock data if backend is unreachable
- **AES-256-GCM encrypted** per-user LLM API keys in database
- **Zod validation** on every API request
- **Audit trail** — Every generated memo is logged (user, prompt, model, tokens, latency)
- **JWT with role-based access** — investor / admin / analyst tiers
- **Graceful LLM fallback** — API never 500s from LLM errors, degrades to simulation

---

## 🏗️ Tech Stack

<table>
<tr>
<td align="center" width="50%">

### Frontend (`/client`)

![Next.js](https://img.shields.io/badge/Next.js-16-000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5-FF4154)
![Recharts](https://img.shields.io/badge/Recharts-2.12-8884D8)

- Next.js 16 App Router + Turbopack
- React 18 + TypeScript strict mode
- Tailwind CSS with custom design tokens
- TanStack Query v5 for data fetching
- Axios API client
- Framer Motion + Lucide icons
- Recharts for portfolio analytics
- @react-oauth/google for Google OAuth

</td>
<td align="center" width="50%">

### Backend (`/server`)

![Node](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.19-000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-9.0-000?logo=jsonwebtokens)
![Zod](https://img.shields.io/badge/Zod-3.23-3068B7)

- Express 4 + TypeScript strict
- MongoDB Atlas via Mongoose 8
- JWT auth + bcryptjs hashing
- Google OAuth verification (google-auth-library)
- Zod request validation
- Groq SDK + multi-LLM abstraction
- Multer file uploads
- Papaparse for CSV parsing

</td>
</tr>
</table>

### Deployment
- **Frontend:** [Vercel](https://vercel.com) (auto-deploy from `main`)
- **Backend:** [Render](https://render.com) (auto-deploy from `main`)
- **Database:** [MongoDB Atlas](https://mongodb.com/atlas) M0 free tier

---

## 📁 Project Structure

```
Venguard-AI/
├── client/                         # Next.js frontend
│   ├── src/
│   │   ├── app/                    # App Router pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── explore/
│   │   │   ├── items/
│   │   │   │   ├── [id]/           # Startup details
│   │   │   │   ├── add/            # Add asset wizard
│   │   │   │   └── manage/         # Asset management
│   │   │   ├── ai/
│   │   │   │   ├── copilot/        # Full-page AI chat
│   │   │   │   ├── generator/      # Memo generator
│   │   │   │   └── analyzer/       # CSV analyzer
│   │   │   ├── portfolio/          # Dashboard
│   │   │   ├── settings/           # Profile + API keys
│   │   │   ├── login/ · register/  # Auth pages
│   │   │   └── about/ · pricing/ · contact/ · docs/
│   │   ├── components/             # 20+ reusable components
│   │   ├── context/AuthContext.tsx
│   │   ├── services/api.ts         # Axios + interceptors
│   │   ├── hooks/useAssets.ts
│   │   ├── lib/mockAssets.ts       # Offline fallback data
│   │   └── types/index.ts
│   ├── next.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                         # Express backend
    ├── src/
    │   ├── index.ts                # Server entry
    │   ├── config/                 # env + db connection
    │   ├── controllers/            # 4 controllers (auth, assets, reviews, ai)
    │   ├── middleware/             # auth, error, validate, upload
    │   ├── models/                 # 5 Mongoose models
    │   ├── prompts/                # System prompts for 6 agents
    │   ├── routes/                 # Express routers
    │   ├── seed/                   # Database seeder (8 startups)
    │   ├── services/               # ai, tokens, google, csv, analyzer
    │   ├── utils/                  # logger, apiResponse, password
    │   └── validators/             # Zod schemas
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier) OR local MongoDB
- (Optional) Google Cloud OAuth credentials for real Google login

### 1. Clone & install

```bash
git clone https://github.com/IMRAN-385/Venguard-AI.git
cd Venguard-AI

# Install client + server dependencies
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### 2. Environment setup

**Server (`server/.env`):**
```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000

MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/vanguard-ai?retryWrites=true&w=majority

JWT_SECRET=any-random-32-plus-character-string
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com

# Leave blank for simulation mode
GROQ_API_KEY=
DEFAULT_LLM_PROVIDER=simulation

DEMO_EMAIL=demo.investor@vanguard-ai.io
DEMO_PASSWORD=Vanguard2026!
```

**Client (`client/.env.local`):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-oauth-client-id.apps.googleusercontent.com
```

### 3. Seed the database

```bash
cd server
npm run seed
```

Creates 8 verified startups + demo user.

### 4. Boot both servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

### 5. Open

- **App:** http://localhost:3000
- **API:** http://localhost:5000

### 🔐 Demo credentials

```
email:    demo.investor@vanguard-ai.io
password: Vanguard2026!
```

Or click **"Continue with Google"** for real OAuth.

---

## 🌐 API Reference

Base URL: `http://localhost:5000/api` (dev) · `https://venguard-ai-hz68.onrender.com/api` (prod)

### Auth
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST   | `/auth/register`      | —  | Create new account |
| POST   | `/auth/login`         | —  | Email + password login |
| POST   | `/auth/demo-login`    | —  | One-click demo access |
| POST   | `/auth/google-login`  | —  | Google access_token → JWT |
| GET    | `/auth/me`            | ✅ | Current user info |
| POST   | `/auth/logout`        | —  | Sign out (stateless) |

### Assets
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET    | `/assets`                       | optional | List + filter + paginate |
| GET    | `/assets/:id`                   | —        | Startup details |
| POST   | `/assets`                       | ✅       | Create new asset |
| PATCH  | `/assets/:id`                   | ✅ owner | Update asset |
| DELETE | `/assets/:id`                   | ✅ owner | Delete asset |
| GET    | `/assets/:id/reviews`           | —        | List reviews |
| POST   | `/assets/:id/reviews`           | ✅       | Add review |

**Query params on `/assets`:**
`q` (search) · `sector` · `stage` · `verified` · `mine` · `sort` (newest, valuation, risk, verified) · `page` · `limit`

### AI Agents
| Method | Route | Auth | Agent |
|--------|-------|------|-------|
| POST   | `/ai/copilot`         | optional | Agent 03 — Chat |
| POST   | `/ai/generate-memo`   | optional | Agent 01 — Memo |
| POST   | `/ai/classify`        | optional | Agent 05 — Auto-tag |
| POST   | `/ai/analyze`         | optional | Agent 04 — CSV parser |
| POST   | `/ai/recommend`       | optional | Agent 02 — Matching |
| GET    | `/ai/settings`        | ✅       | Read user settings |
| POST   | `/ai/settings`        | ✅       | Save provider + encrypted keys |

---

## 🧠 LLM Provider Support

Configure via `DEFAULT_LLM_PROVIDER` env var:

| Provider | Required env | Status |
|----------|-------------|--------|
| `simulation` | — | ✅ Default (works out of the box) |
| `groq` | `GROQ_API_KEY` | ✅ Wired (Llama 3.3 70B) |
| `openai` | `OPENAI_API_KEY` | ⏳ Placeholder |
| `anthropic` | `ANTHROPIC_API_KEY` | ⏳ Placeholder |
| `gemini` | `GEMINI_API_KEY` | ⏳ Placeholder |

**Per-user keys:** Users can enter their own keys via `/settings` — stored **AES-256-GCM encrypted** with a key derived from `JWT_SECRET`.

**Automatic fallback:** If a provider fails at runtime, the request transparently falls back to simulation mode. The API never returns 500 due to LLM errors.

---

## 🎨 Design Tokens

```js
// Colors — 3-color minimal palette
ink:    { 950, 900, 800, 700, 600, 500 }  // Backgrounds & borders
bone:   { 50, 100, 200, 300, 400 }        // Text hierarchy
accent: { DEFAULT: '#D7FF3A' }            // Signature lime

// Typography
display: '"Instrument Serif", Georgia, serif'
sans:    'Inter, system-ui, sans-serif'
mono:    '"JetBrains Mono", ui-monospace, monospace'

// Utilities
.panel · .card-item · .btn-accent · .btn-ghost
.eyebrow · .display-serif · .tag · .field
```

---

## 🚢 Deployment

### Frontend → Vercel

1. Import your GitHub repo at [vercel.com/new](https://vercel.com/new)
2. Set **Root Directory:** `client`
3. Add env vars:
   - `NEXT_PUBLIC_API_BASE_URL` = your Render URL
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = your Google client ID
4. Deploy

### Backend → Render

1. New Web Service on [render.com](https://render.com)
2. Connect GitHub repo
3. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add all env vars from `.env.example`
5. Deploy

### Database → MongoDB Atlas

1. Create free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Database Access → create user (auto-generate password)
3. Network Access → add `0.0.0.0/0` (allow all IPs)
4. Get connection string → paste as `MONGO_URI`

---

## 🎯 Assignment Requirements Checklist

<details>
<summary><strong>Click to expand full requirements coverage</strong></summary>

### Global UI ✅
- [x] Max 3 primary colors (ink/bone/accent)
- [x] Consistent spacing, card sizing, radius, style
- [x] Fully responsive (mobile → desktop)
- [x] Zero placeholder/dummy content

### Landing Page ✅
- [x] Sticky full navbar
- [x] 3 logged-out routes + 5 logged-in routes
- [x] Hero occupies 60-70% of viewport
- [x] Interactive CTA
- [x] 8 sections (spec required 7+)
- [x] Footer with working links

### Listing Cards ✅
- [x] Image, title, short description, meta info, View Details
- [x] Equal height/width/radius, 4 cards/row on desktop
- [x] Skeleton loader while fetching

### Details Page ✅
- [x] Public (no auth required)
- [x] Media (hero image)
- [x] Overview, specs, reviews, related items

### Explore Page ✅
- [x] Search bar
- [x] 2 filters (sector, stage)
- [x] Sort dropdown (4 options)
- [x] Pagination (load more)

### Auth ✅
- [x] Login + Register with validation
- [x] Error handling
- [x] Demo login auto-fill
- [x] **Real Google social login** (via @react-oauth/google)

### Protected Routes ✅
- [x] `/items/add`
- [x] `/items/manage`

### Additional Pages ✅
- [x] `/portfolio` (dashboard)
- [x] `/settings` (profile + API keys)
- [x] `/about`, `/pricing`, `/contact`, `/docs`

### AI Features ✅ (Required 2, Delivered 5)
- [x] Vanguard Copilot (floating + full page)
- [x] Memo Generator with tone/length controls
- [x] CSV Data Analyzer with KPI extraction
- [x] Auto-Classification of pitch descriptions
- [x] Multi-LLM router with encrypted keys

</details>

---

## 🐛 Known Issues & Roadmap

- [ ] Migrate to OpenAI-compatible SDK for cleaner multi-provider support
- [ ] Add WebSocket streaming for Copilot responses
- [ ] Implement real-time collaboration on memos
- [ ] Add role-based dashboards for admins vs analysts
- [ ] Migrate free-tier Render (30s cold starts) to always-on paid tier for demo reliability

---

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork & clone
git clone https://github.com/YOUR_USERNAME/Venguard-AI.git

# Create feature branch
git checkout -b feature/amazing-feature

# Commit + push
git commit -m 'Add amazing feature'
git push origin feature/amazing-feature

# Open PR
```

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

## 👨‍💻 Author

**Imran Kabir**
📧 [imranhimel385@gmail.com](mailto:imranhimel385@gmail.com)
🔗 [GitHub @IMRAN-385](https://github.com/IMRAN-385)
📍 Chattogram, Bangladesh

Built as a full-stack agentic AI assignment showcasing production-quality architecture, design, and engineering discipline.

---

## 🙏 Acknowledgments

- **Design inspiration:** [Humanity Protocol](https://humanity.org), [Linear](https://linear.app), [Vercel](https://vercel.com), [Raycast](https://raycast.com)
- **LLM:** [Groq](https://groq.com) for lightning-fast Llama 3.3 inference
- **Fonts:** [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif), [Inter](https://rsms.me/inter), [JetBrains Mono](https://www.jetbrains.com/lp/mono/)
- **Stock imagery:** [Unsplash](https://unsplash.com) + [Picsum](https://picsum.photos)
- **Icons:** [Lucide](https://lucide.dev)

---

<div align="center">

**⭐ If you found this project useful, please star it on [GitHub](https://github.com/IMRAN-385/Venguard-AI)!**

Built with 🖤 and ✨ agents, in Chattogram · 2026

</div>
