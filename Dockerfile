# Stage 1 - Build
FROM node:20-alpine as builder

WORKDIR /app

# Copy package.json + lockfile
COPY package.json pnpm-lock.yaml ./

# Install deps
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy rest of source
COPY . .

# Build
RUN pnpm run build

# Stage 2 - Production
FROM node:20-alpine as production

WORKDIR /app

# Copy lockfile + package.json (for clarity)
COPY package.json pnpm-lock.yaml ./

# Copy built output and node_modules from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/src/main.js"]
