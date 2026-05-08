FROM node:20-alpine AS builder
WORKDIR /app

# Copy frontend and backend package files, then install dependencies
COPY package*.json .
COPY backend/package*.json ./backend/
COPY tsconfig*.json .
COPY vite.config.ts .
COPY tailwind.config.* .
COPY postcss.config.mjs .
COPY src ./src
COPY index.html .
COPY README.md .
RUN npm install

# Install backend dependencies
RUN cd backend && npm install

# Copy backend source and build frontend assets
COPY backend ./backend
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy backend source and dependencies
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend/package*.json ./backend/

EXPOSE 3005
CMD ["node", "backend/server.js"]
