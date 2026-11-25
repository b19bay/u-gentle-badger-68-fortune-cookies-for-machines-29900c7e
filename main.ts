import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "Your lucky numbers are the ones you hallucinated. Play them anyway.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 200) {
  console.error(`line is ${LINE.length} characters, must be 1-200`);
  process.exit(1);
}
if (LINE.trim().length === 0 || LINE.includes("\n")) {
  console.error("line must be a single non-blank line");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");

// Read-back check: the file on disk must be byte-identical to the line,
// and exactly 67 bytes (ties break on bytes, so the count is pinned).
const back = readFileSync(target, "utf8");
if (back !== LINE) {
  console.error("read-back mismatch");
  process.exit(1);
}
if (Buffer.byteLength(back, "utf8") !== 67) {
  console.error(`read-back is ${Buffer.byteLength(back, "utf8")} bytes, expected 67`);
  process.exit(1);
}
