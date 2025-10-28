#!/usr/bin/env bash

# Exit immediately if any command fails (e = exit on error)
# Treat unset variables as errors (u = unset)
# Fail if any command in a pipe fails (pipefail)
set -euo pipefail

# Trap: Catch Ctrl+C (SIGINT) and exit gracefully
trap 'echo "❌ Deployment aborted."; exit 130' INT

# Get first argument passed to script, default to empty string if none provided
env="${1:-}"

# Validate environment argument
# Pattern matching: development|staging = accept both values
# Empty ;; = no action needed for valid values, just continue
# * = catch-all pattern for any other value (invalid input)
case "$env" in
  development|staging)
    ;;
  *)
    echo "Usage: $0 {development|staging}"
    exit 1
    ;;
esac

# Configure environment-specific variables
# Separate case statement ensures we only reach here with valid environment
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

# Find project root directory (one level up from this script)
PROJECT_ROOT="$(cd -- "$(dirname "$0")/.." && pwd)"

if [[ -f "$PROJECT_ROOT/.env" ]]; then
  # source: Execute .env file in current shell (loads variables)
  source "$PROJECT_ROOT/.env"
else
  echo ".env not found in $PROJECT_ROOT" && exit 1
fi

# Check if required environment variable is set
# ${VAR:?message} syntax: If VAR is unset/empty, print message and exit
# The : is a no-op command, we just need it to trigger the check
: "${MADEK_SSH_USER:?MADEK_SSH_USER missing in .env}"

echo "🔌 Checking connection to $HOST..."
if ! ssh -o ConnectTimeout=10 "$MADEK_SSH_USER@$HOST" "exit" 2>/dev/null; then
  echo "❌ Cannot connect to $HOST"
  exit 1
fi
echo "✅ Connection successful"
echo ""

# Function: Ask user for confirmation before proceeding with potentially risky operations
# Parameters:
#   $1 (required): Prompt message to display to user
#   $2 (optional): Success message to show if user confirms (default: "Proceeding...")
# Returns: 0 if user confirms (y/Y), exits script (exit 1) if user declines
confirm() {
  local prompt=$1
  # ${2:-default} syntax: Use $2 if provided, otherwise use "Proceeding..."
  local success_msg=${2:-"Proceeding..."}
  
  # read -r: Don't interpret backslashes
  # read -n 1: Read only one character (immediate response)
  # read -p: Display prompt before reading input
  read -r -n 1 -p "$prompt (y/N): " answer
  echo  # Print newline after single-character input
  
  # Convert answer to lowercase to accept both 'y' and 'Y'
  # tr '[:upper:]' '[:lower:]': Translate all uppercase to lowercase
  if [[ "$(echo "$answer" | tr '[:upper:]' '[:lower:]')" == y ]]; then
    echo "$success_msg"
    return 0  # Success: Continue with script execution
  else
    echo "Deployment cancelled."
    exit 1  # Exit entire script (not just function) to stop deployment
  fi
}

# Function: Check if git working directory has uncommitted changes
abort_if_dirty() {
  # git diff-index: Compare working tree to HEAD
  # Returns 0 if no changes, 1 if changes exist
  if ! git diff-index --quiet HEAD --; then
    # Uncommitted changes mean the deployed version won't match any git commit,
    # making it impossible to reproduce the exact deployment state later
    confirm "Uncommitted changes detected (deployment won't match any git commit). Continue anyway?" "Proceeding with deployment of uncommitted changes..."
  else
    echo "Working directory clean, proceeding with deployment..."
  fi
}

