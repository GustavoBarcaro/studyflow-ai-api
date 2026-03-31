#!/bin/sh
set -e

TFVARS_FILE="${TFVARS_FILE:-environments/dev.tfvars}"

terraform init
terraform apply -auto-approve -var-file="$TFVARS_FILE"

CONNECTION_STRING=$(terraform output -raw connection_string)

cat > /shared/.env.generated <<EOF
DATABASE_URL=$CONNECTION_STRING
EOF
