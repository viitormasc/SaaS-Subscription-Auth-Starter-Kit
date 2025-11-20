# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.19.0
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install all deps (including dev)
COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
RUN VITE_API_URL=${VITE_API_URL} npm run build

# Production stage
FROM caddy:2-alpine as production
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=builder /usr/src/app/dist /srv

