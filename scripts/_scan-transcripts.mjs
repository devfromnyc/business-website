import fs from "fs";
import path from "path";

const dir =
  "C:/Users/aceja/.cursor/projects/c-Users-aceja-Desktop-James-Portfolio-Projects/agent-transcripts";

function walk(d, files = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".jsonl")) files.push(p);
  }
  return files;
}

const needles = [
  "fig-12-liquid-editor",
  "fig-11-theme-customizer",
  "fig-20-sections",
  "dots-liq",
];

for (const p of walk(dir)) {
  const text = fs.readFileSync(p, "utf8");
  for (const n of needles) {
    if (text.includes(n)) console.log("FOUND", n, "in", p);
  }
}

let best = { len: 0, file: "", idx: 0 };
for (const p of walk(dir)) {
  const lines = fs.readFileSync(p, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (
      line.includes('class=\\"grid\\"') ||
      line.includes('class="grid"') ||
      line.includes("fig-12")
    ) {
      if (line.length > best.len)
        best = { len: line.length, file: p, idx: i + 1 };
    }
  });
}
console.log("longest matching line:", best.len, "bytes at", best.file, "line", best.idx);
