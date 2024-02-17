FROM oven/bun AS base
WORKDIR /app
COPY package.json package.json
COPY bun.lockb bun.lockb
RUN bun install --production --ignore-scripts
COPY . .
ENTRYPOINT ["bun", "src/index.ts"]
