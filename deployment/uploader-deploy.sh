#!/usr/bin/env bash
set -euo pipefail

env="${1:-}"
case "$env" in
  development|staging) ;;
  *) echo "Usage: $0 {development|staging}" && exit 1 ;;
esac

case "$env" in
  development)
    HOST="dev.madek.hfg-karlsruhe.de"
    TARGET_DIR="/srv/dev/uploader"
    SERVICE="madek.dev.uploader"
    ;;
  staging)
    HOST="staging.madek.hfg-karlsruhe.de"
    TARGET_DIR="/srv/staging/uploader"
    SERVICE="madek.staging.uploader"
    ;;
esac

PROJECT_ROOT="$(cd -- "$(dirname "$0")/.." && pwd)"
if [[ -f "$PROJECT_ROOT/.env" ]]; then
  set -a; source "$PROJECT_ROOT/.env"; set +a
else
  echo ".env not found in $PROJECT_ROOT" && exit 1
fi

: "${MADEK_SSH_USER:?value of MADEK_SSH_USER is not defined in the .env file}"

echo "🔨 Building for $env..."
npm ci
npm run build

echo "🚀 Uploading to $HOST:$TARGET_DIR ..."
ssh "${MADEK_SSH_USER}@${HOST}" "mkdir -p $TARGET_DIR"
rsync -avz --delete .output "${MADEK_SSH_USER}@${HOST}:$TARGET_DIR/"

echo "🔄 Restarting service $SERVICE ..."
ssh -t "${MADEK_SSH_USER}@${HOST}" "sudo systemctl restart $SERVICE"

echo "✅ Deploy to $env complete."
