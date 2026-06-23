import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(repoRoot, "src", "assets");
const thumbsDir = path.join(assetsDir, "thumbs");
const manifestPath = path.join(repoRoot, "src", "data", "diagrams.json");
const cachePath = path.join(thumbsDir, ".thumb-cache.json");

const MAX_WIDTH = Number.parseInt(process.env.THUMB_WIDTH || "1600", 10);
const MAX_HEIGHT = Number.parseInt(process.env.THUMB_HEIGHT || "1200", 10);

function ensureAssetsPrefix(filePath) {
  return filePath.startsWith("assets/") ? filePath : `assets/${filePath}`;
}

function isManagedThumbPath(filePath) {
  return /^assets\/thumbs\/.*\.png$/i.test(ensureAssetsPrefix(filePath));
}

function outputRelFor(entry) {
  return `assets/thumbs/${entry.slug}.png`;
}

function sourceRelFor(entry) {
  if (entry.file) return ensureAssetsPrefix(entry.file);
  if (entry.thumb && !isManagedThumbPath(entry.thumb)) return ensureAssetsPrefix(entry.thumb);
  return `assets/${entry.slug}.svg`;
}

async function readJson(filePath, fallbackValue) {
  try {
    const text = await fs.readFile(filePath, "utf8");
    return JSON.parse(text);
  } catch (error) {
    if (error.code === "ENOENT") return fallbackValue;
    throw error;
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function sha256(filePath) {
  const buffer = await fs.readFile(filePath);
  return createHash("sha256").update(buffer).digest("hex");
}

async function generateThumb(sourcePath, outputPath) {
  await sharp(sourcePath, { density: 300, limitInputPixels: false })
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function main() {
  await fs.mkdir(thumbsDir, { recursive: true });

  const diagrams = await readJson(manifestPath, []);
  const cache = await readJson(cachePath, {});
  const nextCache = {};

  const stats = {
    generated: 0,
    skippedFresh: 0,
    skippedManual: 0,
    missing: 0,
  };

  for (const entry of diagrams) {
    if (!entry?.slug) continue;

    const sourceRel = sourceRelFor(entry);
    const sourcePath = path.join(repoRoot, "src", sourceRel.replace(/^assets\//, "assets/"));
    const outputRel = outputRelFor(entry);
    const outputPath = path.join(repoRoot, "src", outputRel.replace(/^assets\//, "assets/"));

    if (!(await fileExists(sourcePath))) {
      console.warn(`Missing source for ${entry.slug}: ${sourceRel}`);
      stats.missing += 1;
      continue;
    }

    const sourceHash = await sha256(sourcePath);
    const cacheRecord = cache[outputRel];
    const outputExists = await fileExists(outputPath);
    const outputHash = outputExists ? await sha256(outputPath) : null;

    if (outputExists && cacheRecord?.outputHash && cacheRecord.outputHash !== outputHash) {
      nextCache[outputRel] = {
        sourceRel,
        sourceHash,
        outputHash,
        managed: false,
      };
      console.log(`Skipping hand-crafted thumbnail for ${entry.slug}`);
      stats.skippedManual += 1;
      continue;
    }

    if (
      outputExists &&
      cacheRecord?.managed &&
      cacheRecord.sourceHash === sourceHash &&
      cacheRecord.outputHash === outputHash
    ) {
      nextCache[outputRel] = cacheRecord;
      stats.skippedFresh += 1;
      continue;
    }

    await generateThumb(sourcePath, outputPath);
    const nextOutputHash = await sha256(outputPath);
    nextCache[outputRel] = {
      sourceRel,
      sourceHash,
      outputHash: nextOutputHash,
      managed: true,
      generatedAt: new Date().toISOString(),
    };
    console.log(`Generated ${outputRel}`);
    stats.generated += 1;
  }

  await fs.writeFile(cachePath, `${JSON.stringify(nextCache, null, 2)}\n`);
  console.log(
    `Thumbnail summary: ${stats.generated} generated, ${stats.skippedFresh} up to date, ${stats.skippedManual} hand-crafted, ${stats.missing} missing source.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});