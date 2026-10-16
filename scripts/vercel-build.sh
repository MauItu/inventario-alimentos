#!/usr/bin/env bash
set -euo pipefail

# Vercel solo define VERCEL_ENV si "Enable access to System Environment Variables" está activo
if [[ -z "${VERCEL_ENV:-}" ]]; then
  echo "VERCEL_ENV no está definida: activa 'Enable access to System Environment Variables' en Vercel" >&2
  exit 1
fi

npm run build

# Los Preview usan la misma BD que producción, así que solo producción migra.
# Va después del build para no tocar la BD si el build falla.
if [[ "$VERCEL_ENV" == "production" ]]; then
  npx prisma migrate deploy
fi
