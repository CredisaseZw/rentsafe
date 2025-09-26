#!/bin/bash
set -e 

cd /var/www/credisafe/rentsafe-api/rentsafe

echo "Starting deployment at $(date)"

# Stash local changes
/usr/bin/git stash

/usr/bin/git pull origin rentsafe-backend

/usr/bin/docker system prune -f --volumes

# Bring down containers
/usr/bin/docker compose down

/usr/bin/docker compose up -d --build

echo "Deployment completed at $(date)"