terraform {
  required_providers {
    prisma-postgres = {
      source = "prisma/prisma-postgres"
    }
  }
}

provider "prisma-postgres" {}

resource "prisma-postgres_project" "main" {
  name = var.project_name
}

resource "prisma-postgres_database" "db" {
  project_id = prisma-postgres_project.main.id
  name       = "${var.project_name}-${var.environment}"
  region     = var.region
}

resource "prisma-postgres_connection" "api" {
  database_id = prisma-postgres_database.db.id
  name        = "${var.environment}-api"
}

