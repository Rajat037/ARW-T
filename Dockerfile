FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy backend package files, then install dependencies
COPY AR-Weath-Backend/package*.json ./AR-Weath-Backend/
RUN cd AR-Weath-Backend && npm ci

# Copy backend source
COPY AR-Weath-Backend ./AR-Weath-Backend

EXPOSE 3005
CMD ["node", "AR-Weath-Backend/server.js"]
