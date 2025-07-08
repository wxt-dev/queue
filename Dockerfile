FROM oven/bun AS base
WORKDIR /app
COPY package.json package.json
COPY bun.lock bun.lock
RUN bun install --production --ignore-scripts
COPY . .
ENTRYPOINT ["bun", "src/main.ts"]
