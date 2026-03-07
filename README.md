# Muneerul Islam – Masjid Committee Management System

![Production CI](https://github.com/Samad-VP/muneerul-islam/actions/workflows/production.yml/badge.svg)
![Preview CI](https://github.com/Samad-VP/muneerul-islam/actions/workflows/preview.yml/badge.svg)

A full-stack web application for managing masjid operations — families, members, committees, finance, events, and announcements.

**Tech Stack:** Next.js 14 · Prisma · PostgreSQL · NextAuth · TailwindCSS

---

## Getting Started

```bash
# 1. Clone & install
git clone https://github.com/Samad-VP/muneerul-islam.git
cd muneerul-islam
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET

# 3. Push schema to database
npx prisma db push

# 4. (Optional) Seed sample data
npm run seed

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t muneerul-islam .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  muneerul-islam
```

Health check: `GET /api/health` → `{ "status": "ok", "timestamp": "...", "uptime": 123 }`

---

## CI/CD

| Branch            | Workflow      | Action                                                 |
| ----------------- | ------------- | ------------------------------------------------------ |
| `main`            | Production CI | Lint → Type-check → Build → Deploy to Render           |
| `dev`             | Preview CI    | Lint → Type-check → Build → Deploy to Render (staging) |
| PR → `main`/`dev` | Preview CI    | Lint → Type-check → Build (no deploy)                  |

**Required GitHub Secrets:** `NEXTAUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, `RENDER_DEPLOY_HOOK_MAIN`, `RENDER_DEPLOY_HOOK_DEV`

See [.env.example](.env.example) for full details.
