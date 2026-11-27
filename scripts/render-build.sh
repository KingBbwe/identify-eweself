#!/bin/sh
# Render static-site build: copies the app into dist/ and writes a PUBLIC config.local.js.
# Only non-secret values go in. The Telegram token is deliberately NOT written: anything in a static
# site is readable by every visitor, so Telegram sending stays off on the hosted copy.
set -eu
rm -rf dist && mkdir dist
cp -R index.html *.js *.css dist/ 2>/dev/null || true
[ -d engine ] && cp -R engine dist/engine
rm -f dist/config.example.js
cat > dist/config.local.js <<CFG
window.TELEGRAM_BOT_TOKEN = window.TELEGRAM_BOT_TOKEN || "";
window.TELEGRAM_CHAT_ID = window.TELEGRAM_CHAT_ID || "";
window.HEXDIE_URL = window.HEXDIE_URL || "${HEXDIE_URL:-YOUR_HEXDIE_URL}";
CFG
echo "built dist/: $(ls dist | tr '\n' ' ')"
