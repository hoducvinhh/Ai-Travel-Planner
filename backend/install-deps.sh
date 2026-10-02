#!/bin/bash

echo "📦 Installing missing NestJS dependencies..."

pnpm add @nestjs/axios axios

echo "✅ Dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "1. Run: pnpm prisma generate"
echo "2. Run: pnpm prisma migrate dev"
echo "3. Run: pnpm run start:dev"
