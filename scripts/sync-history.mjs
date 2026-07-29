import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ARTICLE_URL =
  "https://github.com/pgarciagon/marketing/blob/main/koinos-exists-a-chronicle-of-a-blockchain-that-cannot-be-recreated.md";
const RAW_ARTICLE_URL =
  "https://raw.githubusercontent.com/pgarciagon/marketing/main/koinos-exists-a-chronicle-of-a-blockchain-that-cannot-be-recreated.md";
const RAW_IMAGE_ROOT =
  "https://raw.githubusercontent.com/pgarciagon/marketing/main/";
const CONTRIBUTION_ANALYSIS_URL =
  "https://github.com/pgarciagon/marketing/blob/main/koinos-community-contribution-analysis.md";
const CONTRIBUTION_RANKING_URL =
  "https://github.com/pgarciagon/marketing/blob/main/koinos-community-contribution-ranking.csv";
const RAW_CONTRIBUTION_RANKING_URL =
  "https://raw.githubusercontent.com/pgarciagon/marketing/main/koinos-community-contribution-ranking.csv";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "data", "history-content.json");
const localArticlePath = process.env.HISTORY_SOURCE_FILE;
const localContributionRankingPath =
  process.env.HISTORY_CONTRIBUTIONS_FILE ||
  (localArticlePath
    ? path.join(
        path.dirname(path.resolve(process.cwd(), localArticlePath)),
        "koinos-community-contribution-ranking.csv",
      )
    : null);

