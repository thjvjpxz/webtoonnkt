# Sử dụng Node.js 18 Alpine như base image
FROM node:18-alpine AS base

# Cài đặt các dependencies cần thiết cho Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Cài đặt pnpm globally
RUN npm install -g pnpm

# Copy package.json và pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Stage 1: Cài đặt dependencies
FROM base AS deps
RUN pnpm install --frozen-lockfile

# Stage 2: Build ứng dụng
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_API_URL=http://api.webtoonnkt.click/api
ENV NEXT_PUBLIC_OCR_BASE_URL=http://ocr-tts.webtoonnkt.click
ENV NEXT_PUBLIC_OCR_API_KEY=BC6325CDCBDD891515C1FEE7D7CB9

# Build ứng dụng
RUN pnpm build

# Stage 3: Production image
FROM node:18-alpine AS runner
WORKDIR /app

# Tạo user non-root để chạy ứng dụng
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy các file cần thiết từ builder
COPY --from=builder /app/public ./public

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Đặt user
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT 3000
ENV HOSTNAME 0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1

# Start ứng dụng
CMD ["node", "server.js"] 