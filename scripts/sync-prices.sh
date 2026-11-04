#!/usr/bin/env bash
# Brings the price pages up to date with the market database.
#
#   scripts/sync-prices.sh            prices only (src/data/prices.json)
#   scripts/sync-prices.sh --images   also covers for games that have none yet
#
# Exports what is public from market (its scripts/export_public_prices.sql,
# through market's `db` command, which opens the tunnel to fructus), shows
# what changed, and replaces prices.json only if the export is valid JSON.
# With --images it downloads LaunchBox's Metadata.zip (~110 MB, kept for a
# week), adds the box front of every game missing from images.json (images
# picked by hand, from Commons or Icecat, are left alone) and makes their
# thumbnails. Publishing is a separate step: build, commit and push.
#
# MARKET_DIR points at the market repository (default ~/Projects/market).
set -euo pipefail

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MARKET_DIR="${MARKET_DIR:-$HOME/Projects/market}"
CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/vallax-prices"
DATA="$SITE_DIR/src/data"
WITH_IMAGES=false
for arg in "$@"; do
    case "$arg" in
        --images) WITH_IMAGES=true ;;
        -h | --help) sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
        *) echo "unknown option: $arg" >&2; exit 2 ;;
    esac
done

mkdir -p "$CACHE_DIR"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# market's dev shell provides `db`; it prints nothing but the query result.
market_sql() {
    (cd "$MARKET_DIR" && nix develop --quiet -c db run sh -c "psql \"\$DATABASE_URL\" -qAtX $1") 2>/dev/null
}

echo "→ Exporting prices from market…"
market_sql "-f scripts/export_public_prices.sql" > "$TMP/prices.json"
if ! python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); assert d["items"]' "$TMP/prices.json" 2>/dev/null; then
    echo "✗ The export is not valid JSON or has no products; prices.json is unchanged." >&2
    echo "  Try it by hand: cd $MARKET_DIR && db run sh -c 'psql \"\$DATABASE_URL\" -f scripts/export_public_prices.sql'" >&2
    exit 1
fi

python3 - "$DATA/prices.json" "$TMP/prices.json" <<'EOF'
import json, sys
old = {i["id"]: i for i in json.load(open(sys.argv[1]))["items"]} if open(sys.argv[1]).read(1) else {}
new = {i["id"]: i for i in json.load(open(sys.argv[2]))["items"]}
added = [new[k] for k in new.keys() - old.keys()]
removed = [old[k] for k in old.keys() - new.keys()]
changed = [(old[k], new[k]) for k in new.keys() & old.keys()
           if (old[k]["price_cents"], old[k]["updated_at"]) != (new[k]["price_cents"], new[k]["updated_at"])
           or old[k]["name"] != new[k]["name"] or old[k]["keywords"] != new[k]["keywords"]]
eur = lambda c: f"{c / 100:.0f} €"
print(f"  {len(new)} products: {len(added)} new, {len(removed)} removed, {len(changed)} changed")
for i in sorted(added, key=lambda i: i["name"])[:30]:
    print(f"  + {i['name']}  {eur(i['price_cents'])}")
for i in sorted(removed, key=lambda i: i["name"])[:30]:
    print(f"  - {i['name']}")
for a, b in sorted(changed, key=lambda p: p[1]["name"])[:30]:
    what = f"{eur(a['price_cents'])} → {eur(b['price_cents'])}" if a["price_cents"] != b["price_cents"] else "date, name or keywords"
    print(f"  ~ {b['name']}  {what}")
for label, n in (("new", len(added)), ("removed", len(removed)), ("changed", len(changed))):
    if n > 30:
        print(f"  … and {n - 30} more {label}")
EOF
mv "$TMP/prices.json" "$DATA/prices.json"
echo "✓ src/data/prices.json updated"

if $WITH_IMAGES; then
    META="$CACHE_DIR/Metadata.xml"
    if [[ ! -f "$META" ]] || [[ -n "$(find "$META" -mtime +7)" ]]; then
        echo "→ Downloading LaunchBox's Metadata.zip…"
        curl -sSL --fail -o "$CACHE_DIR/Metadata.zip" https://gamesdb.launchbox-app.com/Metadata.zip
        unzip -o -q "$CACHE_DIR/Metadata.zip" Metadata.xml -d "$CACHE_DIR"
        rm "$CACHE_DIR/Metadata.zip"
    fi

    echo "→ Looking for covers of games without an image…"
    market_sql "-F \"	\" -c \"select e.product_id, e.external_id, p.status, coalesce(g.platform, '') from core.external_ids e join core.products p on p.id = e.product_id left join games.game g on g.product_id = p.id where e.source = 'launchbox' and p.status = 'active'\"" > "$TMP/ids.tsv"
    python3 -I "$MARKET_DIR/scripts/launchbox_images.py" "$TMP/ids.tsv" "$META" "$TMP/covers.json" > /dev/null
    python3 - "$DATA/images.json" "$TMP/covers.json" <<'EOF'
import json, sys
images = json.load(open(sys.argv[1]))
added = 0
for cover in json.load(open(sys.argv[2])):
    pid = str(cover["product_id"])
    if pid not in images:
        images[pid] = {"source": "launchbox", "url": cover["url"]}
        added += 1
json.dump(images, open(sys.argv[1], "w"), ensure_ascii=False, separators=(",", ":"))
print(f"  {added} new covers")
EOF
    echo "→ Making thumbnails…"
    (cd "$SITE_DIR" && node scripts/build-thumbs.mjs | tail -2)
fi

echo
echo "Next: npm run build to check it, then commit and push to publish."
