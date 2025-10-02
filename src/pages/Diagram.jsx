import { useParams, Link } from "react-router-dom";
import { Grid, Column, Heading, Button } from "@carbon/react";
import { Download } from "@carbon/icons-react";
import Crumb from "../components/Crumb.jsx";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import diagrams from "../data/diagrams.json";
import { marked } from "marked";

// Asset resolution
const assetUrls = import.meta.glob("../assets/*.{svg,png,jpg,jpeg,webp}", {
  eager: true,
  as: "url",
});
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
  if (entry.file) {
    const rel = `../${ensureAssetsPrefix(entry.file)}`;
    if (assetUrls[rel]) return assetUrls[rel];
    return `/${ensureAssetsPrefix(entry.file)}`;
  }
  const candidate = `../assets/${entry.slug}.svg`;
  return assetUrls[candidate] || `/assets/${entry.slug}.svg`;
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
function getSvgSize(svgText) {
  const widthMatch = svgText.match(/width="([\d.]+)(px)?"/i);
  const heightMatch = svgText.match(/height="([\d.]+)(px)?"/i);
  if (widthMatch && heightMatch) return { w: +widthMatch[1], h: +heightMatch[1] };
  const viewBoxMatch = svgText.match(/viewBox="([\d.\s-]+)"/i);
  if (viewBoxMatch) {
    const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
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

  const handleDownloadOriginal = async () => {
    const res = await fetch(fileUrl, { cache: "no-cache" });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `${entry.slug}.${ext || "img"}`,
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPNG = async () => {
    try {
      if (isSvg) {
        const svgText = await (await fetch(fileUrl)).text();
        const { w, h } = getSvgSize(svgText);
        const canvas = document.createElement("canvas");
        canvas.width = w * 2;
        canvas.height = h * 2;
        const ctx = canvas.getContext("2d", { alpha: true });
        const img = new Image();
        img.src = URL.createObjectURL(new Blob([svgText], { type: "image/svg+xml" }));
        await img.decode();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((pngBlob) => {
          const url = URL.createObjectURL(pngBlob);
          const a = Object.assign(document.createElement("a"), {
            href: url,
            download: `${entry.slug}.png`,
          });
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, "image/png");
      } else {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = fileUrl;
        await img.decode();
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d").drawImage(img, 0, 0);
        canvas.toBlob((pngBlob) => {
          const url = URL.createObjectURL(pngBlob);
          const a = Object.assign(document.createElement("a"), {
            href: url,
            download: `${entry.slug}.png`,
          });
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        }, "image/png");
      }
    } catch (err) {
      console.error(err);
      alert("Sorry, PNG export failed.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Crumb trail={[{ label: "Home", to: "/" }, { label: entry.title, isCurrentPage: true }]} />

      <Grid fullWidth narrow style={{ marginTop: "1rem" }}>
        <Column lg={16} md={8} sm={4}>
          <Heading as="h1" className="t-heading-03">{entry.title}</Heading>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <div style={{ marginTop: "1rem" }}>
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
              <TransformWrapper minScale={0.5} initialScale={1}>
                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
                  <img
                    src={fileUrl}
                    alt={entry.title}
                    style={{ display: "block", maxWidth: "none", width: "100%" }}
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>

            <div style={{ marginTop: "0.5rem" }} className="t-helper-text-01">
              {entry.caption || entry.desc}
            </div>

            {annotationHtml && (
              <div
                style={{ marginTop: "1rem" }}
                className="carbon-markdown"
                dangerouslySetInnerHTML={{ __html: annotationHtml }}
              />
            )}

            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <Button kind="tertiary" onClick={handleDownloadPNG} renderIcon={Download}>
                Download PNG
              </Button>
              <Button kind="tertiary" onClick={handleDownloadOriginal} renderIcon={Download}>
                {isSvg ? "Download SVG" : "Download Image"}
              </Button>
            </div>

            <div style={{ marginTop: "0.75rem" }}>
              <Link to="/" aria-label="Back to Home">← Back to Home</Link>
            </div>
          </div>
        </Column>
      </Grid>
    </div>
  );
}
