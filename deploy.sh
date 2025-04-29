#!/bin/bash

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out

# Install dependencies (only if needed)
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project with optimizations
echo "🏗️ Building project..."
NEXT_TELEMETRY_DISABLED=1 npm run build

# Deploy
echo "🚀 Deploying..."
npm run deploy

echo "✅ Deployment complete!" 