# Synthesis and Mapping

Visual representation of the research project using **IBM Carbon Design
System** with React + Vite.\
The app showcases **system diagrams, mind maps, and other visual tools**
to explore complexity.\
It supports light/dark themes, zoomable diagrams, and GitHub Pages
deployment.

------------------------------------------------------------------------

## 🚀 Features

-   Built with **React + Vite**
-   Styled using **IBM Carbon Design System (g10 / g90 themes)**
-   Typography via **IBM Plex Sans**
-   **Header bar** with theme switcher (light ↔ dark)
-   **Breadcrumbs** for navigation
-   **Interactive diagrams** (zoom / pan / pinch with trackpad or
    mobile)
-   Deployed to **GitHub Pages**

------------------------------------------------------------------------

## 📦 Getting Started (Local Development)

1.  Clone this repo:

    ``` bash
    git clone https://github.com/MunoMono/synthesis-and-mapping.git
    cd synthesis-and-mapping
    ```

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Run local dev server:

    ``` bash
    npm run dev
    ```

    Open <http://localhost:5173> in your browser.

------------------------------------------------------------------------

## 🛠 Useful Commands

-   **Run locally** → `npm run dev`\
-   **Build for production** → `npm run build` (output goes to `/dist`)\
-   **Preview production build locally** → `npm run preview`\
-   **Deploy to GitHub Pages** → `npm run deploy`

------------------------------------------------------------------------

## 🌍 Deployment

The app is deployed via the `gh-pages` branch to GitHub Pages.

### One-time setup

1.  In your repo on GitHub:
    -   Go to **Settings → Pages**\
    -   Under **Build and deployment**, choose:
        -   Source → **Deploy from branch**\
        -   Branch → `gh-pages`\
        -   Folder → `/ (root)`\
2.  Save.

### Deploy updates

Every time you want to push a new version live:

``` bash
npm run deploy
```

This will: - Build the app into `/dist` - Push that folder to the
`gh-pages` branch

### Live site

👉 <https://MunoMono.github.io/synthesis-and-mapping>

------------------------------------------------------------------------

## 📖 Project Context

This project is part of my PhD research at the **Royal College of
Art**.\
It provides a framework to **visualise complexity** through world-class
diagrams, styled consistently using IBM Carbon Design System.

Diagrams are typically: - Created in **Mermaid** (for structure)\
- Styled in **Miro** (to match design guidelines)\
- Exported as **SVG** and showcased in this React app

------------------------------------------------------------------------

## 🤝 Contributions

This is primarily a research project, but suggestions and feedback are
welcome.

------------------------------------------------------------------------

## 📜 License

MIT License --- see the [LICENSE](LICENSE) file for details.
