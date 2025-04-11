FROM oven/bun:1.2.9-debian@sha256:f7cb543a10e70000fc2f13b578486d29143901e3a4be15a96c851b3771831b21

WORKDIR /app

COPY package*.json bun.lock ./
RUN bun i --prod --frozen-lockfile

COPY . .

CMD ["bun", "server.js"]
