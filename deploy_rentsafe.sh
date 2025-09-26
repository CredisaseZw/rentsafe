#!/bin/bash
set -e 

# Stash local changes (optional: stash with message or apply pop later)
git stash

git pull origin rentsafe-backend

docker system prune -f --volumes

# Bring down containers
docker compose down

docker compose up -d --build
