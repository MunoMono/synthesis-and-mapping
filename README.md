
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
  brew install graphviz
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

Diagrams are defined as **Markdown specs** inside:

```
src/assets/diagrams/
```

Each file contains a flowchart block (Mermaid-like syntax) with optional front-matter config and Carbon color classes, for example:

```markdown
---
config:
  layout: dagre
---
flowchart TD
  A["Context Engineering Strategy"] --> B{"Context Components"}
  B --> C1["cinstr"] & C2["cknow"]
  A:::carbonPink
  B:::carbonDefault
  C1:::carbonBlue
  C2:::carbonBlue
  classDef carbonPink fill:#ff7eb6,stroke:#393939,color:#161616
  classDef carbonBlue fill:#78a9ff,stroke:#393939,color:#161616
```

### Render a single diagram

```bash
python3 scripts/draw.py   -i src/assets/diagrams/context-engineering.md   -o src/assets/context-engineering.svg
```

### Render all diagrams

```bash
python3 scripts/draw.py -i src/assets/diagrams --outdir src/assets
```

SVG outputs are written into `src/assets/` and displayed in the app.

---

## 🛠 Useful Commands

- **Run locally** → `npm run dev`  
- **Build for production** → `npm run build` (output goes to `/dist`)  
- **Preview production build locally** → `npm run preview`  
- **Deploy to GitHub Pages** → `npm run deploy`  
- **Render all diagrams** → `npm run draw` (alias for the Python script)

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

Diagrams are now authored in **Markdown**, rendered with a custom **Python + Graphviz pipeline**, and displayed as **interactive Carbon-styled SVGs**.

---

## 🤝 Contributions

This is primarily a research project, but suggestions and feedback are welcome.

---

## 📜 License

MIT License — see the [LICENSE](LICENSE) file for details.
