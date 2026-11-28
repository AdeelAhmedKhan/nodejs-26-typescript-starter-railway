# Local parity test — Node.js 26 TypeScript Starter (Express + static), 2026-11-28

Conversion: the starter changed from a plain `node:http` API to an
Express 5 app serving a static landing page from `public/` plus the
same JSON API (`/health`, `/echo`). Ahmed's call, 2026-11-28, to
mimic the leading Node template (alphasecio/nodejs, 21,988 projects)
while keeping Node 26 and the official Docker image.

## What ran

- `npm run typecheck` (`tsc --noEmit`): 0 errors.
- `npm run build` (`tsc`): clean, `dist/index.js` produced.
- Built server run locally on port 18080, then probed:
  - `GET /` → HTTP 200, 1,391 bytes, the landing page HTML
    (`public/index.html`).
  - `GET /health` → HTTP 200, `{"status":"ok","uptimeSeconds":2}`.
  - `GET /echo?message=hi` → HTTP 200, `{"message":"hi"}`.
  - `GET /echo` (no parameter) → HTTP 400,
    `{"error":"Missing required query parameter: message"}`.
  - `GET /missing` → HTTP 404, `{"error":"Not found"}`.
- SIGTERM: `timeout --signal=TERM --preserve-status` — the server
  logged "Received SIGTERM, shutting down gracefully..." and exited
  with code 0.

## Honest note on the runtime

The local run used the VM's Node 24.22.1 (the machine has no Node 26
installed), while the Dockerfile base is the official `node:26`
image. The code paths exercised here (Express routing, static
serving, JSON API, graceful shutdown) are the same ones the live
deploy runs. The live Railway test after the push is the check that
runs the real Node 26 runtime.

## Still to verify live

- Fresh deploy of the converted template on Railway (Dockerfile
  build on `node:26`), same endpoint checks, then delete the test
  project.
