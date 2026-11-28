# House rules — Node.js 26 TypeScript Starter

## Pins

- Pin every version exactly in `package.json` and `.node-version`.
  No caret ranges, no `latest`, no `-next` pre-release versions.
- Node 26.13.1 (LTS "Lithium"), Express 5.3.0, TypeScript 7.0.2,
  @types/node 26.6.6, @types/express 5.0.6, tsx 4.23.15. The local
  parity test ran against exactly these versions. The Docker base
  image floats on `node:26` (Ahmed's call, 2026-11-28), so deploys
  pick up new 26.x patches automatically; `.node-version` records
  the version the code was last tested against, not the version a
  deploy runs.
- Node.js ships security releases for 22.x, 24.x and 26.x on or
  shortly after Wed 11 Nov 2026. When the new 26.x patch lands,
  bump `.node-version` (and the README) to it and re-run the full
  parity test before any publish.

## Shape (never regress)

- Dockerfile on the official `node` image, floating tag `node:26`
  (Ahmed's call, 2026-11-28; supersedes the earlier no-Dockerfile
  Nixpacks shape). One service, no database, no volume, zero
  required env vars.
- Version pinning lives in `.node-version` (exact) and the
  `package.json` engines field (`26.x`).
- `railway.json` carries the healthcheck (`/health`) and the
  restart policy (ON_FAILURE, max 10 retries).
- `src/index.ts` is an Express 5 app serving static files from
  `public/` (the landing page at `GET /`) plus a small JSON API.
  Routes: `GET /` serves `public/index.html`, `GET /health`
  returns `{"status":"ok"}` plus uptimeSeconds,
  `GET /echo?message=hi` echoes the parameter and returns 400
  when it is missing. `express.json()` is on. Reads `PORT`
  (default 8080). Graceful shutdown on SIGTERM and SIGINT via
  `server.close` then `process.exit(0)`. 404 JSON for unknown
  routes, 500 JSON on handler error.
- `package-lock.json` is committed. `.gitignore` covers
  `node_modules/`, `dist/`, `.env`.

## Never fake a capability

- A test that did not run is "not tested". A live deploy that has
  not happened is "untested". Say so in the README and on the
  template page.
- The local parity test must actually run: install, typecheck,
  build, and a live run of the built server with `/` returning
  the landing page (HTML 200), `/health`, `/echo?message=hi`
  all returning 200, `/echo` returning 400, response bodies
  read, and a SIGTERM exit of 0.

## Publishing gate

1. Local parity test passes (evidence in `docs/`).
2. Secret scan clean across the whole repo, including tests and
   example env files. Every value must be a placeholder or a Railway
   generated marker.
3. The template page lists what is still untested.
4. Only then publish. Never push, deploy, or publish from this
   repo-ready task without a separate explicit yes.
5. `sourceRepo` in the template spec is set at publish time, once
   the GitHub repo exists. Do not invent a repo URL before then.
