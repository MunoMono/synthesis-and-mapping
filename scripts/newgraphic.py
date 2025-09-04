#!/usr/bin/env python3
import json
import os
from datetime import date

# Resolve paths relative to project root
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(ROOT, "src/data/diagrams.json")
ASSETS_DIR = os.path.join(ROOT, "src/assets")

def main():
    print("➕ Add a new diagram entry\n")

    slug = input("Slug (no spaces, e.g. 'network-map'): ").strip()
    title = input("Title: ").strip()
    desc = input("Description: ").strip()
    thumb = input("Thumbnail filename (place in src/assets/, e.g. 'network-map.svg'): ").strip()

    tags_raw = input("Tags (comma separated, e.g. 'systems, complexity'): ").strip()
    tags = [t.strip() for t in tags_raw.split(",") if t.strip()]

    today = str(date.today())

    new_entry = {
        "slug": slug,
        "title": title,
        "desc": desc,
        "thumb": thumb,
        "tags": tags,
        "date": today
    }

    if not os.path.exists(DATA_FILE):
        print(f"⚠️ Could not find {DATA_FILE}")
        return

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    if any(entry["slug"] == slug for entry in data):
        print(f"⚠️ Slug '{slug}' already exists in {DATA_FILE}")
        return

    data.append(new_entry)

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ Added new diagram '{title}' with slug '{slug}'")
    print(f"   → thumbnail: src/assets/{thumb}")
    print(f"   → date: {today}")

if __name__ == "__main__":
    main()