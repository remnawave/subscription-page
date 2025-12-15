#!/bin/sh

echo "Starting entrypoint script..."
export INTERNAL_JWT_SECRET=$(head -c 64 /dev/urandom | xxd -p)


echo "Entrypoint script completed."
exec "$@"