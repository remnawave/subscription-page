#!/bin/sh

echo "Starting entrypoint script..."
export INTERNAL_JWT_SECRET=$(head -c 64 /dev/urandom | xxd -p)

echo "Starting pm2..."
pm2-runtime start ecosystem.config.js --env production

echo "Entrypoint script completed."
