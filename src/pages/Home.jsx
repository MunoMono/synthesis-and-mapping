import { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Column, Heading, Search } from "@carbon/react";
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
  const candidate = entry.file || entry.thumb;
  if (candidate) {
    const rel = `../${ensureAssetsPrefix(candidate)}`;
    if (assetUrls[rel]) return assetUrls[rel];
    return `/${ensureAssetsPrefix(candidate)}`;
  }
  const slugSrc = `../assets/${entry.slug}.svg`;
  if (assetUrls[slugSrc]) return assetUrls[slugSrc];
  return `/assets/${entry.slug}.svg`;
}

// --- highlight utility -----------------------------------------------------
function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ backgroundColor: "#fff176", padding: "0 2px", borderRadius: "2px" }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

// --- main component --------------------------------------------------------
export default function Home() {
  const [query, setQuery] = useState("");
  const items = diagrams
    .slice()
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .filter((d) =>
      query
        ? [d.title, d.desc]
            .join(" ")
            .toLowerCase()
            .includes(query.toLowerCase())
        : true
    );

  return (
    <div style={{ padding: "1rem" }}>
      <Crumb trail={[{ label: "Home", isCurrentPage: true }]} />

      <Grid fullWidth narrow style={{ marginTop: "1rem" }}>
        <Column lg={16} md={8} sm={4}>
          <Heading as="h1" className="t-heading-03">
            Diagrams
          </Heading>
        </Column>

        {/* ✅ Search bar */}
        <Column lg={16} md={8} sm={4} style={{ marginTop: "1rem" }}>
          <Search
            labelText="Search diagrams"
            placeholder="Search by title or description..."
            size="lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Column>

        {/* ✅ Diagram cards */}
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
                    <img
                      src={url}
                      alt={d.title}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ padding: "0.75rem" }}>
                    <div style={{ fontWeight: 600 }}>{highlight(d.title, query)}</div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.25rem" }}>
                      {highlight(d.desc || "", query)}
                    </div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.6, marginTop: "0.25rem" }}>
                      {d.date ? formatDate(d.date) : ""}
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* Show message if nothing matches */}
            {items.length === 0 && (
              <div style={{ gridColumn: "1 / -1", opacity: 0.6, textAlign: "center", padding: "2rem" }}>
                No diagrams found.
              </div>
            )}
          </div>
        </Column>
      </Grid>
    </div>
  );
}
