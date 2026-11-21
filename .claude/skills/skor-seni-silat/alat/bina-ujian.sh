#!/usr/bin/env bash
# Bina salinan ujian index.html yang guna pangkalan data tiruan (tanpa Firebase sebenar)
# dan hidupkan pelayan tempatan di port 8767.
# Guna: bash .claude/skills/skor-seni-silat/alat/bina-ujian.sh [folder-keluaran]
set -e
REPO="$(cd "$(dirname "$0")/../../../.." && pwd)"
OUT="${1:-/tmp/ujian-silat}"
mkdir -p "$OUT"
cp "$(dirname "$0")/mockdb.js" "$OUT/mockdb.js"
python3 - "$REPO/index.html" "$OUT/app.html" <<'PY'
import re,sys
s=open(sys.argv[1]).read()
s=re.sub(r'<script src="https://www.gstatic.com/firebasejs/[^"]+"></script>\n','',s)
s=s.replace('<!-- Firebase (percuma, pelan Spark) -->','<script src="mockdb.js"></script>')
s=re.sub(r'const SHEET_URL = "[^"]*";','const SHEET_URL = "";',s)  # jangan hantar ke Sheet sebenar
open(sys.argv[2],'w').write(s)
PY
if ! curl -s -o /dev/null "http://localhost:8767/app.html"; then
  (cd "$OUT" && setsid python3 -m http.server 8767 >/dev/null 2>&1 &)
  sleep 1
fi
echo "Sedia: http://localhost:8767/app.html?v=kp&auto=1  (juri: ?v=juri&j=1&auto=1, penonton: ?v=penonton)"
