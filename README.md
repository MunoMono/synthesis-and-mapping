# Synthesis and Mapping

Visual representation of the research project using the **IBM Carbon Design System** with **React + Vite** and a custom **Markdown → SVG diagramming pipeline**.

This app showcases **system diagrams, mind maps, and visual tools** to explore complexity. It supports light/dark themes, zoomable diagrams, and automatic deployment to GitHub Pages.

---

## 🚀 Features

- Built with **React + Vite**
- Styled using **IBM Carbon Design System (g10 / g90 / g100 themes)**
- Typography via **IBM Plex Sans**
- **Header bar** with theme switcher (light ↔ dark)
- **Breadcrumb navigation**
- **Interactive diagrams** (zoom / pan / pinch with trackpad or mobile)
- **Custom diagramming pipeline**: write diagrams in Markdown, render them as Carbon-styled SVG with Python
- **Miro PDF → SVG pipeline**: export diagrams from Miro as PDF, auto-convert to SVG for use in the app
- Deployed automatically to **GitHub Pages**

---

## 📦 Getting Started (Local Development)

### 1. Clone this repo

```bash
git clone https://github.com/MunoMono/synthesis-and-mapping.git
cd synthesis-and-mapping
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Install Python dependencies

This project uses a Python-based diagram generator.

- **macOS**:
  ```bash
  brew install graphviz pdf2svg
  ```

- **Python deps**:
  ```bash
  python3 -m pip install graphviz pyyaml
  ```

### 4. Run the local dev server

```bash
npm run dev
```

Open <http://localhost:5173> in your browser.

---

## 🛠 Diagramming Workflow

### Markdown → SVG

Diagrams are defined as **Markdown specs** inside:

```
src/assets/diagrams/
```

Each file contains a flowchart block (Mermaid-like syntax) with optional front-matter config and Carbon color classes.

#### Render a single diagram

```bash
python3 scripts/draw.py   -i src/assets/diagrams/context-engineering.md   -o src/assets/context-engineering.svg
```

#### Render all diagrams

```bash
python3 scripts/draw.py -i src/assets/diagrams --outdir src/assets
```

SVG outputs are written into `src/assets/` and displayed in the app.

---

### Miro PDF → SVG

You can also drop Miro exports (PDF) into:

```
src/assets/miro-pdfs/
```

Convert them into SVG with:

```bash
npm run convert:miro
```

This uses the helper script `scripts/pdf2svg.py` and `pdf2svg` under the hood.

Outputs go into:

```
src/assets/*.svg
```

and can then be registered into the gallery with:

```bash
python3 scripts/newgraphic.py
```

### PNG Gallery Thumbnails

Gallery cards can use lightweight PNG previews while the detail view keeps the original artwork.

```bash
npm run thumbs
```

This command generates managed thumbnails in:

```bash
src/assets/thumbs/
```

Builds run it automatically, and it only regenerates thumbnails when the source artwork changes.

Workflow:

- Add or update your main artwork in `src/assets/`
- Register it in `src/data/diagrams.json`
- Let the build create `src/assets/thumbs/<slug>.png` automatically
- If you want a hand-crafted preview, replace that PNG manually; the generator will stop overwriting it

If a diagram entry has an explicit `thumb`, the gallery uses that first. Otherwise it prefers `src/assets/thumbs/<slug>.png` when present and falls back to the original file.

---

## 🛠 Useful Commands

- **Run locally** → `npm run dev`  
- **Build for production** → `npm run build` (output goes to `/dist`)  
- **Preview production build locally** → `npm run preview`  
- **Deploy to GitHub Pages** → `npm run deploy`  
- **Render all diagrams** → `npm run draw` (alias for the Python script)  
- **Convert Miro PDFs** → `npm run convert:miro`  

---

## 🌍 Deployment

The app is deployed via the `gh-pages` branch to GitHub Pages.

### One-time setup

1. In your repo on GitHub:  
   - Go to **Settings → Pages**  
   - Under **Build and deployment**, choose:  
     - Source → **Deploy from branch**  
     - Branch → `gh-pages`  
     - Folder → `/ (root)`  
2. Save.

### Deploy updates

```bash
# 1. Save your work to GitHub (main branch)
git add .
git commit -m "Your message"
git push

# 2. Deploy the latest build to GitHub Pages
npm run deploy
```

This will:  
- Build the app into `/dist`  
- Push that folder to the `gh-pages` branch  

👉 Live site: <https://munomono.github.io/synthesis-and-mapping/>

---

## 📖 Project Context

This project is part of my PhD research at the **Royal College of Art**.  
It provides a framework to **visualise complexity** through world-class diagrams, styled consistently using IBM Carbon Design System.

Diagrams are now authored in **Markdown**, exported from **Miro (PDF → SVG)**, rendered with a custom **Python + Graphviz pipeline**, and displayed as **interactive Carbon-styled SVGs**.

---

## 🤝 Contributions

This is primarily a research project, but suggestions and feedback are welcome.

---

## 📜 License

MIT License — see the [LICENSE](LICENSE) file for details.
