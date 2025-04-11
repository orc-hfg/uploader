#!/bin/sh

## Set the project root directory path
PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)

## load environment variables
if [ -f "${PROJECT_ROOT}/.env" ]; then
  export $(grep -v '^#' "${PROJECT_ROOT}/.env" | xargs)
else
  echo "Error: .env file not found at ${PROJECT_ROOT}/.env"
  exit 1
fi

## check if MADEK_SSH_USER is defined
if [ -z "${MADEK_SSH_USER}" ]; then
  echo "Error: MADEK_SSH_USER is not defined in the .env file"
  exit 1
fi

## define settings
export NUXT_APP_BASE_URL=/uploader/;
## build
nuxi build
## sync build output to server
rsync -avz .output ${MADEK_SSH_USER}@dev.madek.hfg-karlsruhe.de:/srv/staging/uploader/
## restart service on the server
ssh -t ${MADEK_SSH_USER}@dev.madek.hfg-karlsruhe.de "sudo systemctl restart madek.staging.uploader"
