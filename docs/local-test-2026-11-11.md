# Local parity test — Node.js 26.13.1 pin bump (2026-11-11)

Pin bump only: `.node-version` 26.13.0 → **26.13.1** (Node.js security
release of 11 Nov 2026; 24.x → 24.22.3 and 22.x → 22.23.5 the same day).
No code, dependency, or config change. TypeScript 7.0.2, tsx 4.23.15,
@types/node 26.6.6 unchanged (lockfile regenerated, versions identical).

## Tooling

- Node **26.13.1** (npm 11.20.0) at `~/workspace/tools/node-v26.13.1-linux-x64/`,
  tarball SHA256 verified against the official SHASUMS256.txt.
- Extraction note: plain `tar -xf` fails on ownership in this VM; use
  `tar --no-same-owner -xf` (same lesson as the MySQL tarball).

## Results (all with Node 26.13.1)

- `npm install`: clean, **0 vulnerabilities**.
- `npx tsc --noEmit`: **0 errors**.
- `npm run build`: succeeds.
- Built server (`node dist/index.js`, PORT 8080):
  - `GET /` → **200**
  - `GET /health` → **200**, body `{"status":"ok","uptimeSeconds":2}`
  - `GET /echo?message=hi` → **200**
  - `GET /echo` → **400**
- `SIGTERM` → log shows `Received SIGTERM, shutting down gracefully...`,
  process exits **0**.

## Harness notes (not template bugs)

- The first two SIGTERM measurements were wrong because the test shell
  backgrounded a chained `&&` list, so the killed PID was the wrapper
  subshell, not node (exit 143, then an orphan held port 8080 and the
  next run failed EADDRINUSE). Kill orphans by exact PID, never
  `pkill -f` with a pattern that appears in your own command line.
  The clean run (node started as its own background job, real PID
  captured) exits 0.

## Secret scan

- Grep for keys, tokens, private keys, and credential assignments across
  the repo (excluding node_modules, dist, package-lock.json): **clean**.

## Still untested

- Live Railway deploy, Nixpacks build on Railway's side, first-day cost.
  (Unchanged from the 2026-11-06 test.)
