# Production Environment (Vercel PRO)

This document lists the **required environment variables**, **feature flags**, and **security expectations** for deploying this app on **Vercel PRO**.

## Node / Build

- **Node.js:** set Vercel to **Node 20.x** (project requires `"node": "20.x"` in `package.json`).
- **Build command:** `npm run build`
- **Lint command (CI):** `npm run lint`

## Required Environment Variables (Production)

### Supabase (Required)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; **never** expose to client)

### Auth / Internal Calls (Recommended)

- `INTERNAL_WORKER_SECRET`
  - Used as a shared secret for internal-only requests via header `x-internal`.
  - If not set, “internal bypass” is disabled.

### Stripe (If billing is enabled)

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

### Upstash Redis (Recommended; required for full rate-limit + queues)

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### QStash (If background jobs are enabled)

Vercel/Upstash QStash signature verification is used on `/api/webhooks/qstash`.

- QStash env vars required by Upstash SDK (as configured in your Vercel project)

### Providers (Only if used)

- `MISTRAL_API_KEY` (embeddings / RAG)
- `OPENROUTER_API_KEY` (+ optional `OPENROUTER_HTTP_REFERER`, `OPENROUTER_X_TITLE`)
- `GITHUB_TOKEN` (repo sync / PR automation)

## Production Feature Flags (Recommended Defaults)

Set these in **Vercel Production**:

- `ENABLE_DEBUG_ENDPOINTS=false`
  - When unset or not `"true"`, debug/legacy endpoints return **404** in production.
- `ENABLE_GITHUB_PR_WRITE=false`
  - Keeps `/api/patch/apply_to_github_pr` disabled (404) unless explicitly enabled.

## Internal-only Requests

Some endpoints (debug/legacy/high-risk) require an internal header:

- Header: `x-internal: <INTERNAL_WORKER_SECRET>`

Do **not** send this header from browsers. Use it only from server-to-server calls (cron/worker/backend).

## Endpoint Security Expectations

### User-authenticated endpoints

These endpoints require a logged-in user session and enforce tenant/user ownership checks:

- `/api/chamber/stream`
- `/api/session/start`
- `/api/session/interject`
- `/api/session/worker`
- `/api/repo/create`
- `/api/repo/sync`
- `/api/repo/embed`
- `/api/repo/ingest-text`
- `/api/rag/query`
- `/api/patch/generate`
- `/api/patch/preview`
- `/api/patch/apply`
- `/api/usage`
- `/api/stripe/*`
- `/api/admin/*`
- `/api/audit/*`

### Disabled by default in production

These return **404** in production unless explicitly enabled (and may require internal auth):

- `/api/debug/events` (requires `ENABLE_DEBUG_ENDPOINTS=true` + `x-internal`)
- `/api/repo/ingest` (legacy; requires `ENABLE_DEBUG_ENDPOINTS=true` + `x-internal`)
- `/api/chamber/interject` (legacy; requires `ENABLE_DEBUG_ENDPOINTS=true` + `x-internal`)
- `/api/github/ping` (debug; requires `ENABLE_DEBUG_ENDPOINTS=true`, and if `INTERNAL_WORKER_SECRET` is set then requires `x-internal`)
- `/api/patch/apply_to_github_pr` (high-risk; requires `ENABLE_GITHUB_PR_WRITE=true` + `x-internal`)

## Vercel Checklist (Go/No-Go)

- [ ] All **Supabase + Stripe** secrets set in **Production**
- [ ] `ENABLE_DEBUG_ENDPOINTS` is **false/unset**
- [ ] `INTERNAL_WORKER_SECRET` set (recommended)
- [ ] `ENABLE_GITHUB_PR_WRITE` is **false/unset**
- [ ] `npm run build` passes
- [ ] `npm run lint` passes (warnings allowed, no errors)
- [ ] `npm audit` reviewed and critical/high issues addressed before launch

