import fs from "node:fs";
import path from "node:path";
import { load } from "cheerio";

const legacyPath = path.resolve("..", "legacy", "assets", "other", "rack_builder_1916aac3d5.bin");
if (!fs.existsSync(legacyPath)) {
  console.error("Legacy file not found:", legacyPath);
  process.exit(1);
}

const html = fs.readFileSync(legacyPath, "utf8");
const $ = load(html);

const ribbons = [];
const accordion = $("div.accordion").first();
if (!accordion.length) {
  console.error("Could not find div.accordion in legacy HTML.");
  process.exit(1);
}

accordion.children("h3").each((i, el) => {
  const h3 = $(el);
  const a = h3.find("a").first();
  const name = (a.length ? a.text() : h3.text()).trim();
  const href = a.length ? (a.attr("href") || undefined) : undefined;

  const body = h3.next("div");
  const checkbox = body.find('input[type="checkbox"][name="ribbon"]').first();
  const id = (checkbox.attr("value") || "").trim();

  const img = (body.find("img").first().attr("src") || "").trim();

  const select = body.find('select[name="device"]').first();
  let device = undefined;

  if (select.length) {
    const options = [];
    select.find("option").each((_, opt) => {
      const v = ($(opt).attr("value") || "").trim();
      const label = $(opt).text().trim();
      if (label.length) options.push({ value: v, label });
    });
    device = { options };
  }

  ribbons.push({
    id: id || `missing_id_${i + 1}`,
    name,
    precedence: i + 1,
    branches: ["shared"],
    image: { legacyPath: img || (id ? `/image/${id}.png` : "") },
    links: { detailHref: href },
    device
  });
});

const outPath = path.resolve("src", "data", "ribbons.raw.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(ribbons, null, 2), "utf8");

console.log(`Wrote ${ribbons.length} ribbons -> ${outPath}`);
