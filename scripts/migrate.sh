#!/bin/sh
set -e

export $(cat /shared/.env.generated | xargs)

npx prisma migrate deploy