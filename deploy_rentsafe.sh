#!/bin/bash
set -e 

echo "Starting deployment at $(date)"

cd /var/www/credisafe/rentsafe-api/rentsafe

# Stash local changes
git stash

git pull origin rentsafe-backend

docker system prune -f --volumes

# Bring down containers
docker compose down

docker compose up -d --build

echo "Deployment completed at $(date)"