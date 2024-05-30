FROM oven/bun:1.1.10

WORKDIR /app/next-app

COPY package.json bun.lockb tsconfig.json ./

RUN bun install

COPY . .

RUN bun run lint && \
  bun run build

EXPOSE 3000

CMD ["bun", "run", "start"]
