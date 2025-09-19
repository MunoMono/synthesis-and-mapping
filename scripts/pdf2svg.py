#!/usr/bin/env python3
import os
import shutil
import subprocess
import json
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = os.path.join(ROOT, "src", "assets", "miro-pdfs")
OUT_DIR = os.path.join(ROOT, "src", "assets")
DATA_FILE = os.path.join(ROOT, "src", "data", "diagrams.json")
EMBED_PLEX_SCRIPT = os.path.join(ROOT, "scripts", "embed-plex-in-svg.mjs")  # optional

def which(cmd):
    return shutil.which(cmd) is not None

def convert_pdf_to_svg(input_pdf, output_svg):
    """
    Try pdf2svg first (fast), fall back to Inkscape.
    """
    if which("pdf2svg"):
        subprocess.run(["pdf2svg", input_pdf, output_svg], check=True)
        return "pdf2svg"
    elif which("inkscape"):
        subprocess.run(["inkscape", input_pdf, "--export-plain-svg", output_svg], check=True)
        return "inkscape"
    else:
        raise RuntimeError(
            "No converter found. Install either 'pdf2svg' (brew install pdf2svg) "
            "or 'Inkscape' and ensure it’s on your PATH."
        )

def embed_plex(svg_paths):
    """
    Optionally run your Plex embedder on just the newly created SVGs.
    """
    if not os.path.exists(EMBED_PLEX_SCRIPT):
        return False
    try:
        subprocess.run(
            ["node", EMBED_PLEX_SCRIPT, *svg_paths],
            check=True
        )
        return True
    except Exception:
        return False

def load_json(path):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    if not os.path.isdir(PDF_DIR):
        print(f"⚠️ No such directory: {PDF_DIR}")
        return

    os.makedirs(OUT_DIR, exist_ok=True)

    pdfs = [f for f in os.listdir(PDF_DIR) if f.lower().endswith(".pdf")]
    if not pdfs:
        print("⚠️ No PDF files found in src/assets/miro-pdfs/")
        return

    data = load_json(DATA_FILE)
    existing_slugs = {entry.get("slug") for entry in data if "slug" in entry}

    new_svgs = []
    for pdf in pdfs:
        slug = os.path.splitext(pdf)[0]
        in_path = os.path.join(PDF_DIR, pdf)
        out_svg = slug + ".svg"
        out_path = os.path.join(OUT_DIR, out_svg)

        print(f"🔄 Converting {in_path} → {out_path}")
        used = convert_pdf_to_svg(in_path, out_path)
        print(f"   ✅ Converted with {used}")

        # record to embed later
        new_svgs.append(out_path)

        # Register in diagrams.json if missing
        if slug not in existing_slugs:
            entry = {
                "slug": slug,
                "title": slug.replace("-", " ").title(),
                "desc": "Imported from Miro (PDF → SVG)",
                "file": f"assets/{out_svg}",   # detail view uses this
                "thumb": f"assets/{out_svg}",  # card thumbnail uses this
                "tags": ["miro", "import"],
                "date": str(date.today())
            }
            data.append(entry)
            existing_slugs.add(slug)
            print(f"   ➕ Added entry to diagrams.json: {slug}")
        else:
            print(f"   ℹ️  Entry already exists in diagrams.json: {slug} (skipping add)")

    # Save JSON if changed
    save_json(DATA_FILE, data)
    print(f"📝 Updated {DATA_FILE}")

    # Optionally embed IBM Plex into the new SVGs
    if new_svgs and os.path.exists(EMBED_PLEX_SCRIPT):
        print("🔧 Embedding IBM Plex into newly converted SVGs…")
        ok = embed_plex(new_svgs)
        print("   ✅ Plex embedded" if ok else "   ⚠️ Plex embedding step skipped/failed")

    print("🎉 Done.")

if __name__ == "__main__":
    main()