#!/bin/bash
# Script to update admin name via API

# Login and get token
echo "Logging in..."
RESPONSE=$(curl -s -X POST http://localhost:5050/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kangqore.com","password":"Admin@123"}')

echo "Login response: $RESPONSE"

# Extract token using sed
TOKEN=$(echo $RESPONSE | sed 's/.*"token":"\([^"]*\)".*/\1/')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "$RESPONSE" ]; then
  echo "Failed to get token"
  exit 1
fi

echo "Token obtained: ${TOKEN:0:20}..."

# Update profile
echo "Updating profile..."
UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:5050/api/profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"ADMIN- eQORE"}')

echo "Update response: $UPDATE_RESPONSE"
