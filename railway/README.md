# Node.js 26 TypeScript Starter

A minimal HTTP service on Node.js 26 LTS and TypeScript 7 — no framework, but a service that stays up. It listens on Railway's `PORT`, answers a `/health` check, and shuts down gracefully on `SIGTERM`, so deploys never cut in-flight requests short.

One service, no database, no volume, zero required variables. Railway Nixpacks auto-detects Node from `.node-version` (26.13.0, pinned exactly).

Verified locally on 2026-11-06 (install, typecheck, build, live run of all endpoints). A live Railway deploy has NOT happened yet, and first-day cost is untested.
