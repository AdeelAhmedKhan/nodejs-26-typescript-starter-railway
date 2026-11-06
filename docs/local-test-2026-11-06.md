# Local parity test — Node.js 26 TypeScript Starter — 2026-11-06

Tester ran every step by hand on this VM with the pinned Node 26.13.0.
Nothing here is a live Railway deploy.

## Versions pinned (verified at the source)

| Package | Pinned | Verified |
| ------- | ------ | -------- |
| Node.js | **26.13.0** | nodejs.org/dist/index.json, 2026-11-06: latest 26.x is v26.13.0 (2026-10-28, LTS "Lithium"). No newer 26.x patch exists. |
| TypeScript | **7.0.2** | npm registry, `npm view typescript@7 version` → 7.0.2 |
| @types/node | **26.6.6** | npm registry, `npm view @types/node@26 version` → latest 26.x is 26.6.6 |
| tsx | **4.23.15** | npm registry, `npm view tsx version` → 4.23.15 |

Node 26.13.0 tarball: downloaded from nodejs.org/dist/v26.13.0/,
SHA256 checked against the official SHASUMS256.txt — `node-v26.13.0-linux-x64.tar.xz: OK`
(`d28a96af6c38596f6d9d97c0ee531c13d238d757742387d1928de822d959e997`).
Extracted with `tar --no-same-owner` to `~/workspace/tools/node-v26.13.0-linux-x64/`.
`node --version` → v26.13.0, `npm --version` → 11.20.0. No system packages installed.

Note: Node.js ships security releases for 22.x/24.x/26.x on or shortly
after Wed 11 Nov 2026. Expect the Node pin to move to the new 26.x patch
after that date, with a full re-test before any publish.

## Install

```
$ npm install        (with Node 26.13.0, npm 11.20.0)
found 0 vulnerabilities
```

`package-lock.json` generated (lockfileVersion 3, 53 packages). Lockfile
pins confirmed: typescript 7.0.2, tsx 4.23.15, @types/node 26.6.6
(esbuild 0.28.2 transitive, via tsx).

One npm warning: `esbuild@0.28.2 (postinstall: node install.js)` install
script not yet covered by allowScripts. The esbuild platform binary is
present in `node_modules/@esbuild/linux-x64/bin/` and `npx tsx` runs
(see dev smoke test below), so this warning did not block anything.

## Typecheck and build

```
$ npm run typecheck   # tsc --noEmit
typecheck exit=0      # 0 errors

$ npm run build       # tsc -> dist/
build exit=0
dist/index.js + dist/index.js.map produced
```

## Live run of the built server (Node 26.13.0, PORT=8080)

```
$ PORT=8080 node dist/index.js
Listening on port 8080

GET /                  -> 200 {"name":"Node.js 26 TypeScript Starter","endpoints":[{"method":"GET","path":"/","description":"List the endpoints"},{"method":"GET","path":"/health","description":"Service health and uptime"},{"method":"GET","path":"/echo?message=hi","description":"Echo the message query parameter"}]}
GET /health            -> 200 {"status":"ok","uptimeSeconds":1}
GET /echo?message=hi   -> 200 {"message":"hi"}
GET /echo              -> 400 {"error":"Missing required query parameter: message"}
GET /nope              -> 404 {"error":"Not found"}
```

Response bodies were read in full for every check, not just the status.

## Graceful shutdown

```
$ kill -TERM <server pid>
Received SIGTERM, shutting down gracefully...
SIGTERM exit code=0
```

## Dev path smoke test (tsx, PORT=8081)

`npx tsx src/index.ts` served `GET /health` → 200 `{"status":"ok"}`.
Note: sending SIGTERM to the `tsx` wrapper exits 143 (the wrapper is
killed; the signal is not forwarded to its child node process, which
kept serving until killed separately). This is dev-only behaviour:
Railway runs `node dist/index.js` (the production start path), which
was verified above to exit 0 on SIGTERM. All test processes were
killed afterwards and both ports verified free.

## Secret scan

```
$ grep -rniE "password|passwd|secret|api[_-]?key|token|bearer|AKIA...|-----BEGIN ... PRIVATE KEY-----|xox[baprs]-|ghp_...|sk-..." --exclude-dir=node_modules --exclude-dir=dist --exclude=package-lock.json .
```

One match only: the word "Secret" in `railway/AGENTS.md` prose
("Secret scan clean across the whole repo") — a false positive, no
credential. No `.env` file exists. Scan result: **clean**.

## Result

Local parity test: **PASS**. `dist/` was removed after verification
(it is gitignored and regenerates with `npm run build`).

## Still untested

- A live Railway deploy has NOT happened yet.
- There is no Dockerfile in this template, so there is no Docker image
  build to test; the Railway Nixpacks build is untested.
- First-day cost on Railway is untested.
