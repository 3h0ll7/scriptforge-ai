<p align="center">
  <a href="https://scriptforgeaii.lovable.app/">
    <img src="docs/assets/banner.svg" alt="ScriptForge AI — Discover ideas. Forge scripts." width="100%" />
  </a>
</p>

<p align="center">
  <a href="https://scriptforgeaii.lovable.app/"><img src="https://img.shields.io/badge/Live_demo-scriptforgeaii.lovable.app-EA4C89?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live demo" /></a>
  <img src="https://img.shields.io/badge/Free-No_sign--up-0D0C22?style=for-the-badge" alt="Free, no sign-up" />
  <img src="https://img.shields.io/badge/EN_%7C_%D8%B9%D8%B1%D8%A8%D9%8A-RTL_ready-0D0C22?style=for-the-badge" alt="English and Arabic" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase_Edge_Functions-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/github/last-commit/3h0ll7/scriptforge-ai?style=flat-square&color=EA4C89" alt="Last commit" />
</p>

<h3 align="center">Turn one idea into a platform-ready video script — hook, timestamps, B-roll, CTA and SEO tags — in seconds.</h3>

<p align="center">
  <a href="https://scriptforgeaii.lovable.app/"><b>Try it live</b></a> ·
  <a href="#-features">Features</a> ·
  <a href="#-how-it-works">How it works</a> ·
  <a href="#-run-it-locally">Run locally</a> ·
  <a href="#-بالعربي">بالعربي</a>
</p>

<br/>

<p align="center">
  <img src="docs/assets/demo.gif" alt="ScriptForge demo: typing an idea, filtering the idea gallery, auto-filling the form, switching to dark mode and Arabic" width="88%" />
</p>

---

## 💡 Why ScriptForge

> **Blank page → filmable script.** ScriptForge structures your idea the way short-form and long-form creators actually shoot: a scroll-stopping hook first, timed sections with visual direction, then a clear call to action.

- **Made for each platform** — pacing and length adapt to YouTube, TikTok, Reels, online courses and webinars.
- **Script to video** — turn the finished script into a detailed, scene-by-scene prompt for AI video tools.
- **Open to everyone** — no account, no paywall, full English & Arabic (RTL) support.

---

## ✨ Features

<table>
  <tr>
    <td width="33%" valign="top">
      <h4>🎬 Script generator</h4>
      Title options, a typed hook, timestamped sections with dialogue, visual direction and B-roll, a CTA, SEO tags and retention notes.
    </td>
    <td width="33%" valign="top">
      <h4>🎥 Video prompt builder</h4>
      Edit the hook and script, then build a production-ready prompt for text-to-video models — copy it in one click.
    </td>
    <td width="33%" valign="top">
      <h4>🧭 Idea gallery</h4>
      Dribbble-style starter ideas with platform mockups. Filter by platform; one click fills the whole form.
    </td>
  </tr>
  <tr>
    <td valign="top">
      <h4>📎 Bring your sources</h4>
      Add a video link, paste an article or transcript, or upload an image to ground the script.
    </td>
    <td valign="top">
      <h4>🌍 English · العربية</h4>
      Generate in English, Arabic or both. The interface switches to a native right-to-left layout.
    </td>
    <td valign="top">
      <h4>🌗 Light & dark</h4>
      A clean white/ink/pink design system with semantic tokens, responsive down to small phones.
    </td>
  </tr>
</table>

**Controls you get:** platform (YouTube · TikTok · Reels · Course · Webinar) · duration (30s → 15+ min) · tone (educational, entertaining, dramatic, casual, motivational) · target audience · key message.

---

## 🧠 How it works

```mermaid
flowchart LR
    A([💡 Idea or<br/>gallery pick]) --> B[Script parameters<br/>platform · duration · tone<br/>audience · sources]
    B -->|Generate| C{{generate-script<br/>Edge Function}}
    C --> D[📄 Script output<br/>hook · timed sections · CTA · SEO]
    D --> E[🎥 Video prompt builder]
    E -->|Build prompt| F{{enhance-prompt<br/>Edge Function}}
    F --> G([📋 Detailed video prompt])

    classDef pink fill:#EA4C89,stroke:#C2185B,color:#fff
    classDef ink fill:#0D0C22,stroke:#0D0C22,color:#fff
    class C,F pink
    class A,G ink
```

