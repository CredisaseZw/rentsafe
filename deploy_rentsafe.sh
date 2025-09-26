#!/bin/bash
set -e 

cd /var/www/credisafe/rentsafe-api/rentsafe

echo "Starting deployment at $(date)"

# Stash local changes
git stash

git pull origin rentsafe-backend

docker system prune -f --volumes

# Bring down containers
docker compose down

docker compose up -d --build

echo "Deployment completed at $(date)"