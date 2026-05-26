# QA Monitor — AI Performance & QA Monitoring

A single-page React + Tailwind prototype implementing the PRD for an AI-driven QA monitoring platform for BPOs.

The system layers 8 AI agents on top of existing customer-support workflows to evaluate 100% of interactions (chat, voice, email), surface risks in real time, and feed a Human-in-the-Loop review pipeline.

## Run locally

No build step. Open `index.html` directly in any modern browser.

```bash
# or serve over http (recommended — some browsers block local file iframes)
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

The project is pure static HTML/JS — works on any static host (Vercel, Netlify, GitHub Pages, S3, etc.). No environment variables, no build pipeline.

For Vercel, the root `index.html` is auto-detected. For GitHub Pages, enable Pages → Source: `main` branch / `/ (root)`.

## File layout

```
/
├── index.html                  ← main app entry
├── QA Monitor - Canvas.html    ← Figma-style overview of all 14 screens
├── src/
│   ├── app.jsx                 ← top-level component + role routing
│   ├── shell.jsx               ← sidebar + topbar + role-filtered nav
│   ├── primitives.jsx          ← icons, buttons, drawer, info tooltips
│   ├── data.jsx                ← mock fixtures + screen-help content
│   ├── screens-hero.jsx        ← Overview, Live Monitoring, Review Queue
│   ├── screens-detail.jsx      ← Interaction drawer, Agent scorecard
│   └── screens-support.jsx     ← Trends, Reports, Sampling, Framework,
│                                  Alerts, Integrations, Audit, Team,
│                                  AI Response Gating
├── design-canvas.jsx           ← shared canvas-overview component
├── tweaks-panel.jsx            ← shared tweaks panel (brand-color picker)
└── README.md
```

## Features

- **4 roles** with filtered sidebars: Admin / Manager / Supervisor / QA Analyst
- **14 screens** covering monitoring, review, performance, QA ops, and settings
- **Live data** — real-time updates on Live Monitoring, animated charts on Trends
- **HITL Review Queue** with 7 trigger reason filters
- **AI Response Gating** with Agent and Supervisor views
- **QA Framework** with continuous posture slider (Conservative ↔ Aggressive)
- **AI–Human agreement** chart (model calibration over time)
- **Audit log** of every AI + human action
- **Tweakable brand color** — toggle Tweaks in the toolbar, pick any accent
- **"About this screen" panels** + targeted info icons on jargon terms

## Built with

- React 18 (via UNPKG CDN)
- Tailwind CSS (via JIT CDN)
- Recharts
- Babel standalone (in-browser JSX)

All CDN-loaded — no `npm install` required.
