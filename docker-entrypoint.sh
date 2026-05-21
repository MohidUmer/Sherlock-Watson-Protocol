#!/bin/bash
# ============================================================================
# Master Entrypoint Template for EHCP Challenges
# ============================================================================
# Fetches dynamic team flag and then launches the challenge service.

set -euo pipefail

function get_flag() {
    local FLAG_FMT="EHCP"

    if [[ -z "${CHALLENGE_ID:-}" || -z "${TEAM_ID:-}" ]]; then
        echo "[entrypoint] CHALLENGE_ID or TEAM_ID not set; skipping network retrieval."
        return 1
    fi

    local API_KEY="nz8AUWqi5neBpFbIr2pKNVrXtjSb4KRH"
    local HOST="${FLAG_ENDPOINT_HOST:-flag.local}"
    local PORT="${FLAG_ENDPOINT_PORT:-9512}"
    local QUERY="GET /flag?chal_id=${CHALLENGE_ID}&team_id=${TEAM_ID} HTTP/1.1\r\nHost: ${HOST}\r\napi-key:${API_KEY}\r\n\r\n"

    local flag=""
    if ! exec 3<>/dev/tcp/${HOST}/${PORT}; then
        echo "[entrypoint] Unable to open socket to ${HOST}:${PORT}."
        return 1
    fi

    printf '%s' "$QUERY" >&3
    while IFS= read -r -u 3 line; do
        if [[ "$line" =~ $FLAG_FMT\{.*\} ]]; then
            flag="${BASH_REMATCH[0]}"
        fi
    done
    exec 3<&-

    if [[ -z "$flag" ]]; then
        echo "[entrypoint] Flag not found in response."
        return 1
    fi

    echo "$flag"
    return 0
}

function write_fallback_flag() {
    if [[ -n "${FLAG:-}" ]]; then
        echo "${FLAG}" > /flag.txt
        echo "[entrypoint] Using fallback FLAG environment variable."
    else
        echo "EHCP{NO_DYNAMIC_FLAG_AVAILABLE}" > /flag.txt
        echo "[entrypoint] No fallback FLAG provided; using default placeholder."
    fi
}

rm -f /flag.txt

if get_flag > /flag.txt; then
    echo "[entrypoint] Dynamic flag written to /flag.txt"
else
    write_fallback_flag
fi

chmod 444 /flag.txt

exec node app.js
