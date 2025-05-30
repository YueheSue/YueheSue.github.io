#!/bin/bash

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Remove any existing node_modules to ensure a clean install
rm -rf node_modules
rm -rf package-lock.json

# Install dependencies with the legacy-peer-deps flag
npm install --legacy-peer-deps

# Make sure ajv is explicitly installed with a compatible version
npm install ajv@6.12.6 ajv-keywords@3.5.2 --legacy-peer-deps --no-save

# Run the build with the appropriate flags for Node.js 18
# For Node.js 18+, we don't need --openssl-legacy-provider anymore
npm run build 