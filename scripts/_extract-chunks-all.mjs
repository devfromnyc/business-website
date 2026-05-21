import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir =
  "C:/Users/aceja/.cursor/projects/c-Users-aceja-Desktop-James-Portfolio-Projects/agent-transcripts";

function walkDir(d, files = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkDir(p, files);
    else if (e.name.endsWith(".jsonl")) files.push(p);
  }
  return files;
}

function walkObj(x, hits = []) {
  if (typeof x === "string") {
    if (x.includes("fig-12-liquid-editor") && x.includes('<div class="grid"')) {
      hits.push(x);
    }
  } else if (Array.isArray(x)) {
    x.forEach((v) => walkObj(v, hits));
  } else if (x && typeof x === "object") {
    Object.values(x).forEach((v) => walkObj(v, hits));
  }
  return hits;
}

let best = "";
for (const p of walkDir(dir)) {
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    if (!line.includes("fig-12-liquid-editor")) continue;
    try {
      for (const s of walkObj(JSON.parse(line))) {
        if (s.length > best.length) {
          best = s;
          console.log("candidate from", p, "len", s.length);
        }
      }
    } catch {
      /* skip */
    }
  }
}

if (!best) {
  console.error("No HTML grid found in any transcript");
  process.exit(1);
}

console.log("Using best content:", best.length, "bytes");

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
  const startMatch = best.match(startRe);
  if (!startMatch) {
    console.error(`Missing figure: ${figId}`);
    process.exit(1);
  }
  const start = startMatch.index;
  const nextFigId = figIds[i + 1];
  let end;
  if (nextFigId) {
    const nextRe = new RegExp(`<figure id="${nextFigId}"`, "i");
    const nextMatch = best.slice(start + 1).match(nextRe);
    if (!nextMatch) {
      console.error(`Missing next figure after ${figId}`);
      process.exit(1);
    }
    end = start + 1 + nextMatch.index;
  } else {
    let searchFrom = start;
    end = start;
    while (true) {
      const idx = best.indexOf("</figure>", searchFrom);
      if (idx < 0) break;
      end = idx + "</figure>".length;
      const after = best.slice(end, end + 80).trim();
      if (!after.startsWith("<figure")) break;
      searchFrom = idx + 1;
    }
  }
  const chunk = best.slice(start, end);
  fs.writeFileSync(path.join(chunksDir, `fig-${num}.html`), chunk);
  console.log(`Wrote fig-${num}.html (${chunk.length} bytes)`);
}
