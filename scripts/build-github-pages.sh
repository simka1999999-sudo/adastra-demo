#!/usr/bin/env bash
# Статический экспорт для GitHub Pages. Восстанавливает API/middleware после сборки.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export GITHUB_PAGES=true
export NEXT_PUBLIC_STATIC_DEMO=true
export NEXT_PUBLIC_ALLOW_INDEXING=false
export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-/adastra-demo}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://simka1999999-sudo.github.io/adastra-demo}"
export DATABASE_URL="${DATABASE_URL:-file:./demo.db}"

STASH="$(mktemp -d)"
cleanup() {
  if [[ -d "$STASH/api" && ! -d src/app/api ]]; then
    mv "$STASH/api" src/app/api
  fi
  if [[ -d "$STASH/admin" && ! -d src/app/admin ]]; then
    mv "$STASH/admin" src/app/admin
  fi
  if [[ -f "$STASH/middleware.ts" && ! -f src/middleware.ts ]]; then
    mv "$STASH/middleware.ts" src/middleware.ts
  fi
  rm -rf "$STASH"
}
trap cleanup EXIT

if [[ -d src/app/api ]]; then
  mv src/app/api "$STASH/api"
fi
if [[ -d src/app/admin ]]; then
  mv src/app/admin "$STASH/admin"
fi
if [[ -f src/middleware.ts ]]; then
  mv src/middleware.ts "$STASH/middleware.ts"
fi

npx prisma generate
npx next build
touch out/.nojekyll
