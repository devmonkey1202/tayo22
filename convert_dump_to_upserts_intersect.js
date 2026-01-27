// convert_dump_to_upserts_intersect.js
// Usage: node convert_dump_to_upserts_intersect.js prisma/schema.prisma tayodrive_backup.sql out.sql
// - prisma/schema.prisma에서 모델별 필드(컬럼) 추출
// - 덤프의 COPY 블록을 읽어, DB에 실제 있는 컬럼(=Prisma 모델 필드)과 교집합만 INSERT
// - Faq 등 스키마에 없는 테이블은 자동 스킵
// - 중복키 방지: ON CONFLICT DO NOTHING
const fs = require('fs');

if (process.argv.length < 5) {
  console.error('Usage: node convert_dump_to_upserts_intersect.js <schema.prisma> <dump.sql> <out.sql>');
  process.exit(1);
}

const schemaText = fs.readFileSync(process.argv[2], 'utf8');
const dumpText   = fs.readFileSync(process.argv[3], 'utf8');

// 1) Prisma schema 파싱: model 블록에서 필드명 수집
const modelRegex = /model\s+(\w+)\s*\{([\s\S]*?)\}/g;
const models = {}; // { TableName: Set(fields) }
let m;
while ((m = modelRegex.exec(schemaText))) {
  const modelName = m[1];
  const body = m[2];
  const lines = body.split(/\r?\n/);
  const fields = new Set();
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('//')) continue;
    // 필드 라인 대략 추출: name Type ...
    const mm = t.match(/^(\w+)\s+[\w\[\]\?]+/);
    if (mm) {
      const fname = mm[1];
      // Prisma 예약어, @@index 등 제외
      if (!fname.startsWith('@@') && !fname.startsWith('@@')) {
        fields.add(`"${fname}"`); // INSERT에 쓸 때는 "필드명" 형태
      }
    }
  }
  // Postgres 테이블명은 보통 모델명과 동일한 "Model"
  models[modelName] = fields;
}

// 2) 덤프 COPY 파싱
function sqlEscape(val) {
  if (val === '\\N') return 'NULL';
  return "'" + val.replace(/'/g, "''") + "'";
}

const lines = dumpText.split(/\r?\n/);
let out = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const mm2 = line.match(/^COPY\s+([^\s]+)\s*\(([^)]+)\)\s+FROM\s+stdin;/i);
  if (!mm2) continue;

  const tableIdent = mm2[1].replace(/\s+/g, '');   // e.g., public."Recipient"
  const copyCols = mm2[2].split(',').map(s => s.trim()); // ["id","name",...]

  // 테이블 기본명 추출 (따옴표 제거)
  let baseTable = tableIdent;
  const mname = tableIdent.match(/\.?"?([^".]+)"?$/);
  if (mname) baseTable = mname[1];

  // Prisma 모델에 없는 테이블이면 스킵 (Faq 같은 것)
  if (!models[baseTable]) {
    // COPY 데이터 블록 consume만
    while (i + 1 < lines.length && lines[i + 1] !== '\\.') i++;
    continue;
  }

  // 교집합 컬럼 계산
  const existingCols = models[baseTable]; // Set of "\"col\""
  const useIdx = []; // copyCols index to use
  const useCols = [];
  copyCols.forEach((c, idx) => {
    if (existingCols.has(c)) {
      useIdx.push(idx);
      useCols.push(c);
    }
  });

  if (useCols.length === 0) {
    // 이 테이블은 쓸 컬럼이 없음 → consume만
    while (i + 1 < lines.length && lines[i + 1] !== '\\.') i++;
    continue;
  }

  // 데이터 영역 변환
  while (i + 1 < lines.length) {
    const row = lines[i + 1];
    if (row === '\\.') { i++; break; }
    if (row.trim().length) {
      const fields = row.split('\t');
      const picked = useIdx.map(j => sqlEscape(fields[j]));
      out.push(`INSERT INTO ${tableIdent} (${useCols.join(', ')}) VALUES (${picked.join(', ')}) ON CONFLICT DO NOTHING;`);
    }
    i++;
  }
}

fs.writeFileSync(process.argv[4], out.join('\n'), 'utf8');
console.log('DONE. wrote', process.argv[4], 'statements:', out.length);
