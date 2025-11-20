#only use on production - rate limiter

FROM caddy:2-builder AS builder

RUN xcaddy build \
  --with github.com/mholt/caddy-ratelimit

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
