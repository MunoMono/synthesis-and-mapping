// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { Grid, Column, Heading } from "@carbon/react";
import Crumb from "../components/Crumb.jsx";
import { formatDate } from "../utils/formatDate.js";
import diagrams from "../data/diagrams.json";

// Resolve thumbnails from src/assets at build time
const assetUrls = import.meta.glob("../assets/*.{svg,png,jpg,jpeg,webp}", {
  eager: true,
  as: "url",
});

// --- helpers ---------------------------------------------------------------
function ensureAssetsPrefix(path) {
  return path?.startsWith("assets/") ? path : `assets/${path}`;
}
function resolveThumbUrl(entry) {
  // Prefer explicit file, then thumb; support src/assets and /public/assets
  const candidate = entry.file || entry.thumb;
  if (candidate) {
    const rel = `../${ensureAssetsPrefix(candidate)}`;
    if (assetUrls[rel]) return assetUrls[rel];       // bundled from src/assets
    return `/${ensureAssetsPrefix(candidate)}`;       // served from /public/assets
  }
  // final fallback: try slug.svg (src then public)
  const slugSrc = `../assets/${entry.slug}.svg`;
  if (assetUrls[slugSrc]) return assetUrls[slugSrc];
  return `/assets/${entry.slug}.svg`;
}

export default function Home() {
  const items = diagrams.slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  return (
    <div style={{ padding: "1rem" }}>
      <Crumb trail={[{ label: "Home", isCurrentPage: true }]} />

      <Grid fullWidth narrow style={{ marginTop: "1rem" }}>
        <Column lg={16} md={8} sm={4}>
          <Heading as="h1" className="t-heading-03">Diagrams</Heading>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {items.map((d) => {
              const url = resolveThumbUrl(d);
              return (
                <Link
                  key={d.slug}
                  to={`/diagram/${d.slug}`}
                  style={{
                    border: "1px solid var(--cds-border-subtle)",
                    background: "var(--cds-layer)",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    color: "inherit",
                    overflow: "hidden",
                    display: "block",
                  }}
                  aria-label={`Open ${d.title}`}
                >
                  <div
                    style={{
                      aspectRatio: "4 / 3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      background: "var(--cds-layer-accent)",
                    }}
                  >
                    {/* Works for JPG/PNG/SVG; SVGs will render as images */}
                    <img
                      src={url}
                      alt={d.title}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: "0.75rem" }}>
                    <div style={{ fontWeight: 600 }}>{d.title}</div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.25rem" }}>
                      {d.desc}
                    </div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.25rem" }}>
                      {d.date ? formatDate(d.date) : ""}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Column>
      </Grid>
    </div>
  );
}