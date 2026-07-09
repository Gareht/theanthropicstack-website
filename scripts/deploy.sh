#!/usr/bin/env bash
#
# Deploy dist/ to Krystal over FTPS.
#
# Credentials come from .env, which is gitignored. The password is passed to
# lftp through the environment, never as a command-line argument, so it does
# not appear in the process list.
#
#   ./scripts/deploy.sh           dry run, shows what would change
#   ./scripts/deploy.sh --live    performs the upload
#   ./scripts/deploy.sh --live --delete    also removes remote files absent locally
#
set -euo pipefail

cd "$(dirname "$0")/.."

readonly ENV_FILE=".env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "error: $ENV_FILE not found. Copy .env.example to .env and fill it in." >&2
  exit 1
fi

# shellcheck disable=SC1090
set -a; source "$ENV_FILE"; set +a

for var in FTP_HOST FTP_USER FTP_PASS FTP_REMOTE_DIR; do
  if [[ -z "${!var:-}" ]]; then
    echo "error: $var is empty in $ENV_FILE" >&2
    exit 1
  fi
done

if ! command -v lftp >/dev/null 2>&1; then
  echo "error: lftp is not installed. Run: brew install lftp" >&2
  exit 1
fi

live=false
delete=false
for arg in "$@"; do
  case "$arg" in
    --live) live=true ;;
    --delete) delete=true ;;
    *) echo "error: unknown argument: $arg" >&2; exit 1 ;;
  esac
done

if [[ "$delete" == true && "$live" == false ]]; then
  echo "error: --delete requires --live" >&2
  exit 1
fi

mirror_flags=(--reverse --verbose --parallel=4)
$live || mirror_flags+=(--dry-run)
$delete && mirror_flags+=(--delete)

echo "==> Building"
npx astro build

if [[ ! -f dist/index.html ]]; then
  echo "error: dist/index.html missing, refusing to upload an empty build" >&2
  exit 1
fi

if [[ "$live" == true ]]; then
  echo "==> Uploading dist/ to ${FTP_HOST}:${FTP_REMOTE_DIR}"
else
  echo "==> DRY RUN. Nothing will be written. Re-run with --live to upload."
fi

# ftp:// with ssl-force is explicit FTPS: connect on 21, then AUTH TLS.
# The ftps:// scheme would mean implicit FTPS on 990, which Krystal does not run.
#
# FTP_HOST must be the hostname on Krystal's certificate (adama-lon.krystal.uk),
# not ftp.theanthropicstack.com, or verification fails. Never turn verification
# off to work around that: it would accept any certificate, including an
# attacker's, and this connection carries the password.
#
# --env-password reads LFTP_PASSWORD from the environment, keeping it out of argv.
LFTP_PASSWORD="$FTP_PASS" lftp -u "$FTP_USER" --env-password "ftp://${FTP_HOST}" <<EOF
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ssl:verify-certificate true
set ftp:list-options -a
set net:timeout 15
set net:max-retries 2
set cmd:fail-exit true
mirror ${mirror_flags[*]} dist/ "${FTP_REMOTE_DIR}"
bye
EOF

echo "==> Done"
$live && cat <<'CHECKS'

Verify on the live site:
  1. /stack renders
  2. /railway lands on railway.com with referralCode=theanthropicstack
  3. the subscribe form still posts (depends on .htaccess having uploaded)
CHECKS
