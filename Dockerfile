FROM node:20-alpine AS builder
WORKDIR /app

# Declare build-time args for all VITE_ env vars (Render passes these in)
ARG VITE_API_URL
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Make them available as env vars so Vite can embed them at build time
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID

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
