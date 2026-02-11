#!/usr/bin/env bash
# Copies built deckplan-editor web component assets into hathor/public/
# Run from the hathor project root, or from any location.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
HATHOR_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DECKPLAN_DIST="$HATHOR_ROOT/../deckplan-editor/dist"
TARGET="$HATHOR_ROOT/public/deckplan-editor"

if [[ ! -d "$DECKPLAN_DIST" ]]; then
  echo "ERROR: deckplan-editor dist not found at $DECKPLAN_DIST"
  echo "Run 'npm run build-wc' in the deckplan-editor project first."
  exit 1
fi

mkdir -p "$TARGET"
cp "$DECKPLAN_DIST/netex-deckplan-editor.es.js" "$TARGET/"
cp "$DECKPLAN_DIST/netex-deckplan-editor.css" "$TARGET/"

echo "Copied deckplan-editor assets to $TARGET"
