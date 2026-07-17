import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const marketingRoot = process.env.KOINOS_MARKETING_DIR
  ? path.resolve(process.env.KOINOS_MARKETING_DIR)
  : path.resolve(root, "../marketing");
const inputPath = path.join(
  marketingRoot,
  "koinos-community-contributor-summaries-en.md"
);
const outputPath = path.join(root, "data", "history-people.json");

function parseMetricList(value) {
  const metrics = [];
  const pattern = /(.+?) \(([\d,]+)\)(?:, |$)/g;
  let match;

  while ((match = pattern.exec(value)) !== null) {
    metrics.push({
      label: match[1].trim(),
      count: Number(match[2].replaceAll(",", "")),
    });
  }

  return metrics;
}

function readMetadata(body, label) {
  const match = body.match(new RegExp(`^- \\*\\*${label}:\\*\\* (.+)$`, "m"));
  return match?.[1]?.trim() || "";
}

function parseProfiles(markdown) {
  const headingPattern = /^### (\d+)\. (.+)$/gm;
  const headings = [...markdown.matchAll(headingPattern)];

  return headings
    .map((heading, index) => {
      const bodyStart = heading.index + heading[0].length;
      const bodyEnd = headings[index + 1]?.index ?? markdown.length;
      const body = markdown.slice(bodyStart, bodyEnd).trim();
      const total = Number(
        readMetadata(body, "Verified contributions").replaceAll(",", "")
      );
      const narrativeStart = body.search(/\n\n(?!- )/);
      const summary =
        narrativeStart >= 0
          ? body
              .slice(narrativeStart)
              .trim()
              .replace(/\n{3,}/g, "\n\n")
          : "";

      return {
        rank: Number(heading[1]),
        name: heading[2].trim(),
        total,
        summary,
        topTopics: parseMetricList(readMetadata(body, "Top topics")),
        topProducts: parseMetricList(
          readMetadata(body, "Most-mentioned products")
        ),
        topGroups: parseMetricList(
          readMetadata(body, "Most-active public groups")
        ),
      };
    })
    .filter((profile) => profile.total > 500);
}

if (!fs.existsSync(inputPath)) {
  throw new Error(
    `Contributor summaries were not found at ${inputPath}. Set KOINOS_MARKETING_DIR to the marketing repository.`
  );
}

const markdown = fs.readFileSync(inputPath, "utf8");
const people = parseProfiles(markdown);

if (people.length === 0 || people.some((person) => !person.summary)) {
  throw new Error("Contributor summaries could not be parsed completely.");
}

const output = {
  generatedFrom: path.basename(inputPath),
  threshold: 500,
  methodology: {
    ordering: "Verified contribution total, highest to lowest",
    note: "Totals are verified minimums derived from public Telegram topic scans, individually inventoried Discord identities, and chronology attribution boundaries. Activity volume is not a measure of quality, authorship, leadership, or historical importance.",
  },
  people,
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${people.length} contributor profiles to ${outputPath}`);
