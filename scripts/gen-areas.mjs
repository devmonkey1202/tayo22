// scripts/gen-areas.mjs
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const IN = path.join(ROOT, "data", "kr_sgg.csv");
const OUT = path.join(ROOT, "lib", "areasData.generated.js");

console.log("[gen-areas] START");
console.log("[gen-areas] IN =", IN);
console.log("[gen-areas] OUT =", OUT);

const BRAND = "타요드라이브 1666-8512";

const COMMON = [
  "개인운전연수",
  "장롱면허운전연수",
  "초보운전연수",
  "방문운전연수",
  "자차운전연수",
  "도로연수",
  "도로주행",
  "주차연수",
  "여성강사운전연수",
  "당일운전연수",
  "1대1운전연수",
  "운전연수비용",
  "운전연수가격",
  "고속도로연수",
  "야간운전연수",
  "출퇴근운전연수",
  "차선변경연수",
];

function splitCsvLine(line) {
  return line.split(",").map((s) => s.trim());
}

// 내부 slug 키(디코딩 한글/하이픈 유지)
function slugifyKo(s) {
  return (s || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// URL 세그먼트 안전 인코딩(sitemap/canonical용)
function toSlugUrl(slug) {
  return encodeURIComponent(slug);
}

// ✅ 너가 준 “키워드 풀 버전” 그대로
function makeAreaKeywords(name) {
  return [
    ...COMMON,
    `${name} 개인운전연수`,
    `${name} 방문운전연수`,
    `${name} 장롱면허운전연수`,
    `${name} 초보운전연수`,
    `${name} 1대1운전연수`,
    `${name} 자차운전연수`,
    `${name} 도로연수`,
    `${name} 도로주행`,
    `${name} 도로주행연수`,
    `${name} 실전도로주행`,
    `${name} 실도로주행연수`,
    `${name} 주차연수`,
    `${name} 주차집중연수`,
    `${name} 주차연습운전연수`,
    `${name} 고속도로운전연수`,
    `${name} 고속도로주행연수`,
    `${name} 야간운전연수`,
    `${name} 출퇴근운전연수`,
    `${name} 당일운전연수`,
    `${name} 단기운전연수`,
    `${name} 단기간운전연수`,
    `${name} 집중운전연수`,
    `${name} 맞춤운전연수`,
    `${name} 여성강사운전연수`,
    `${name} 여자운전연수`,
    `${name} 직장인운전연수`,
    `${name} 주부운전연수`,
    `${name} 대학생운전연수`,
    `${name} 사회초년생운전연수`,
    `${name} 초보자운전연수`,
    `${name} 장롱면허탈출`,
    `${name} 장롱면허운전`,
    `${name} 운전감각회복`,
    `${name} 운전두려움극복`,
    `${name} 초보운전극복`,
    `${name} 실전운전연수`,
    `${name} 안전운전연수`,
    `${name} 운전연수비용`,
    `${name} 운전연수가격`,
    `${name} 개인운전연수비용`,
    `${name} 방문운전연수가격`,
    `${name} 운전연수얼마`,
    `${name} 운전연수추천`,
    `${name} 운전연수후기`,
    `${name} 개인운전연수후기`,
    `${name} 운전연수잘하는곳`,
    `${name} 운전연수전문`,
    `${name} 개인운전연수전문`,
    `${name} 베테랑강사운전연수`,
    `${name} 운전연수상담`,
    `${name} 무료운전연수상담`,
    `${name} 운전연수문의`,
    `${name} 운전연수전화상담`,
    `${name} 초보를위한운전연수`,
    `${name} 장롱면허탈출운전연수`,
    `${name} 실전위주개인운전연수`,
    `${name} 도로주행중심운전연수`,
    `${name} 주차못하는사람운전연수`,
    `${name} 운전처음운전연수`,
  ];
}

function makeNote(name) {
  return `${name} 방문 운전연수 안내 페이지입니다. 장롱면허·초보운전·주차·도로주행을 1:1로 단계별 진행합니다.`;
}

if (!fs.existsSync(IN)) {
  console.error(`Missing ${IN}`);
  process.exit(1);
}

const raw = fs.readFileSync(IN, "utf8");
const lines = raw.split(/\r?\n/).filter(Boolean);
if (lines.length === 0) {
  console.error("CSV is empty");
  process.exit(1);
}

const firstCols = splitCsvLine(lines[0]);

const hasHeader =
  firstCols.includes("sido") ||
  firstCols.includes("sgg") ||
  firstCols.includes("시도명") ||
  firstCols.includes("시군구명") ||
  firstCols.includes("시도") ||
  firstCols.includes("시군구");

const looksLikeBjd =
  /^\d{8,10}$/.test(firstCols[0] || "") && (firstCols[1] || "").length > 0;

let startIdx = 0;
let mode = "header";

if (!hasHeader && looksLikeBjd) {
  mode = "bjd_positional";
  startIdx = 0;
} else if (hasHeader) {
  mode = "header";
  startIdx = 1;
} else {
  console.error(
    "CSV format not recognized. Need either headers (sido,sgg) or 법정동코드 기반 데이터(코드,시도명,시군구명,...)"
  );
  process.exit(1);
}

const sidoSet = new Set();
const sggSet = new Map();

function addPair(sido, sgg) {
  const s = (sido || "").trim();
  const g = (sgg || "").trim();
  if (!s) return;
  sidoSet.add(s);
  if (g) sggSet.set(`${s}|${g}`, { sido: s, sgg: g });
}

if (mode === "header") {
  const header = firstCols;
  const idx = (name) => header.indexOf(name);

  const sidoIdx =
    idx("sido") !== -1 ? idx("sido") :
    idx("시도명") !== -1 ? idx("시도명") :
    idx("시도") !== -1 ? idx("시도") : -1;

  const sggIdx =
    idx("sgg") !== -1 ? idx("sgg") :
    idx("시군구명") !== -1 ? idx("시군구명") :
    idx("시군구") !== -1 ? idx("시군구") : -1;

  if (sidoIdx === -1 || sggIdx === -1) {
    console.error("Header found but cannot locate sido/sgg columns.");
    process.exit(1);
  }

  for (let i = startIdx; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    addPair(cols[sidoIdx], cols[sggIdx]);
  }
} else {
  // [법정동코드, 시도명, 시군구명, 읍면동명, ...]
  for (let i = startIdx; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length < 3) continue;
    addPair(cols[1], cols[2]);
  }
}

// ✅ alias: 띄어쓰기/붙여쓰기 변형 흡수(404 방지)
function buildAliases(sido, sgg) {
  const out = new Set();
  const s = (sido || "").trim();
  const g = (sgg || "").trim();

  // 1) "시도 시군구" 기본
  const slugSpaced = slugifyKo(`${s} ${g}`);
  if (slugSpaced) out.add(slugSpaced);

  // 2) "시도 시군구(공백제거)" -> 창원시성산구 형태
  const compactG = g.replace(/\s+/g, "");
  const slugCompact = slugifyKo(`${s} ${compactG}`);
  if (slugCompact) out.add(slugCompact);

  return Array.from(out);
}

const AREAS = [];

// 시도 페이지
for (const sido of Array.from(sidoSet).sort((a, b) => a.localeCompare(b, "ko"))) {
  const slug = slugifyKo(sido);
  AREAS.push({
    slug,
    slugUrl: toSlugUrl(slug),
    aliases: [],
    name: sido,
    region: sido,
    keywords: makeAreaKeywords(sido),
    note: makeNote(sido),
  });
}

// 시군구 페이지
for (const { sido, sgg } of Array.from(sggSet.values()).sort((a, b) =>
  (a.sido + a.sgg).localeCompare(b.sido + b.sgg, "ko")
)) {
  const name = `${sido} ${sgg}`.trim();
  const slug = slugifyKo(name);
  const aliases = buildAliases(sido, sgg).filter((x) => x && x !== slug);

  AREAS.push({
    slug,
    slugUrl: toSlugUrl(slug),
    aliases,
    name,
    region: sido,
    keywords: makeAreaKeywords(name),
    note: makeNote(name),
  });
}

const out = `
// ⚠️ AUTO-GENERATED. DO NOT EDIT.
// Generated by scripts/gen-areas.mjs

const BRAND = ${JSON.stringify(BRAND)};

export const AREAS = ${JSON.stringify(AREAS, null, 2)};

export const AREA_MAP = AREAS.reduce((acc, a) => {
  acc[a.slug] = a;
  if (Array.isArray(a.aliases)) {
    for (const s of a.aliases) {
      if (s) acc[s] = a;
    }
  }
  return acc;
}, {});

export const AREA_SLUGS = AREAS.map((a) => a.slug);
export const AREA_SLUGS_URL = AREAS.map((a) => a.slugUrl);

export const makeTitle = (area) => \`\${BRAND} | \${area.name} 운전연수\`;

export const makeDesc = (area) =>
  \`\${area.name} 운전연수·방문운전연수. 오늘 상담 후 1:1 연수 진행 안내.\`;
`.trimStart();

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out, "utf8");
console.log(`✅ Wrote ${OUT} (AREAS: ${AREAS.length})`);
console.log(`Mode: ${mode}`);
