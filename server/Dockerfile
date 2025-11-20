# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.19.0
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /usr/src/app

# Copy package files and install all deps (including dev)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

CMD ["npm","run","dev"]


# -----------------------------
# Final image
FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /usr/src/app

# Copy only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy build output and needed files
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# EXPOSE 2121
CMD ["node", "dist/server.js"]
