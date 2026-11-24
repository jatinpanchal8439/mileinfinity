#!/bin/bash
# ==============================================================================
# Hostinger Auto-Deployment Script for Mile Infinity
# ==============================================================================
echo "🚀 Starting Hostinger deployment..."

# 1. Install dependencies
if command -v bun &> /dev/null; then
  echo "📦 Installing with bun..."
  bun install --frozen-lockfile || bun install
  bun run build:node
elif command -v npm &> /dev/null; then
  echo "📦 Installing with npm..."
  npm install
  npm run build:node
fi

# 2. Touch restart file for Hostinger Passenger / Node.js
mkdir -p tmp
touch tmp/restart.txt 2>/dev/null || true

# 3. Reload PM2 if running under PM2
if command -v pm2 &> /dev/null; then
  pm2 reload mile-infinity 2>/dev/null || pm2 start app.js --name "mile-infinity" || true
fi

echo "✅ Hostinger deployment complete! Store is live."
