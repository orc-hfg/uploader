#!/usr/bin/env bash

# Exit immediately if any command fails
set -euo pipefail

# Get first argument (hostname), default to development if none provided
HOST="${1:-dev.madek.hfg-karlsruhe.de}"

echo "🔍 Fetching deployment info from https://$HOST/uploader/health..."
echo ""

# Fetch health data from server (includes deploymentInfo)
# curl -sf: silent mode, fail on HTTP errors (returns non-zero exit code)
RESPONSE=$(curl -sf "https://$HOST/uploader/health" 2>&1) || {
  echo "❌ Failed to fetch health data from server"
  echo "   URL: https://$HOST/uploader/health"
  echo "   Server is not reachable or health endpoint failed"
  exit 1
}

# Check if response contains deploymentInfo
if ! echo "$RESPONSE" | jq -e '.deploymentInfo' >/dev/null 2>&1; then
  echo "⚠️  No deployment info available on $HOST"
  echo ""
  echo "This usually means no deployment has been made yet."
  echo "Run a deployment first to create deployment info."
  exit 0
fi

# Extract and format deployment info from health response
echo "$RESPONSE" | jq -r '.deploymentInfo | "Environment: \(.environment)\nVersion:     \(.version)\nCommit:      \(.commit)\nBranch:      \(.branch)\nTimestamp:   \(.timestamp)\nUser:        \(.user)\nPackage:     \(.package)"'
