#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
API_PROJECT="$PROJECT_ROOT/backend/api"
ENV_FILE="$PROJECT_ROOT/.test.env"

source "$ENV_FILE"

cleanup() {
    echo "Cleaning up: Stopping and removing test DB container..."
    cd "$PROJECT_ROOT" || exit 1
    docker compose -f compose.test.yaml down test-db -v
}

# Register trap in the main shell (Executes always when script exits)
trap cleanup EXIT

start_db() {
    cd "$PROJECT_ROOT" || exit 1
    echo "🚀 Starting test DB container..."
    docker compose -f compose.test.yaml up -d test-db

    echo "⏳ Waiting for DB to be healthy..."
    until docker compose -f compose.test.yaml exec test-db pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" > /dev/null 2>&1; do
        sleep 2
        echo -n "."
    done
    echo -e "\n✅ DB is ready!"
}

run_full() {
    start_db
    cd "$API_PROJECT" || exit 1
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    npm run test
    local test_exit_code=$?
    exit $test_exit_code
}

run_integration() {
    start_db
    cd "$API_PROJECT" || exit 1
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    npm run test:integration
    local test_exit_code=$?
    exit $test_exit_code
}

run_unit() {
    cd "$API_PROJECT" || exit 1
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    npm run test:unit
    local test_exit_code=$?
    exit $test_exit_code
}

run_lint() {
    cd "$API_PROJECT" || exit 1
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    npm run lint
    local test_exit_code=$?
    exit $test_exit_code
}

run_coverage() {
    start_db
    cd "$API_PROJECT" || exit 1
    export $(grep -v '^#' "$ENV_FILE" | xargs)
    npm run test:coverage
    local test_exit_code=$?
    exit $test_exit_code
}

case $1 in
    full)
        run_full
        ;;
    integration)
        run_integration
        ;;
    unit)
        run_unit
        ;;
    lint)
        run_lint
        ;;
    coverage)
        run_coverage
        ;;
    *)
        echo "Usage: $0 [full, integration, unit]"
        exit 1
        ;;
esac