function toPlainText(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/^[-+>]\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value, length = 640) {
  if (value.length <= length) return value;
  const shortened = value.slice(0, length + 1);
  const finalSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, finalSpace > length * 0.75 ? finalSpace : length).trim()}…`;
}

function githubAnchor(heading) {
  return heading
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function eraForYear(year) {
  if (year <= 2020) return "origins";
  if (year <= 2022) return "building";
  if (year === 2023) return "ecosystem";
  if (year === 2024) return "evolution";
  return "continuity";
}

function imageFromBody(body) {
  const match = body.match(/!\[([^\]]*)\]\((images\/koinos-chronicle\/[^)]+)\)/);
  if (!match) return null;

  return {
    alt: toPlainText(match[1]),
    src: `${RAW_IMAGE_ROOT}${match[2]}`,
  };
}

function contentBlocksFromBody(body) {
  const blocks = [];
  let paragraph = [];
  let activeList = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() });
    paragraph = [];
  };

  const endList = () => {
    activeList = null;
  };

  const pushListItem = (type, text) => {
    flushParagraph();
    if (!activeList || activeList.type !== type) {
      activeList = { type, items: [] };
      blocks.push(activeList);
    }
    activeList.items.push(text.trim());
  };

  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      endList();
      continue;
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\((images\/koinos-chronicle\/[^)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      endList();
      blocks.push({
        type: "image",
        alt: toPlainText(imageMatch[1]),
        src: `${RAW_IMAGE_ROOT}${imageMatch[2]}`,
      });
      continue;
    }

    const captionMatch = line.match(/^\*([^*].*)\*$/);
    if (captionMatch && blocks.at(-1)?.type === "image") {
      blocks.at(-1).caption = captionMatch[1];
      continue;
    }

    const unorderedMatch = line.match(/^-\s+(.+)$/);
    if (unorderedMatch) {
      pushListItem("unordered-list", unorderedMatch[1]);
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      pushListItem("ordered-list", orderedMatch[1]);
      continue;
    }

    if (line.startsWith(">")) {
      flushParagraph();
      endList();
      blocks.push({ type: "quote", text: line.replace(/^>\s?/, "") });
      continue;
    }

    endList();
    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

function summaryFromBody(body) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .filter((paragraph) => !paragraph.startsWith("!["))
    .filter((paragraph) => !paragraph.startsWith("*"))
    .filter((paragraph) => !paragraph.startsWith("- "))
    .map(toPlainText)
    .filter((paragraph) => paragraph.length > 45);

  return truncate(paragraphs.slice(0, 2).join(" "));
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
}

function parseCsv(value) {
  const records = [];
  let record = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];

    if (quoted) {
      if (character === '"' && value[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      record.push(field);
      field = "";
    } else if (character === "\n") {
      record.push(field.replace(/\r$/, ""));
      records.push(record);
      record = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field || record.length) {
    record.push(field.replace(/\r$/, ""));
    records.push(record);
  }

  const [headers, ...rows] = records;
  return rows
    .filter((row) => row.some(Boolean))
    .map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])),
    );
}

function personIdentityKey(value) {
  return toPlainText(value)
    .split("/")[0]
    .replace(/^@/, "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

let markdown;
if (localArticlePath) {
  const resolvedArticlePath = path.resolve(process.cwd(), localArticlePath);
  markdown = await readFile(resolvedArticlePath, "utf8");
  console.log(`Reading history article from ${resolvedArticlePath}`);
} else {
  const response = await fetch(RAW_ARTICLE_URL);
  if (!response.ok) {
    throw new Error(`Unable to fetch the history article (${response.status})`);
  }
  markdown = await response.text();
}

let contributionRankingCsv;
if (localContributionRankingPath) {
  contributionRankingCsv = await readFile(localContributionRankingPath, "utf8");
  console.log(
    `Reading contribution ranking from ${localContributionRankingPath}`,
  );
} else {
  const response = await fetch(RAW_CONTRIBUTION_RANKING_URL);
  if (!response.ok) {
    throw new Error(
      `Unable to fetch the contribution ranking (${response.status})`,
    );
  }
  contributionRankingCsv = await response.text();
}

const lines = markdown.split(/\r?\n/);
const title = toPlainText(
  lines.find((line) => line.startsWith("# "))?.slice(2) ||
    "Koinos Exists: A Chronicle of a Blockchain That Cannot Be Recreated",
);
const sections = [];
let current = null;

for (const line of lines) {
  if (line.startsWith("## ")) {
    if (current) sections.push(current);
    current = { heading: line.slice(3).trim(), body: [] };
    continue;
  }

  if (current) current.body.push(line);
}

if (current) sections.push(current);

const peopleSourceSection = sections.find(
  ({ heading }) => heading === "23.09.2020 - Koinos Group LLC Is Registered",
);
const profileNames = peopleSourceSection
  ? [...peopleSourceSection.body.join("\n").matchAll(/^-\s+\*\*(.+?)\*\*:/gm)].map(
      (match) => match[1],
    )
  : [];
const contributionRows = new Map();
for (const row of parseCsv(contributionRankingCsv)) {
  const key = personIdentityKey(row.person);
  const existing = contributionRows.get(key);
  if (!existing || Number(row.total) > Number(existing.total)) {
    contributionRows.set(key, row);
  }
}
const people = Object.fromEntries(
  profileNames.flatMap((profileName) => {
    const key = personIdentityKey(profileName);
    const row = contributionRows.get(key);
    if (!row) return [];

    return [
      [
        key,
        {
          person: row.person,
          rank: Number(row.rank),
          total: Number(row.total),
          first: row.first,
          last: row.last,
        },
      ],
    ];
  }),
);

const events = sections
  .filter(({ heading }) => heading !== "Summary" && heading !== "Sources")
  .map(({ heading, body }, index) => {
    const separator = heading.indexOf(" - ");
    const date = separator === -1 ? heading : heading.slice(0, separator);
    const title = separator === -1 ? heading : heading.slice(separator + 3);
    const yearMatch = date.match(/20\d{2}/);
    const year = yearMatch ? Number(yearMatch[0]) : 2020;
    const bodyText = body.join("\n");

    return {
      id: `${year}-${slugify(title)}-${index + 1}`,
      date: toPlainText(date),
      title: toPlainText(title),
      year,
      era: eraForYear(year),
      summary: summaryFromBody(bodyText),
      content: contentBlocksFromBody(bodyText),
      image: imageFromBody(bodyText),
      sourceUrl: `${ARTICLE_URL}#${githubAnchor(heading)}`,
    };
  });

const introduction = markdown
  .slice(0, markdown.indexOf("\n## "))
  .split(/\n\s*\n/)
  .slice(1)
  .map(toPlainText)
  .filter(Boolean)
  .slice(0, 4);

const content = {
  title,
  sourceUrl: ARTICLE_URL,
  introduction,
  peopleContributionAnalysis: {
    sourceUrl: CONTRIBUTION_ANALYSIS_URL,
    rankingSourceUrl: CONTRIBUTION_RANKING_URL,
    metric: "Telegram + individually inventoried Discord + X + articles + videos",
    people,
  },
  events,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(content, null, 2)}\n`);

console.log(`Wrote ${events.length} historical milestones to ${outputPath}`);
