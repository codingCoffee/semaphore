
FROM node:24.1.0-bookworm AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy app source code
COPY . .

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
COPY --from=build /app/drizzle.config.json ./drizzle.config.json

# Expose port 3000
EXPOSE 3000

# Use unprivileged user for security
USER node

# Start the Next.js app
CMD ["npm", "start"]

