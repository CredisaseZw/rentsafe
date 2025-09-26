#!/bin/bash


# Pull latest code
git stash
git pull origin rentsafe-backend

# Rebuild and restart Docker containers
docker compose down
docker compose up -d --build




