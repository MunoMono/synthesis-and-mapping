#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Use the IBM Plex files from the installed package
// Adjust weights/styles you actually use
const plexRegularPath = resolve(__dirname, '../node_modules/@ibm/plex/IBM-Plex-Sans/fonts/complete/woff2/IBMPlexSans-Regular.woff2')
const plexMediumPath  = resolve(__dirname, '../node_modules/@ibm/plex/IBM-Plex-Sans/fonts/complete/woff2/IBMPlexSans-Medium.woff2')
const plexBoldPath    = resolve(__dirname, '../node_modules/@ibm/plex/IBM-Plex-Sans/fonts/complete/woff2/IBMPlexSans-Bold.woff2')

function toDataUri(p) {
  const b64 = readFileSync(p).toString('base64')
  return `data:font/woff2;base64,${b64}`
}

const faceCss = `
@font-face{
  font-family:'IBM Plex Sans';
  font-style:normal;
  font-weight:400;
  src:url('${toDataUri(plexRegularPath)}') format('woff2');
  font-display:swap;
}
@font-face{
  font-family:'IBM Plex Sans';
  font-style:normal;
  font-weight:500;
  src:url('${toDataUri(plexMediumPath)}') format('woff2');
  font-display:swap;
}
@font-face{
  font-family:'IBM Plex Sans';
  font-style:normal;
  font-weight:700;
  src:url('${toDataUri(plexBoldPath)}') format('woff2');
  font-display:swap;
}
text, tspan {
  font-family: 'IBM Plex Sans', 'IBM Plex Sans Text', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;
}
`

function embedFonts(svgPath) {
  let svg = readFileSync(svgPath, 'utf8')
  if (!svg.includes('<svg')) {
    console.error(`✗ Not an SVG: ${svgPath}`)
    process.exit(1)
  }

  // Insert <style> after opening <svg ...>
  if (svg.includes('<style')) {
    // Prepend our @font-face to existing style
    svg = svg.replace('<style', `<style><![CDATA[${faceCss}]]></style><style`)
  } else {
    svg = svg.replace(
      /<svg([^>]*)>/i,
      (m, attrs) => `<svg${attrs}>\n<style><![CDATA[${faceCss}]]></style>\n`
    )
  }

  writeFileSync(svgPath, svg)
  console.log(`✓ Embedded IBM Plex into ${svgPath}`)
}

// CLI usage: node scripts/embed-plex-in-svg.mjs path1.svg path2.svg ...
const targets = process.argv.slice(2)
if (targets.length === 0) {
  console.log('Usage: node scripts/embed-plex-in-svg.mjs src/assets/your-diagram.svg [more.svg...]')
  process.exit(0)
}
targets.forEach(embedFonts)