#!/bin/sh

## define settings
export NUXT_APP_BASE_URL=/uploader/;
## build
nuxi build
## sync build output to server
rsync -avz .output rene@dev.madek.hfg-karlsruhe.de:/srv/staging/uploader/
## restart service on the server
ssh -t rene@dev.madek.hfg-karlsruhe.de "sudo systemctl restart madek.staging.uploader"
