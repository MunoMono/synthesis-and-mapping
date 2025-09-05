import { Grid, Column, ClickableTile, Heading, Tag } from "@carbon/react";
import { Link } from "react-router-dom";
import Crumb from "../components/Crumb.jsx";
import { formatDate } from "../utils/formatDate.js";
import fallbackThumb from "../assets/placeholder.svg";
import diagrams from "../data/diagrams.json";

// Eagerly import all assets in src/assets and get their URLs
// JSON can list "thumb": "filename.svg"
const assetUrls = import.meta.glob("../assets/*.{svg,png,jpg,jpeg,webp}", {
  eager: true,
  as: "url",
});

// Normalize JSON → items used by UI
const items = diagrams.map((d) => {
  const resolvedThumb =
    assetUrls[`../assets/${d.thumb}`] ||
    assetUrls[`../assets/${d.slug}.svg`] ||
    fallbackThumb;

  return {
    ...d,
    thumb: resolvedThumb,
  };
});

export default function Home() {
  return (
    <div style={{ padding: "1rem" }}>
      <Crumb trail={[{ label: "Home", isCurrentPage: true }]} />

      <Grid fullWidth narrow style={{ marginTop: "1rem" }}>
        <Column lg={16} md={8} sm={4}>
          <Heading
            as="h1"
            className="t-heading-03"
            style={{ marginBottom: "1rem" }}
          >
            Diagramming the research process with visual communication
          </Heading>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <div className="cardGrid">
            {items.map((d) => (
              <Link
                key={d.slug}
                to={`/diagram/${d.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ClickableTile style={{ padding: "1rem" }}>
                  <img
                    src={d.thumb}
                    alt={`${d.title} thumbnail`}
                    className="figure__image"
                  />
                  <div style={{ marginTop: "0.75rem", fontWeight: 600 }}>
                    {d.title}
                  </div>
                  <div style={{ marginTop: "0.25rem" }}>{d.desc}</div>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      display: "flex",
                      gap: "0.25rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {d.tags.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                  {/* Date line (Carbon label-01 via token class) */}
                  <div
                    className="t-helper-text-01"
                    style={{
                      marginTop: "0.75rem",
                      color: "var(--cds-text-secondary)",
                    }}
                  >
                    Posted: {formatDate(d.date)}
                  </div>{" "}
                </ClickableTile>
              </Link>
            ))}
          </div>
        </Column>
      </Grid>
    </div>
  );
}
