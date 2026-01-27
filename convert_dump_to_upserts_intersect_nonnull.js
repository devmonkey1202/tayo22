// convert_dump_to_upserts_intersect_nonnull.js
// Usage: node convert_dump_to_upserts_intersect_nonnull.js prisma/schema.prisma dump.sql out.sql
// - prisma/schema.prisma: 모델별 필드 추출
// - dump.sql: COPY ... FROM stdin 블록을 파싱
// - 교집합 컬럼만 사용 + 값이 \N(NULL)인 컬럼은 INSERT 대상에서 제외
// - 중복키는 ON CONFLICT DO NOTHING
// - Faq 같은 스키마 바깥 테이블은 스킵

const fs = require('fs');

if (process.argv.length < 5) {
  console.error('Usage: node convert_dump_to_upserts_intersect_nonnull.js <schema.prisma> <dump.sql> <out.sql>');
  process.exit(1);
}

const schemaText = fs.readFileSync(process.argv[2], 'utf8');
const dumpText   = fs.readFileSync(process.argv[3], 'utf8');

// 1) Prisma schema -> 모델별 필드 집합
const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
const models = {}; // { ModelName: Set('"col"') }
let m;
while ((m = modelRegex.exec(schemaText))) {
  const modelName = m[1];
  const body = m[2];
  const fields = new Set();
  for (const line of body.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('//') || t.startsWith('@@')) continue;
    const mm = t.match(/^(\w+)\s+[\w\[\]?!.@()]+/);
    if (mm) fields.add(`"${mm[1]}"`);
  }
  models[modelName] = fields;
}

function sqlEscape(val) {
  // 여기서 \N 은 호출부에서 제외(INSERT에서 빼버림)
  return "'" + val.replace(/'/g, "''") + "'";
}

// 2) 덤프 COPY 파싱
const lines = dumpText.split(/\r?\n/);
let out = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const mm2 = line.match(/^COPY\s+([^\s]+)\s*\(([^)]+)\)\s+FROM\s+stdin;/i);
  if (!mm2) continue;

  const tableIdent = mm2[1].replace(/\s+/g, '');  // e.g., public."Recipient"
  const copyCols = mm2[2].split(',').map(s => s.trim()); // ["id","name",...]

  // 모델명 추출
  let baseTable = tableIdent;
  const mt = tableIdent.match(/\.?"?([^".]+)"?$/);
  if (mt) baseTable = mt[1];

  // 모델이 없으면 스킵 (Faq 등)
  if (!models[baseTable]) {
    while (i + 1 < lines.length && lines[i + 1] !== '\\.') i++;
    continue;
  }

  const modelCols = models[baseTable]; // Set of '"col"'

  // 교집합을 인덱스로 보관
  const useIdx = [];
  const useCols = [];
  copyCols.forEach((c, idx) => {
    if (modelCols.has(c)) {
      useIdx.push(idx);
      useCols.push(c);
    }
  });
  if (useCols.length === 0) { // 쓸 게 없으면 consume만
    while (i + 1 < lines.length && lines[i + 1] !== '\\.') i++;
    continue;
  }

  // 데이터 행 처리
  while (i + 1 < lines.length) {
    const row = lines[i + 1];
    if (row === '\\.') { i++; break; }
    if (row.trim().length === 0) { i++; continue; }

    const fields = row.split('\t');

    // 값이 \N 인 컬럼은 INSERT 대상에서 제외 (컬럼/값 동시 필터)
    const colsFiltered = [];
    const valsFiltered = [];
    for (let k = 0; k < useIdx.length; k++) {
      const v = fields[useIdx[k]];
      if (v === '\\N') continue; // NULL이면 컬럼 자체를 제외
      colsFiltered.push(useCols[k]);
      valsFiltered.push(sqlEscape(v));
    }

    if (colsFiltered.length === 0) { // 모든 값이 NULL이면 스킵
      i++; continue;
    }

    out.push(
      `INSERT INTO ${tableIdent} (${colsFiltered.join(', ')}) VALUES (${valsFiltered.join(', ')}) ON CONFLICT DO NOTHING;`
    );
    i++;
  }
}

fs.writeFileSync(process.argv[4], out.join('\n'), 'utf8');
console.log('DONE. wrote', process.argv[4], 'statements:', out.length);
