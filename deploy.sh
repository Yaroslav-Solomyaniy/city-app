#!/bin/bash
set -e

cd /srv/sites/city-app

echo "▶ Pulling latest code..."
git pull origin master

echo "▶ Building production image..."
docker compose -f docker-compose.prod.yml build --no-cache app

echo "▶ Restarting app container..."
docker compose -f docker-compose.prod.yml up -d --no-deps app

echo "▶ Running DB migrations..."
sleep 3
docker compose -f docker-compose.prod.yml exec -T app npx prisma migrate deploy

echo "✓ Deploy complete!"
