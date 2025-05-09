#!/bin/sh

echo "Starting entrypoint script..."

echo "Starting pm2..."
pm2-runtime start ecosystem.config.js --env production

echo "Entrypoint script completed."
