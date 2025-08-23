set -euo pipefail
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}
DB_PASS=${DB_PASS:-postgres}
DB_NAME=${DB_NAME:-shift}

export PGPASSWORD="$DB_PASS"

# Apply migrations in lexical order; ensure seedless & idempotent
for f in /migrations/*.sql; do
  echo "\n>>> Applying $f"
  psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$f"
  echo ">>> OK: $f"
done

echo "\nAll migrations applied successfully."
