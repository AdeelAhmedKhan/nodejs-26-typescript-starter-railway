# Node.js 26 TypeScript Starter
# Base is the official node image, floating tag node:26. Deploys pick up
# new 26.x patches automatically (Ahmed's call, 2026-11-28).
# node:26 and node:26-trixie are the same image today (Debian 13, trixie);
# the bare tag follows the Node team's default Debian if that ever moves.
FROM node:26

WORKDIR /app

# Install dependencies first (cached unless package files change).
COPY package.json package-lock.json ./
RUN npm ci

# Build the TypeScript app.
COPY tsconfig.json ./
COPY src ./src
COPY public ./public
RUN npm run build

# The app reads PORT (default 8080) and binds 0.0.0.0.
EXPOSE 8080
CMD ["node", "dist/index.js"]
