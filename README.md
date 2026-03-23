<p align="center">
  <img src="https://img.shields.io/badge/🎬_ScriptForge-AI-FF4500?style=for-the-badge" alt="ScriptForge AI" />
  <img src="https://img.shields.io/badge/TypeScript-96%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Bilingual-EN_|_AR-F59E0B?style=for-the-badge" alt="Bilingual" />
</p>

<h1 align="center">🎬 ScriptForge AI</h1>

<p align="center">
  <strong>Turn any idea into a scroll-stopping video script in seconds.</strong><br/>
  AI agent prompt optimized for YouTube, TikTok, Reels & educational content.<br/>
  Supports English & Arabic.
</p>

<p align="center">
  <a href="https://scriptforgeaii.lovable.app/">🌐 Live Demo</a> &nbsp;·&nbsp;
  <a href="#-features">✨ Features</a> &nbsp;·&nbsp;
  <a href="#-tech-stack">⚙️ Tech Stack</a> &nbsp;·&nbsp;
  <a href="#-getting-started">🚀 Getting Started</a>
</p>

---

## 🔍 Overview

**ScriptForge AI** is an AI-powered video script generator that transforms raw ideas into production-ready scripts tailored for modern social media platforms. Whether you're creating YouTube long-form, TikTok hooks, Instagram Reels, or educational explainers — ScriptForge crafts engaging, platform-optimized scripts with the right tone, pacing, and structure.

---

## ✨ Features

### 🤖 AI Script Generation
- **Instant Script Creation** — Describe your idea, get a polished video script in seconds
- **Platform-Specific Optimization** — Scripts tailored for YouTube, TikTok, Instagram Reels & educational formats
- **Hook-First Writing** — Every script opens with a scroll-stopping hook designed to capture attention
- **Viral Framework** — Built-in patterns for engagement, retention, and call-to-action

### 🌍 Bilingual Support
- **English & Arabic** — Full support for both languages
- **RTL Layout** — Native right-to-left interface for Arabic content creators
- **Culturally Adapted** — Scripts that resonate with regional audiences

### 💰 Monetization & Auth
- **User Authentication** — Secure sign-up and login via Supabase Auth
- **Subscription Plans** — Built-in monetization with tiered access
- **Usage Tracking** — Monitor script generation credits and usage

### 🎯 Content Types
- 📹 YouTube long-form scripts with chapters & timestamps
- 📱 TikTok / Reels short-form with hooks & transitions
- 🎓 Educational & explainer content with clear structure
- 📢 Marketing & promotional scripts with CTAs

---

## ⚙️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [TypeScript](https://www.typescriptlang.org/) | Type-safe application logic (96%) |
| [React 18](https://react.dev/) | Component-based UI framework |
| [Vite](https://vitejs.dev/) | Lightning-fast build tooling |
| [Supabase](https://supabase.com/) | Auth, database (PostgreSQL), and backend |
| [shadcn/ui](https://ui.shadcn.com/) | Accessible, customizable UI components |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [PL/pgSQL](https://www.postgresql.org/) | Database functions & stored procedures |
| [Lovable](https://lovable.dev/) | AI-powered development platform |

---

## 📐 Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│         React + TypeScript + Vite            │
│              shadcn/ui + Tailwind            │
├──────────────┬──────────────────────────────┤
│   Auth Flow  │      Script Engine           │
│  (Supabase)  │   AI Prompt → Script Output  │
├──────────────┴──────────────────────────────┤
│              Supabase Backend                │
│   PostgreSQL  ·  Auth  ·  Edge Functions     │
│   Row-Level Security  ·  Realtime            │
└─────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm or [bun](https://bun.sh/)
- [Supabase](https://supabase.com/) project (for auth & database)

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
APP_BASE_URL=https://your-production-app-domain.com
```

### Installation

```bash
# Clone the repository
git clone https://github.com/3h0ll7/scriptforge-ai.git

# Navigate to project directory
cd scriptforge-ai

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The app will be available at `http://localhost:5173`

### Supabase Setup

```bash
# Link your Supabase project
npx supabase link --project-ref your-project-ref

# Apply database migrations
npx supabase db push
```

For the `create-checkout` edge function, set `APP_BASE_URL` in your Supabase project secrets so payment success/cancel redirects return users to the correct deployed domain.

### Build for Production

```bash
npm run build
# or
bun run build
```

---

## 📁 Project Structure

```
scriptforge-ai/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Route pages
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities & Supabase client
│   ├── services/          # AI script generation logic
│   └── styles/            # Global styles
├── supabase/
│   ├── migrations/        # Database schema migrations
│   └── functions/         # Edge functions
├── .env                   # Environment variables
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
└── tsconfig.json          # TypeScript configuration
```

---

## 🎯 Use Cases

| Audience | Use Case |
|----------|----------|
| 🎥 **YouTubers** | Generate structured long-form scripts with hooks, chapters, and CTAs |
| 📱 **TikTok Creators** | Craft viral short-form scripts with trending patterns |
| 🎓 **Educators** | Build clear, engaging explainer scripts for courses and tutorials |
| 📈 **Marketers** | Create promotional video scripts optimized for conversions |
| 🌐 **Arabic Creators** | Produce native Arabic scripts with culturally relevant tone |

---

## 🗺️ Roadmap

- [x] Core AI script generation engine
- [x] YouTube, TikTok & Reels templates
- [x] English & Arabic bilingual support
- [x] Supabase authentication & user accounts
- [x] Monetization & subscription tiers
- [ ] Script history & favorites
- [ ] Team collaboration & shared workspaces
- [ ] API access for third-party integrations
- [ ] Voice-over generation integration
- [ ] Analytics dashboard for script performance

---

## 🤝 Contributing

Contributions are welcome! Here's how to get involved:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-template`)
3. Commit your changes (`git commit -m 'feat: add new script template'`)
4. Push to the branch (`git push origin feature/new-template`)
5. Open a Pull Request

---

## 📊 Stats

<p align="center">
  <img src="https://img.shields.io/github/last-commit/3h0ll7/scriptforge-ai?style=flat-square&color=FF4500" alt="Last Commit" />
  <img src="https://img.shields.io/github/commit-activity/m/3h0ll7/scriptforge-ai?style=flat-square&color=06B6D4" alt="Commit Activity" />
  <img src="https://img.shields.io/github/repo-size/3h0ll7/scriptforge-ai?style=flat-square&color=10B981" alt="Repo Size" />
</p>

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev/) — AI-powered development platform
- Backend powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

---

<p align="center">
  <strong>🎬 Stop staring at a blank page. Start forging scripts.</strong><br/><br/>
  <a href="https://scriptforgeaii.lovable.app/">
    <img src="https://img.shields.io/badge/🚀_Try_ScriptForge-Live_Demo-FF4500?style=for-the-badge" alt="Try ScriptForge AI" />
  </a>
</p>
