#!/usr/bin/env bash

# Exit on errors, treat unset variables as errors, fail on pipe errors
set -euo pipefail

# Get first argument (environment), default to empty if not provided
env="${1:-}"

case "$env" in
  development|staging)
    ;;
  *)
    # Invalid or missing environment - show usage
    echo "Usage: $0 {development|staging} [limit]"
    echo ""
    echo "Examples:"
    echo "  $0 development       # Show last 10 deployments"
    echo "  $0 development 20    # Show last 20 deployments"
    echo "  $0 staging all       # Show all deployments"
    exit 1
    ;;
esac

# Get second argument (limit), default to 10 if not provided
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

# Find project root directory and load environment variables
PROJECT_ROOT="$(cd -- "$(dirname "$0")/.." && pwd)"
if [[ -f "$PROJECT_ROOT/.env" ]]; then
  source "$PROJECT_ROOT/.env"  # Load .env file into current shell
else
  echo ".env not found in $PROJECT_ROOT" && exit 1
fi

# Verify required environment variable is set
: "${MADEK_SSH_USER:?MADEK_SSH_USER missing in .env}"

echo "🔌 Checking connection to $HOST..."
if ! ssh -o ConnectTimeout=10 "$MADEK_SSH_USER@$HOST" "exit" 2>/dev/null; then
  echo "❌ Cannot connect to $HOST"
  exit 1
fi
echo "✅ Connection successful"
echo ""

LOG_FILE="$TARGET_DIR/deploy-history.jsonl"

echo "📜 Deployment History for $env environment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🕐 All times shown in UTC"
echo ""

# Check if deployment log file exists on server
# test -f: Check if file exists and is a regular file
if ! ssh "$MADEK_SSH_USER@$HOST" "test -f $LOG_FILE" 2>/dev/null; then
  echo "⚠️  No deployment history found on $HOST"
  echo "    Log file: $LOG_FILE"
  exit 0  # Exit successfully (not an error)
fi

# Function: Format and display a single deployment entry
format_entry() {
  local json="$1"

  # Extract fields from JSON using jq (JSON processor)
  # -r: Raw output (no quotes)
  # .field: Access JSON field
  # [:7]: Get first 7 characters (for commit hash)
  local version=$(echo "$json" | jq -r '.version')
  local commit=$(echo "$json" | jq -r '.commit[:7]')
  local timestamp=$(echo "$json" | jq -r '.timestamp')
  local user=$(echo "$json" | jq -r '.user')
  local environment=$(echo "$json" | jq -r '.environment')
  local branch=$(echo "$json" | jq -r '.branch')

  echo "📦 $version ($commit)"
  echo "   🕐 $timestamp"
  echo "   👤 $user → $environment"
  echo "   🌿 $branch"
  echo ""
}

# Retrieve and format deployment history from server
if [[ "$limit" == "all" ]]; then
  # Show all entries in the log file
  # -o LogLevel=ERROR: Suppress SSH informational messages
  # cat: Output entire file
  # | (pipe): Send output to next command
  # while read: Process line by line
  ssh -o LogLevel=ERROR "$MADEK_SSH_USER@$HOST" "cat $LOG_FILE" 2>/dev/null | while IFS= read -r line; do
    # Skip empty lines or lines not starting with { (invalid JSON)
    # [[ ]]: Extended test command
    # -z: Test if string is empty
    # ${line:0:1}: Get first character
    # &&: If previous command succeeds, run next
    # continue: Skip to next iteration
    [[ -z "$line" || "${line:0:1}" != "{" ]] && continue

    # Validate JSON with jq before processing
    # jq -e: Exit with error code if invalid JSON
    if echo "$line" | jq -e . >/dev/null 2>&1; then
      format_entry "$line"
    fi
  done
else
  # Show first N entries (most recent deployments)
  # head -n $limit: Get first N lines from file (newest deployments are at the top)
  ssh -o LogLevel=ERROR "$MADEK_SSH_USER@$HOST" "head -n $limit $LOG_FILE" 2>/dev/null | while IFS= read -r line; do
    # Same validation as above
    [[ -z "$line" || "${line:0:1}" != "{" ]] && continue

    if echo "$line" | jq -e . >/dev/null 2>&1; then
      format_entry "$line"
    fi
  done
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count total number of deployments
# wc -l: Count lines (each line = one deployment in JSONL)
# <: Redirect file as input
# tr -d ' ': Delete spaces from output
TOTAL_DEPLOYMENTS=$(ssh "$MADEK_SSH_USER@$HOST" "wc -l < $LOG_FILE" 2>/dev/null | tr -d ' ')

if [[ "$limit" != "all" ]]; then
  echo "💡 Showing last $limit of $TOTAL_DEPLOYMENTS total deployments. Use 'all' to see complete history."
else
  echo "📊 Total deployments: $TOTAL_DEPLOYMENTS"
fi
