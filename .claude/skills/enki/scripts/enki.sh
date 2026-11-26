#!/usr/bin/env bash
# enki.sh — read the enki (NPlan) repo from the local sibling checkout, falling back to GitHub.
#
# Usage:
#   enki.sh where            print the source in use: local path, or the remote base URL
#   enki.sh ver              local HEAD vs origin/<branch> (is the checkout stale?)
#   enki.sh cat <path>       print a repo-relative file, e.g. `enki.sh cat AGENTS.md`
#   enki.sh ls [path]        list a repo-relative directory
#
# Env:
#   ENKI_DIR      override the local checkout location
#   ENKI_REMOTE=1 force the online source even when a checkout exists
set -euo pipefail

REPO=entur/enki BRANCH=master
RAW="https://raw.githubusercontent.com/$REPO/$BRANCH"

# Resolve against the MAIN checkout so a .claude/worktrees/<x> session still finds ../enki.
main_root() { dirname "$(realpath "$(git rev-parse --git-common-dir)")"; }

local_dir() {
  local d=${ENKI_DIR:-$(main_root)/../enki}
  [[ -z ${ENKI_REMOTE:-} && -f $d/AGENTS.md ]] && realpath "$d"
}

where() { local_dir || echo "$RAW"; }

ver() {
  local d
  if d=$(local_dir); then
    printf 'local   %s  %s\n' "$(git -C "$d" rev-parse --short HEAD)" "$(git -C "$d" log -1 --format='%ad %s' --date=short)"
    printf 'branch  %s\n' "$(git -C "$d" branch --show-current)"
  else
    echo 'local   (no checkout)'
  fi
  printf 'remote  %s  %s/%s\n' "$(git ls-remote "https://github.com/$REPO.git" "refs/heads/$BRANCH" | cut -c1-8)" "$REPO" "$BRANCH"
}

rd() {
  local d
  if d=$(local_dir); then cat "$d/$1"; else curl -fsSL "$RAW/$1"; fi
}

lst() {
  local d p=${1:-}
  if d=$(local_dir); then
    command ls -F "$d/$p"
  else
    gh api "repos/$REPO/contents/$p?ref=$BRANCH" --jq '.[] | .name + (if .type == "dir" then "/" else "" end)'
  fi
}

case ${1:-} in
  where) where ;;
  ver) ver ;;
  cat) rd "${2:?path}" ;;
  ls) lst "${2:-}" ;;
  *) sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//' ; exit 2 ;;
esac
