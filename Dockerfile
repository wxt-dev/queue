FROM oven/bun:1.4.2-alpine AS base
WORKDIR /app
COPY package.json package.json
COPY bun.lock bun.lock
RUN bun install --production --ignore-scripts --frozen-lockfile
COPY . .
ENTRYPOINT ["bun", "src/main.ts"]
