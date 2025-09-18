# Ocean To‑do (Nuxt 3)

Modern, minimalist to‑do organizer with Ocean Professional theme.

Features:
- Lists: create, rename, delete
- Tasks: add, update (title, done, due date, priority), delete
- Responsive layout: top nav, left sidebar, main content
- Mock API via Nitro server routes under /api
- Theming via assets/styles/main.css

Setup
- npm install
- npm run dev

Environment
- Set NUXT_PUBLIC_API_BASE to point to a backend API if available; defaults to /api
- Example .env:
  NUXT_PUBLIC_API_BASE=/api

Notes
- Mock API stores data in Nitro storage (memory) for the session.
- Replace server/api handlers to integrate with your real backend.
