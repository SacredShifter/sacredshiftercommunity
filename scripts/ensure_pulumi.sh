#!/usr/bin/env bash
set -euo pipefail
REQUIRED="v3.113."
if ! command -v pulumi >/dev/null 2>&1; then
  curl -fsSL https://get.pulumi.com | sh
  echo "$HOME/.pulumi/bin" >> $GITHUB_PATH 2>/dev/null || true
fi
pulumi version
pulumi version | grep -q "$REQUIRED" || { echo "Pulumi version mismatch"; exit 1; }
