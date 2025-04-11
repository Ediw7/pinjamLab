FROM oven/bun:1.2.9-debian@sha256:f7cb543a10e70000fc2f13b578486d29143901e3a4be15a96c851b3771831b21 AS builder
WORKDIR /app
COPY package*.json ./
RUN bun install --prod --frozen-lockfile
COPY . .
RUN bun run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
