#!/bin/sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
BACKEND_PID=
FRONTEND_PID=

cleanup() {
  status=$?
  trap - EXIT INT TERM

  [ -z "$BACKEND_PID" ] || kill "$BACKEND_PID" 2>/dev/null || true
  [ -z "$FRONTEND_PID" ] || kill "$FRONTEND_PID" 2>/dev/null || true

  [ -z "$BACKEND_PID" ] || wait "$BACKEND_PID" 2>/dev/null || true
  [ -z "$FRONTEND_PID" ] || wait "$FRONTEND_PID" 2>/dev/null || true
  exit "$status"
}

trap cleanup EXIT INT TERM

set -a
. "$ROOT_DIR/.env"
set +a

echo "Installing dependencies..."
yarn --cwd "$ROOT_DIR/back" install --frozen-lockfile
yarn --cwd "$ROOT_DIR/front" install --frozen-lockfile

echo "Starting PostgreSQL..."
docker compose --project-directory "$ROOT_DIR" up -d --wait database

export MEMORY_TEST_DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}"

echo "Starting backend and frontend with hot reload..."
PORT=3000 yarn --cwd "$ROOT_DIR/back" dev &
BACKEND_PID=$!

BROWSER=none API_PROXY_TARGET=http://localhost:3000 yarn --cwd "$ROOT_DIR/front" start &
FRONTEND_PID=$!

attempt=0
until curl --fail --silent --output /dev/null http://localhost:3000/up &&
  curl --fail --silent --output /dev/null http://localhost:4200/; do
  if ! kill -0 "$BACKEND_PID" 2>/dev/null || ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo "A development server stopped during startup." >&2
    exit 1
  fi

  attempt=$((attempt + 1))
  if [ "$attempt" -ge 60 ]; then
    echo "Development servers did not become ready within 60 seconds." >&2
    exit 1
  fi
  sleep 1
done

echo ""
echo "Local stack is up!"
echo "  Frontend: http://localhost:4200"
echo "  API:      http://localhost:3000"
echo "  Health:   http://localhost:3000/up"
echo "Press Ctrl-C to stop frontend and backend."

while kill -0 "$BACKEND_PID" 2>/dev/null && kill -0 "$FRONTEND_PID" 2>/dev/null; do
  sleep 1
done

echo "A development server stopped unexpectedly." >&2
exit 1
