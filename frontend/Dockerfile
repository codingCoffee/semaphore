
FROM node:24.1.0-bookworm AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source code
COPY . .

ENV NEXT_PUBLIC_SERVER=https://zero.semaphore.chat

# Build the Next.js app
RUN npm run build

# Runtime stage
FROM node:24.1.0-bookworm AS runtime

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built app and public assets from build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Expose port 3000
EXPOSE 3000

# Use unprivileged user for security
USER node

# Start the Next.js app
CMD ["npm", "start"]

