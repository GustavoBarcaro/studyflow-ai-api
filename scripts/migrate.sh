#!/bin/sh
set -e

export $(cat /shared/.env.generated | xargs)

BASELINE_MIGRATION="20260331193000_init"
DEPLOY_LOG="/tmp/prisma-migrate-deploy.log"

if npx prisma migrate deploy >"$DEPLOY_LOG" 2>&1; then
  cat "$DEPLOY_LOG"
  exit 0
fi

cat "$DEPLOY_LOG"

if grep -q "Error: P3005" "$DEPLOY_LOG"; then
  echo "Baselining existing database and retrying migrations..."
  npx prisma migrate resolve --applied "$BASELINE_MIGRATION"
  npx prisma migrate deploy
  exit 0
fi

exit 1
