import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const transcriptPath =
  process.argv[2] ||
  "C:/Users/aceja/.cursor/projects/c-Users-aceja-Desktop-James-Portfolio-Projects/agent-transcripts/db455e1e-c6b7-4a28-8cfc-95239b6ada81/db455e1e-c6b7-4a28-8cfc-95239b6ada81.jsonl";

const lines = fs.readFileSync(transcriptPath, "utf8").split("\n").filter(Boolean);
let content = "";

function walk(x) {
  if (typeof x === "string") {
    if (
      x.includes("fig-12-liquid-editor") &&
      x.includes('<div class="grid"') &&
      x.length > content.length
    ) {
      content = x;
    }
  } else if (Array.isArray(x)) {
    x.forEach(walk);
  } else if (x && typeof x === "object") {
    Object.values(x).forEach(walk);
  }
}

for (const line of lines) {
  if (!line.includes("fig-12-liquid-editor")) continue;
  try {
    walk(JSON.parse(line));
  } catch {
    /* skip */
  }
}

if (!content) {
  console.error("HTML block not found in", transcriptPath);
  process.exit(1);
}

console.log("Found content length:", content.length);

const figIds = [
  "fig-12-liquid-editor",
  "fig-13-admin-orders",
  "fig-14-product-page",
  "fig-15-checkout",
  "fig-16-app-marketplace",
  "fig-17-metafields",
  "fig-18-cli-dev",
  "fig-19-analytics",
  "fig-20-sections",
];

const chunksDir = path.join(__dirname, "chunks");
fs.mkdirSync(chunksDir, { recursive: true });

for (let i = 0; i < figIds.length; i++) {
  const figId = figIds[i];
  const num = String(12 + i);
  const startRe = new RegExp(`<figure id="${figId}"[^>]*>`, "i");
  const startMatch = content.match(startRe);
  if (!startMatch) {
    console.error(`Missing figure: ${figId}`);
    process.exit(1);
  }
  const start = startMatch.index;
  const nextFigId = figIds[i + 1];
  let end;
  if (nextFigId) {
    const nextRe = new RegExp(`<figure id="${nextFigId}"`, "i");
    const nextMatch = content.slice(start + 1).match(nextRe);
    if (!nextMatch) {
      console.error(`Missing next figure after ${figId}`);
      process.exit(1);
    }
    end = start + 1 + nextMatch.index;
  } else {
    end = content.indexOf("</figure>", start) + "</figure>".length;
    // find last closing figure tag for fig-20
    let searchFrom = start;
    while (true) {
      const idx = content.indexOf("</figure>", searchFrom);
      if (idx < 0) break;
      end = idx + "</figure>".length;
      const after = content.slice(end, end + 50);
      if (!after.includes("<figure")) break;
      searchFrom = idx + 1;
    }
  }
  const chunk = content.slice(start, end);
  const outPath = path.join(chunksDir, `fig-${num}.html`);
  fs.writeFileSync(outPath, chunk);
  console.log(`Wrote ${outPath} (${chunk.length} bytes)`);
}

// Also write full grid if requested
const gridStart = content.indexOf('<div class="grid"');
const gridEnd = content.lastIndexOf("</div>") + 6;
if (gridStart >= 0) {
  const html = content.slice(gridStart, gridEnd);
  fs.writeFileSync(path.join(__dirname, "illustration-source-full.html"), html);
  console.log(`Wrote illustration-source-full.html (${html.length} bytes)`);
}