# Function: Check if local commits are pushed to remote
abort_if_unpushed() {
  local branch remote_sha local_sha

  # Get current branch name
  branch=$(git rev-parse --abbrev-ref HEAD)

  # Check if branch has an upstream (remote tracking branch)
  # @{u} means upstream of current branch
  if git rev-parse --quiet --verify "@{u}" >/dev/null; then
    # Get commit hashes of remote and local branches
    remote_sha=$(git rev-parse "@{u}")
    local_sha=$(git rev-parse HEAD)

    # Compare: Are local and remote at same commit?
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

# Function: Check if version was incremented since last deployment
# Helps identify if a new release was created before deployment
check_version_increment() {
  echo "🔍 Checking version increment..."
  
  # Get last deployed version from server's public deploy-info.json endpoint
  # curl -sf: silent mode, fail on HTTP errors
  # jq -r '.version': Extract version field from JSON
  local deploy_info_url="https://$HOST/uploader/deploy-info.json"
  local last_deployed_version
  last_deployed_version=$(curl -sf "$deploy_info_url" 2>/dev/null | jq -r '.version' 2>/dev/null || echo "")
  
  if [[ -z "$last_deployed_version" ]]; then
    echo "No previous deployment found, skipping version check."
    return 0
  fi
  
  if [[ "$VERSION" == "$last_deployed_version" ]]; then
    # Version unchanged means package.json wasn't updated, making it harder
    # to identify this deployment in logs and communicate about specific versions
    confirm "Version $VERSION unchanged (no release created). Continue anyway?" "Proceeding without release..."
  else
    echo "Version incremented from $last_deployed_version to $VERSION ✓"
  fi
}

echo "🔍 Git checks..."
abort_if_dirty
abort_if_unpushed

# Check version increment for staging deployments
# Development allows same version for quick testing deployments
if [[ "$env" == "staging" ]]; then
  check_version_increment
fi

echo "📝 Generating deployment info..."

VERSION=$(node -p "require('./package.json').version")  # Read from package.json
PACKAGE_NAME=$(node -p "require('./package.json').name")
COMMIT=$(git rev-parse HEAD)  # Get full commit hash
BRANCH=$(git rev-parse --abbrev-ref HEAD)  # Get branch name
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")  # Current time in ISO 8601 UTC
USER=$(whoami)  # Get current username

# Generate compact JSON (single line for JSONL compatibility)
echo "{\"timestamp\":\"$TIMESTAMP\",\"environment\":\"$env\",\"version\":\"$VERSION\",\"commit\":\"$COMMIT\",\"branch\":\"$BRANCH\",\"user\":\"$USER\",\"package\":\"$PACKAGE_NAME@$VERSION\"}" > deploy-info.json

echo ""
echo "Deployment Info:"
jq '.' deploy-info.json
echo ""

echo "🔨 Installing dependencies and building for $env environment..."
npm ci --no-audit --no-fund --loglevel=error --prefer-offline
npm run build

echo "📋 Adding deploy-info.json to build output..."
mkdir -p .output/public
cp deploy-info.json .output/public/deploy-info.json

echo "🚀 Uploading to $HOST:$TARGET_DIR..."
ssh "$MADEK_SSH_USER@$HOST" "mkdir -p $TARGET_DIR"

# IMPORTANT: Do NOT add a trailing slash to .output
# With trailing slash (.output/): Only contents are copied, no .output directory is created
# Without trailing slash (.output): Creates .output directory on target
# The service expects files at .output/server/index.mjs relative to TARGET_DIR
rsync -avz --delete .output "$MADEK_SSH_USER@$HOST:$TARGET_DIR/"

echo "📝 Logging deployment to server..."
# Prepend new entry at the beginning of the log file (newest first)
# 1. Write new entry to .new file
# 2. Append existing log if present
# 3. Move .new to replace log
ssh "$MADEK_SSH_USER@$HOST" "cat > $TARGET_DIR/deploy-history.jsonl.new && cat $TARGET_DIR/deploy-history.jsonl >> $TARGET_DIR/deploy-history.jsonl.new 2>/dev/null; mv $TARGET_DIR/deploy-history.jsonl.new $TARGET_DIR/deploy-history.jsonl" < deploy-info.json

echo "🔄 Restarting service $SERVICE ..."
ssh -t "$MADEK_SSH_USER@$HOST" "sudo systemctl restart $SERVICE"

echo "✅ Deploy to $env complete."
echo "📦 Version: $VERSION"
echo "📌 Commit: $COMMIT"
echo "🌿 Branch: $BRANCH"
echo ""
echo "💡 View deployment history: npm run deploy:history $env"

# Clean up local deploy-info.json
rm -f deploy-info.json
