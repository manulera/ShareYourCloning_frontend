#!/bin/sh

# Create config.json with env vars
envsubst < config.dev.json > config.json
http-server --port 3000 --mime-types mime.types