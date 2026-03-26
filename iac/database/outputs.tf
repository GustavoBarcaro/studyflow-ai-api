output "connection_string" {
  value     = prisma-postgres_connection.api.connection_string
  sensitive = true
}