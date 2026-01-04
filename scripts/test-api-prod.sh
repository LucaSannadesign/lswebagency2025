#!/bin/bash
# scripts/test-api-prod.sh
# Test degli endpoint API in produzione

BASE_URL="https://www.lswebagency.com"

echo "🧪 Test API in produzione"
echo "=========================="
echo ""

echo "1️⃣  Test GET /api/ping"
echo "----------------------"
curl -i "${BASE_URL}/api/ping" 2>&1 | head -n 25
echo ""
echo ""

echo "2️⃣  Test POST /api/contact (FormData)"
echo "--------------------------------------"
curl -i -X POST "${BASE_URL}/api/contact" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'name=Test&email=test@example.com&message=Hello%20world%20test&privacy=on' \
  2>&1 | head -n 40
echo ""
echo ""

echo "✅ Test completati"
echo ""
echo "Verifica che:"
echo "  - Status code sia 200 (o 400 per validazione)"
echo "  - Content-Type sia application/json"
echo "  - Body sia JSON valido"

