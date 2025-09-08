import { useParams, Link } from "react-router-dom";
import { Grid, Column, Heading, Button } from "@carbon/react";
import { Download } from "@carbon/icons-react";
import Crumb from "../components/Crumb.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import diagrams from "../data/diagrams.json";
import { marked } from "marked";

// Resolve diagram asset URLs (works for svg/png/jpg/jpeg/webp in src/assets)
const assetUrls = import.meta.glob("../assets/*.{svg,png,jpg,jpeg,webp}", {
  eager: true,
  as: "url",
});

// Resolve per-diagram annotations as raw markdown (eager)
const annotationModules = import.meta.glob("../assets/annotations/*.md", {
  eager: true,
  as: "raw",
});

function resolveEntry(slug) {
  return diagrams.find((d) => d.slug === slug);
}

function ensureAssetsPrefix(path) {
  return path.startsWith("assets/") ? path : `assets/${path}`;
}

function resolveDiagramUrl(entry) {
  if (!entry) return null;

  // Prefer explicit file path from the manifest
  if (entry.file) {
    const rel = `../${ensureAssetsPrefix(entry.file)}`;
    // 1) If the file is in src/assets, Vite gives us a built asset URL
    if (assetUrls[rel]) return assetUrls[rel];
    // 2) Otherwise, assume it lives in /public/assets and use a public URL
    return `/${ensureAssetsPrefix(entry.file)}`;
  }

  // Fallback: try slug.svg (src/assets first, then /public/assets)
  const candidate = `../assets/${entry.slug}.svg`;
  if (assetUrls[candidate]) return assetUrls[candidate];
  return `/assets/${entry.slug}.svg`;
}

function resolveAnnotationMd(entry) {
  if (!entry) return null;
  const name = entry.annotation || `${entry.slug}.md`;
  return annotationModules[`../assets/annotations/${name}`] || null;
}

function getExtFromName(name) {
  const m = name?.toLowerCase().match(/\.(svg|png|jpe?g|webp)(\?|#|$)/);
  return m ? m[1] : null;
}

// Parse width/height from SVG text; fall back to viewBox or defaults
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
  return { w: 1200, h: 800 };
}

export default function Diagram() {
  const { slug } = useParams();

  const entry =
    resolveEntry(slug) ||
    resolveEntry("interpretivist-research-process") || {
      slug: "placeholder",
      title: "Diagram",
      desc: "Static diagram",
    };

  const fileUrl = resolveDiagramUrl(entry);
  const annotationMd = resolveAnnotationMd(entry);
  const annotationHtml = annotationMd ? marked.parse(annotationMd) : null;

  const fileNameGuess = entry.file || `${entry.slug}.svg`;
  const ext = getExtFromName(fileNameGuess);
  const isSvg = ext === "svg";

  // Download original file as-is
  const handleDownloadOriginal = async () => {
    const res = await fetch(fileUrl, { cache: "no-cache" });
    const blob = await res.blob();
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `${entry.slug}.${ext || "img"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Download PNG (SVG → rasterize; raster → transcode to PNG)
  const handleDownloadPNG = async () => {
    try {
      if (isSvg) {
        const svgText = await (await fetch(fileUrl)).text();
        const { w, h } = getSvgSize(svgText);
        const scale = 2;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext("2d", { alpha: true });

        const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.src = blobUrl;
        await img.decode();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(blobUrl);

        canvas.toBlob((pngBlob) => {
          const url = URL.createObjectURL(pngBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${entry.slug}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, "image/png");
      } else {
        // Raster to PNG
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = fileUrl;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((pngBlob) => {
          const url = URL.createObjectURL(pngBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${entry.slug}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, "image/png");
      }
    } catch (e) {
      console.error(e);
      alert("Sorry, PNG export failed.");
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
                    src={fileUrl}
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

            {/* Per-diagram annotations (Markdown) */}
            {annotationHtml && (
              <div
                className="carbon-markdown"
                style={{ marginTop: "1rem" }}
                dangerouslySetInnerHTML={{ __html: annotationHtml }}
              />
            )}

            {/* Actions */}
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Button kind="tertiary" onClick={handleDownloadPNG} renderIcon={Download}>
                Download PNG
              </Button>
              {isSvg && (
                <Button kind="tertiary" onClick={handleDownloadOriginal} renderIcon={Download}>
                  Download SVG
                </Button>
              )}
              {!isSvg && (
                <Button kind="tertiary" onClick={handleDownloadOriginal} renderIcon={Download}>
                  Download Image
                </Button>
              )}
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