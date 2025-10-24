#!/usr/bin/env bash
set -euo pipefail

env="${1:-}"
case "$env" in
  development|staging) ;;
  *)
    echo "Usage: $0 {development|staging} [limit]"
    echo ""
    echo "Examples:"
    echo "  $0 development       # Show last 10 deployments"
    echo "  $0 development 20    # Show last 20 deployments"
    echo "  $0 staging all       # Show all deployments"
    exit 1
    ;;
esac

limit="${2:-10}"

case "$env" in
  development)
    HOST="dev.madek.hfg-karlsruhe.de"
    TARGET_DIR="/srv/dev/uploader"
    ;;
  staging)
    HOST="staging.madek.hfg-karlsruhe.de"
    TARGET_DIR="/srv/staging/uploader"
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

LOG_FILE="$TARGET_DIR/deploy-history.jsonl"

echo "📜 Deployment History for $env environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if log file exists on server
if ! ssh "$MADEK_SSH_USER@$HOST" "test -f $LOG_FILE" 2>/dev/null; then
  echo "⚠️  No deployment history found on $HOST"
  echo "    Log file: $LOG_FILE"
  echo ""
  echo "    This is expected if:"
  echo "    - No deployments have been made yet"
  echo "    - This is the first deployment with the new logging system"
  exit 0
fi

# Retrieve and format deployment history
if [[ "$limit" == "all" ]]; then
  # Show all entries
  ssh "$MADEK_SSH_USER@$HOST" "cat $LOG_FILE" | while IFS= read -r line; do
    echo "$line" | node -e '
      const line = require("fs").readFileSync(0, "utf-8").trim();
      if (!line) process.exit(0);
      const entry = JSON.parse(line);
      const date = new Date(entry.timestamp).toLocaleString("en-US", {
        timeZone: "Europe/Berlin",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
      console.log(`📦 ${entry.version} (${entry.commit.substring(0, 7)})`);
      console.log(`   🕐 ${date}`);
      console.log(`   👤 ${entry.user} → ${entry.environment}`);
      console.log(`   🌿 ${entry.branch}`);
      console.log("");
    '
  done
else
  # Show last N entries
  ssh "$MADEK_SSH_USER@$HOST" "tail -n $limit $LOG_FILE" | while IFS= read -r line; do
    echo "$line" | node -e '
      const line = require("fs").readFileSync(0, "utf-8").trim();
      if (!line) process.exit(0);
      const entry = JSON.parse(line);
      const date = new Date(entry.timestamp).toLocaleString("en-US", {
        timeZone: "Europe/Berlin",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
      console.log(`📦 ${entry.version} (${entry.commit.substring(0, 7)})`);
      console.log(`   🕐 ${date}`);
      console.log(`   👤 ${entry.user} → ${entry.environment}`);
      console.log(`   🌿 ${entry.branch}`);
      console.log("");
    '
  done
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ "$limit" != "all" ]]; then
  echo "💡 Showing last $limit deployments. Use 'all' to see complete history."
fi
