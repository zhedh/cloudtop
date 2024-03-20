#!/bin/bash
set -e

PORT=8000

npm run build

while IFS='=' read -r key value; do
  if [[ "$key" == "VITE_PORT" ]]; then
    value=${value%% *}
      PORT=$value
  fi
done < .env

pm2 serve --spa dist --port $PORT --name cloudtop_monitor