```mermaid
flowchart TB
    subgraph Browser["🖥️ Browser — React 18 + Vite SPA"]
        UI[Hero · Idea gallery · Script form]
        OUT[Script output · Video prompt builder]
        SET[Theme + language settings<br/>localStorage]
    end
    subgraph Supabase["⚡ Supabase"]
        GS[generate-script]
        EP[enhance-prompt]
    end
    AI[(🤖 Groq · OpenRouter · Lovable<br/>automatic fallback)]

    UI -- supabase.functions.invoke --> GS
    OUT -- supabase.functions.invoke --> EP
    GS --> AI
    EP --> AI
    GS -- structured JSON --> OUT
```

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/desktop-light.png" alt="Home page in light mode" /><p align="center"><sub>Hero & search — light</sub></p></td>
    <td width="50%"><img src="docs/screenshots/desktop-dark.png" alt="Idea gallery in dark mode" /><p align="center"><sub>Idea gallery — dark</sub></p></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/support-dialog.png" alt="Support dialog with USDT address" /><p align="center"><sub>Support dialog</sub></p></td>
    <td align="center"><img src="docs/screenshots/mobile-arabic.png" alt="Mobile layout in Arabic" width="55%" /><p align="center"><sub>Mobile — Arabic (RTL)</sub></p></td>
  </tr>
</table>

---

## 🛠️ Tech stack

| Layer | Tools |
|---|---|
| **UI** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), Framer Motion, Lucide icons |
| **Backend** | Supabase Edge Functions (Deno): `generate-script`, `enhance-prompt` |
| **AI** | Open-weight models via **Groq** (`openai/gpt-oss-120b`, free tier) → **OpenRouter** free models → Lovable AI Gateway, with automatic fallback |
| **Quality** | ESLint, Vitest, Testing Library, Playwright |
| **Hosting** | Lovable |

---

## 🚀 Run it locally

**Requirements:** Node.js 18+ and npm (or Bun), plus a Supabase project for the edge functions.

