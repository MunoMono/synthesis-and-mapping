import { useParams, Link } from "react-router-dom";
import { Grid, Column, Heading, Button } from "@carbon/react";
import { Download } from "@carbon/icons-react";
import Crumb from "../components/Crumb.jsx";
import fallbackSvg from "../assets/placeholder.svg";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import diagrams from "../data/diagrams.json";

// Eagerly import all assets for full-size diagram resolution
const assetUrls = import.meta.glob("../assets/*.{svg,png,jpg,jpeg,webp}", {
  eager: true,
  as: "url",
});

function resolveEntry(slug) {
  return diagrams.find((d) => d.slug === slug);
}

function resolveDiagramUrl(entry) {
  if (!entry) return fallbackSvg;
  // prefer explicit file if present
  if (entry.file && assetUrls[`../assets/${entry.file}`]) {
    return assetUrls[`../assets/${entry.file}`];
  }
  // default to slug.svg in /src/assets
  return assetUrls[`../assets/${entry.slug}.svg`] || fallbackSvg;
}

// parse width/height from SVG text; fall back to viewBox or defaults
function getSvgSize(svgText) {
  const widthMatch = svgText.match(/width="([\d.]+)(px)?"/i);
  const heightMatch = svgText.match(/height="([\d.]+)(px)?"/i);
  if (widthMatch && heightMatch) {
    return { w: parseFloat(widthMatch[1]), h: parseFloat(heightMatch[1]) };
  }
  const viewBoxMatch = svgText.match(/viewBox="([\d.\s-]+)"/i);
  if (viewBoxMatch) {
    const [, vb] = viewBoxMatch;
    const parts = vb.trim().split(/\s+/).map(Number);
    if (parts.length === 4) return { w: parts[2], h: parts[3] };
  }
  return { w: 1200, h: 800 }; // sensible default
}

export default function Diagram() {
  const { slug } = useParams();
  const entry =
    resolveEntry(slug) ||
    resolveEntry("interpretivist-research-process") || {
      slug: "placeholder",
      title: "Diagram",
      desc: "Static SVG diagram",
    };

  const svgUrl = resolveDiagramUrl(entry);

  // ----- Download: SVG (as-is) -----
  const handleDownloadSVG = async () => {
    const res = await fetch(svgUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${entry.slug}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

// ----- Download: PNG (render SVG -> canvas -> png) -----
const handleDownloadPNG = async () => {
  const svgText = await (await fetch(svgUrl)).text();

  // Get a reliable drawing size from width/height or viewBox
  const getSvgSize = (text) => {
    const w = text.match(/width="([\d.]+)(px)?"/i);
    const h = text.match(/height="([\d.]+)(px)?"/i);
    if (w && h) return { w: parseFloat(w[1]), h: parseFloat(h[1]) };
    const vb = text.match(/viewBox="([\d.\s-]+)"/i);
    if (vb) {
      const [, box] = vb;
      const parts = box.trim().split(/\s+/).map(Number);
      if (parts.length === 4) return { w: parts[2], h: parts[3] };
    }
    return { w: 1200, h: 800 }; // sensible fallback
  };

  const { w, h } = getSvgSize(svgText);

  // 2x scale for crisp PNG
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);

  const ctx = canvas.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Use a Blob URL to avoid cross-origin taint
  const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const blobUrl = URL.createObjectURL(blob);

  try {
    const img = new Image();
    img.src = blobUrl;

    // Ensure the image is decoded before drawing (prevents partial draws/clipping)
    await img.decode();

    // Optional: clear / paint background (uncomment to force a background color)
    // ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--cds-layer') || '#ffffff';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the SVG scaled to the full canvas size (prevents clipping)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((pngBlob) => {
      const url = URL.createObjectURL(pngBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${meta.slug}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  } catch (e) {
    console.error(e);
    alert("Sorry, PNG export failed.");
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};
  return (
    <div style={{ padding: "1rem" }}>
      <Crumb
        trail={[
          { label: "Home", to: "/" },
          { label: entry.title, isCurrentPage: true },
        ]}
      />

      <Grid fullWidth narrow style={{ marginTop: "1rem" }}>
        <Column lg={16} md={8} sm={4}>
          <Heading as="h1" className="t-heading-03">
            {entry.title}
          </Heading>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <div className="figure" style={{ marginTop: "1rem" }}>
            <div
              style={{
                border: "1px solid var(--cds-border-subtle)",
                background: "var(--cds-layer)",
                height: "70vh",
                width: "100%",
                overflow: "hidden",
              }}
              aria-label="Interactive diagram area"
            >
              <TransformWrapper
                minScale={0.5}
                initialScale={1}
                doubleClick={{ disabled: false }}
                wheel={{ step: 0.1 }}
                panning={{ velocityDisabled: true }}
                pinch={{ step: 5 }}
              >
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                  <img
                    src={svgUrl}
                    alt={entry.title}
                    style={{ display: "block", maxWidth: "none", width: "100%" }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>

            {/* Caption */}
            <div className="figure__caption t-helper-text-01" style={{ marginTop: "0.5rem" }}>
              {entry.caption || entry.desc}
            </div>

            {/* Actions */}
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Button kind="tertiary" onClick={handleDownloadPNG} renderIcon={Download}>
                Download PNG
              </Button>
              <Button kind="tertiary" onClick={handleDownloadSVG} renderIcon={Download}>
                Download SVG
              </Button>
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <Link to="/" aria-label="Back to Home">
                ← Back to Home
              </Link>
            </div>
          </div>
        </Column>
      </Grid>
    </div>
  );
}