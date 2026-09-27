#!/usr/bin/env python3
"""Read ONE published, public Google Sheets CSV tab and build safe static website data.

The source must be the PublicExport tab, not the private teacher workbook.
Every source value is treated as untrusted display data. No API token needed.
"""
import csv
import io
import json
import os
import pathlib
import sys
import urllib.parse
import urllib.request

MAX_BYTES = 2_000_000
EXPECTED = ["kind", "field1", "field2", "field3", "field4", "field5", "field6", "field7"]
KINDS = {"dictionary", "category", "spelling", "frequency", "study"}
STUDY_TYPES = {"Synonyms", "Antonyms", "Prefixes", "Base Words", "Suffixes"}


def trim(value, limit=700):
    return str(value or "").strip()[:limit]


def https_picture(value):
    url = trim(value, 700)
    parsed = urllib.parse.urlparse(url)
    return url if parsed.scheme == "https" and parsed.hostname else ""


def load_csv(url):
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or parsed.hostname != "docs.google.com":
        raise ValueError("Public CSV URL must be an HTTPS docs.google.com link.")
    if "/spreadsheets/" not in parsed.path or "output=csv" not in parsed.query:
        raise ValueError("Publish PublicExport as CSV, then use its published CSV URL.")
    request = urllib.request.Request(url, headers={"User-Agent": "EnglishLibrarySync/1.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        data = response.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise ValueError("Published CSV is too large for this site.")
    reader = csv.DictReader(io.StringIO(data.decode("utf-8-sig")))
    if reader.fieldnames != EXPECTED:
        raise ValueError("Wrong CSV header. Publish only the PublicExport tab.")
    return list(reader)


def build(rows):
    result = {
        "source": "published-google-sheet",
        "dictionary": [],
        "categories": [],
        "spelling": [],
        "frequency": [],
        "study": [],
    }
    if len(rows) > 5000:
        raise ValueError("Unexpectedly large export.")
    for line, row in enumerate(rows, start=2):
        if None in row:
            raise ValueError("Unexpected extra columns at CSV line %s." % line)
        kind = trim(row["kind"], 30).lower()
        if not kind:
            continue
        if kind not in KINDS:
            raise ValueError("Unexpected row type at line %s: %s" % (line, kind))
        fields = [trim(row["field" + str(i)]) for i in range(1, 8)]
        a, b, c, d, e, f, g = fields
        if not a:
            continue
        if kind == "dictionary":
            result["dictionary"].append({
                "word": a, "pos": b, "meaning": c, "sentence": d,
                "pictureUrl": https_picture(e),
                "categories": [part.strip() for part in f.split("|") if part.strip()][:12],
                "id": g,
            })
        elif kind == "category":
            result["categories"].append({"name": a, "zh": b, "emoji": c, "description": d, "order": e})
        elif kind == "spelling":
            result["spelling"].append({
                "word": a, "pos": b, "focus": c, "pronunciation": d,
                "meaning": e, "pictureUrl": https_picture(f), "strategy": g,
            })
        elif kind == "frequency":
            result["frequency"].append({"word": a, "group": b, "sentence": c})
        elif kind == "study":
            if a not in STUDY_TYPES:
                raise ValueError("Unknown WordStudy type on line %s: %s" % (line, a))
            result["study"].append({
                "type": a, "word": b, "related": c, "affix": d,
                "rule": e, "sentence": f,
            })
    # Keep categories in their teacher-defined order.
    result["categories"].sort(key=lambda r: int(r["order"]) if r["order"].isdigit() else 99999)
    return result


def main():
    url = os.environ.get("PUBLIC_CSV_URL", "").strip()
    if not url:
        print("PUBLIC_CSV_URL is not configured; no data will be synced.")
        return
    result = build(load_csv(url))
    path = pathlib.Path("data/library.json")
    path.parent.mkdir(parents=True, exist_ok=True)
    text = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
    if not path.exists() or path.read_text(encoding="utf-8") != text:
        path.write_text(text, encoding="utf-8")
        print("Updated %s (%s dictionary words, %s categories)." % (path, len(result["dictionary"]), len(result["categories"])))
    else:
        print("Published data is unchanged.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("ERROR: %s" % error, file=sys.stderr)
        sys.exit(1)