```bash
git clone https://github.com/3h0ll7/scriptforge-ai.git
cd scriptforge-ai
cp .env.example .env      # fill in your Supabase URL + publishable key
npm install
npm run dev               # http://localhost:8080
```

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=replace-with-your-supabase-publishable-key
```

<details>
<summary><b>Deploying the edge functions</b></summary>

```bash
npx supabase link --project-ref your-project-ref
npx supabase db push
npx supabase functions deploy generate-script
npx supabase functions deploy enhance-prompt
```

Both functions share `supabase/functions/_shared/ai.ts`, which tries each configured provider in order and moves on when one is out of credits, rate-limited or has retired a model. Set at least one key as a Supabase secret — never in `.env` or in git:

| Secret | Provider | Default models (strongest first) |
|---|---|---|
| `GROQ_API_KEY` | [Groq](https://console.groq.com/keys) — free tier | `openai/gpt-oss-120b`, `openai/gpt-oss-20b`; images: `qwen/qwen3.8-27b` → `llama-4-scout` |
| `OPENROUTER_API_KEY` | [OpenRouter](https://openrouter.ai/keys) — free models | `openai/gpt-oss-120b:free`, `deepseek/deepseek-chat-v3.1:free` |
| `LOVABLE_API_KEY` | Lovable AI Gateway (paid credits) | `google/gemini-3-flash-preview` |

Override any model list with comma-separated `GROQ_MODELS`, `GROQ_VISION_MODELS`, `OPENROUTER_MODELS` or `OPENROUTER_VISION_MODELS`.

```bash
npx supabase secrets set GROQ_API_KEY=your-groq-key
```

</details>

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 8080 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

---

## 📁 Project structure

```
scriptforge-ai/
├── docs/                       # README banner, demo GIF, screenshots
├── public/                     # Static assets
├── src/
│   ├── components/
│   │   ├── IdeaGallery.tsx     # Filterable starter ideas
│   │   ├── IdeaShot.tsx        # Platform mockup thumbnails
│   │   ├── ScriptForm.tsx      # Script parameters (accepts presets)
│   │   ├── ScriptOutput.tsx    # Generated script view
│   │   ├── VideoPromptBuilder.tsx
│   │   ├── SupportDialog.tsx   # USDT donation dialog
│   │   └── ui/                 # shadcn/ui primitives
│   ├── hooks/useAppSettings.tsx # Theme, language, EN/AR strings
│   ├── lib/                    # generateScript, idea templates, donation config
│   ├── pages/Index.tsx         # Hero · gallery · workspace
│   └── index.css               # Design tokens (light/dark)
├── supabase/
│   ├── functions/              # Edge functions
│   └── migrations/
└── AGENTS.md                   # Architecture rules for contributors & agents
```

---

## 🗺️ Roadmap

- [x] Script generation for YouTube, TikTok, Reels, courses & webinars
- [x] Video prompt builder
- [x] English & Arabic with RTL
- [x] Dribbble-inspired redesign, idea gallery, dark mode
- [x] Free public access, optional donations
- [ ] Save & export scripts (PDF / Markdown)
- [ ] More idea templates and niches
- [ ] Shareable script links
- [ ] Voice-over generation

---

## ❤️ Support the project

ScriptForge is free. If it saves you time, you can send a tip in **USDT on BNB Smart Chain (BEP20)**:

```
0x03d28429e4c9a0ae0d6fcc750ac4b1cf0bd41850
```

> ⚠️ Send **only USDT on BEP20**. Other coins or networks (TRC20, ERC20…) will be lost.

---

## 🇮🇶 بالعربي

<details>
<summary><b>اضغط لعرض الوصف بالعربي</b></summary>

<div dir="rtl">

### ScriptForge AI

حوّل فكرة واحدة إلى **سكربت فيديو جاهز للتصوير** خلال ثوانٍ: خطّاف (Hook) يوقف التمرير، أقسام بتوقيت زمني مع توجيه بصري ولقطات B-roll، دعوة للعمل، ووسوم SEO.

**المميزات**
- سكربتات مخصّصة لـ YouTube و TikTok و Reels والدورات والندوات.
- مُنشئ برومبت فيديو مفصّل مشهداً بمشهد لأدوات توليد الفيديو بالذكاء الاصطناعي.
- معرض أفكار جاهزة يملأ النموذج بضغطة واحدة.
- إرفاق رابط فيديو أو نص أو صورة كمصدر.
- واجهة عربية كاملة من اليمين لليسار، ووضع فاتح وداكن.
- مجاني بالكامل وبدون تسجيل دخول.

**التشغيل محلياً**

</div>

```bash
git clone https://github.com/3h0ll7/scriptforge-ai.git
cd scriptforge-ai && cp .env.example .env && npm install && npm run dev
```

<div dir="rtl">

**ادعم المشروع:** USDT على شبكة **BEP20** فقط — العنوان موجود في قسم *Support the project* أعلاه.

</div>
</details>

---

## 🤝 Contributing

Issues and pull requests are welcome. Please read [`AGENTS.md`](AGENTS.md) for the architecture rules, keep changes small, and run `npm run lint && npm test && npm run build` before opening a PR.

## 📜 License

No license file has been added yet, so all rights are reserved by the author by default.

---

<p align="center">
  Built by <a href="https://hassanaii.lovable.app"><b>Hassan Salman</b></a> with <a href="https://lovable.dev">Lovable</a>, <a href="https://supabase.com">Supabase</a> and <a href="https://ui.shadcn.com">shadcn/ui</a>.<br/><br/>
  <a href="https://scriptforgeaii.lovable.app/"><img src="https://img.shields.io/badge/🎬_Stop_staring_at_a_blank_page-Start_forging-EA4C89?style=for-the-badge" alt="Start forging scripts" /></a>
</p>
