#!/usr/bin/env bash
set -euo pipefail
trap 'echo "❌ Deployment aborted."; exit 130' INT

env="${1:-}"
case "$env" in
  development|staging) ;;
  *)
    echo "Usage: $0 {development|staging}"
    exit 1
    ;;
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
  # Ignore shellcheck warning about not being able to follow dynamic source paths
  # shellcheck disable=SC1090
  source "$PROJECT_ROOT/.env"
else
  echo ".env not found in $PROJECT_ROOT" && exit 1
fi
: "${MADEK_SSH_USER:?MADEK_SSH_USER missing in .env}"

confirm() {
  local prompt=$1
  local success_msg=${2:-"Proceeding..."}
  read -r -n 1 -p "$prompt (y/N): " answer
  echo
  if [[ "$(echo "$answer" | tr '[:upper:]' '[:lower:]')" == y ]]; then
    echo "$success_msg"
    return 0
  else
    echo "Deployment cancelled."
    exit 1
  fi
}

abort_if_dirty() {
  if ! git diff-index --quiet HEAD --; then
    # Uncommitted changes mean the deployed version won't match any git commit,
    # making it impossible to reproduce the exact deployment state later
    confirm "Uncommitted changes detected (deployment won't match any git commit). Continue anyway?" "Proceeding with deployment of uncommitted changes..."
  else
    echo "Working directory clean, proceeding with deployment..."
  fi
}

abort_if_unpushed() {
  local branch remote_sha local_sha
  branch=$(git rev-parse --abbrev-ref HEAD)
  if git rev-parse --quiet --verify "@{u}" >/dev/null; then
    remote_sha=$(git rev-parse "@{u}")
    local_sha=$(git rev-parse HEAD)
    if [[ $remote_sha != $local_sha ]]; then
      # Unpushed commits mean team members can't see what's being deployed,
      # and the deployment can't be reproduced from the remote repository
      confirm "Local commits not pushed to origin/$branch (team can't reproduce deployment). Continue anyway?" "Proceeding with deployment of unpushed commits..."
    fi
  else
    # Untracked branches mean the deployment source isn't backed up remotely,
    # risking data loss and making collaboration impossible
    confirm "Branch '$branch' not on remote (no backup, collaboration impossible). Continue anyway?" "Proceeding with deployment of untracked branch..."
  fi
}

echo "🔍 Git checks..."
abort_if_dirty
abort_if_unpushed

echo "🔨 Building for $env..."
npm ci --no-audit --no-fund --loglevel=error --prefer-offline
npm run build

echo "🚀 Uploading to $HOST:$TARGET_DIR..."
ssh "$MADEK_SSH_USER@$HOST" "mkdir -p $TARGET_DIR"
# IMPORTANT: Do NOT add a trailing slash to .output
# With trailing slash (.output/): Only contents are copied, no .output directory is created
# Without trailing slash (.output): Creates .output directory on target
# The service expects files at .output/server/index.mjs relative to TARGET_DIR
rsync -avz --delete .output "$MADEK_SSH_USER@$HOST:$TARGET_DIR/"

echo "🔄 Restarting service $SERVICE ..."
ssh -t "$MADEK_SSH_USER@$HOST" "sudo systemctl restart $SERVICE"

echo "✅ Deploy to $env complete."
