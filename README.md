# Node.js 26 TypeScript Starter

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/nodejs-26-typescript-starter)

A minimal HTTP service on Node.js 26 LTS and TypeScript 7 — no framework, but a service that stays up.

## Why this exists

A one line program that prints a port and exits is not a service. A container that exits is a container the platform marks as stopped: there is nothing to route a domain to and nothing to health check. This starter listens, answers, and shuts down cleanly, which is the smallest thing that deserves to be called a service.

- Binds `PORT` (Railway injects it) on `0.0.0.0`, default `8080` locally.
- `GET /health` answers `{"status":"ok"}` plus uptime, wired as the Railway healthcheck.
- Graceful shutdown on `SIGTERM` and `SIGINT`: in-flight requests finish before the process exits. Railway sends `SIGTERM` before replacing a container; without a handler, in-flight requests are cut off on every deploy.
- Zero required environment variables. One service, no database, no volume.
- Deploys from a Dockerfile on the official `node` image, floating tag `node:26`, so new 26.x patches are picked up automatically (Ahmed's call, 2026-11-28). `node:26` and `node:26-trixie` are the same image today (Debian 13, trixie); the bare tag follows the Node team's default Debian if that ever moves.

## Versions (pinned exactly)

- Node.js **26.13.1** (LTS "Lithium", latest 26.x as of 2026-11-11; `.node-version` plus `engines: 26.x`). The Docker base image floats on `node:26` (Ahmed's call, 2026-11-28), so deploys pick up new 26.x patches automatically; `.node-version` records the version the code was last tested against.
- TypeScript **7.0.2**
- @types/node **26.6.6**
- tsx **4.23.15**

Node.js ships security releases for the 22.x, 24.x and 26.x lines on or shortly after Wednesday 11 November 2026. Expect the Node pin to move to the new 26.x patch after that date.

## Switching or upgrading with this template

This template deploys as one separate standalone service, so you can switch or upgrade Node without touching your existing setup:

1. Deploy this template as a new service next to the one you already run. Your old service keeps serving traffic.
2. Move your code into the new service and test it on the generated Railway domain.
3. When it is green, point your domain at the new service and remove the old one.

Upgrading Node later is the same shape: the runtime lives in the Dockerfile (`FROM node:26`, floating). A new 26.x patch is picked up automatically on the next deploy; to pin a specific patch instead, change the FROM line to `node:26.x.y`. The service comes up on the new version with the same healthcheck and shutdown behaviour. No reconfiguration, no extra services to wire.

## Endpoints

| Method | Path | Does |
| ------ | ---- | ---- |
| GET | `/` | Lists the endpoints |
| GET | `/health` | `{"status":"ok"}` plus `uptimeSeconds` |
| GET | `/echo?message=hi` | Echoes the `message` parameter, 400 when it is missing |

Unknown routes return a 404 JSON body. Handler errors return a 500 JSON body.

## Run locally

```sh
npm install
npm run dev        # watch mode with tsx
npm run build      # tsc -> dist/
npm start          # node dist/index.js
```

Then open `http://localhost:8080/` and `http://localhost:8080/health`.

## Variables

| Variable | Required | What it does |
| -------- | -------- | ------------ |
| `PORT` | No | The port the server binds; Railway sets it automatically. Defaults to `8080`. |

## Verified locally

Verified locally on 2026-11-11 with Node 26.13.1: `npm install` clean, `npx tsc --noEmit` 0 errors, `npm run build` succeeds, and the built server answers `GET /` 200, `GET /health` 200, `GET /echo?message=hi` 200, `GET /echo` 400, and exits 0 on `SIGTERM`. See `docs/local-test-2026-11-11.md` for the full evidence.

## Verified live on Railway 2026-11-20

A fresh deploy of this template on Railway (Hobby plan) passed
on the first attempt: Railpack build on Node 26.13.1, healthcheck
passed, `GET /` 200, `GET /health` returned `{"status":"ok"}`,
`GET /echo?message=hi` echoed the message, and `GET /echo`
without the parameter returned 400 with the designed error body.
The test project was deleted right after verification (cost:
$0.0001).

## Still untested

- Running cost over a full day (a short test deploy cost
  $0.0001; a full day has not been measured).
