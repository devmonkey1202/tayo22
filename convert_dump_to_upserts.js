// convert_dump_to_upserts.js
// Usage: node convert_dump_to_upserts.js input.sql output.sql
// - COPY ... FROM stdin; 블록만 파싱해서 1행=1 INSERT로 변환
// - 모든 값을 안전하게 단일 따옴표로 감싸고, \N -> NULL 처리
// - 테이블 "Faq"는 스킵
// - 중복키(PK/Unique) 에러 방지를 위해 ON CONFLICT DO NOTHING 추가

const fs = require('fs');

if (process.argv.length < 4) {
  console.error('Usage: node convert_dump_to_upserts.js input.sql output.sql');
  process.exit(1);
}

const input = fs.readFileSync(process.argv[2], 'utf8');
const lines = input.split(/\r?\n/);

function sqlEscape(val) {
  if (val === '\\N') return 'NULL';
  // 단일따옴표 이스케이프
  return "'" + val.replace(/'/g, "''") + "'";
}

let out = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // COPY public."Table" (col1, col2, ...) FROM stdin;
  const m = line.match(/^COPY\s+([^\s]+)\s*\(([^)]+)\)\s+FROM\s+stdin;/i);
  if (!m) continue; // 오직 COPY 블록만 처리

  const tableIdent = m[1].replace(/\s+/g, '');  // public."Reservation" 등
  const cols = m[2].split(',').map(s => s.trim());

  // 테이블명만 추출해서 Faq 스킵
  const tblNameMatch = tableIdent.match(/\.?"?([^".]+)"?$/);
  const baseTableName = tblNameMatch ? tblNameMatch[1] : tableIdent;
  if (/^Faq$/i.test(baseTableName)) {
    // COPY 데이터 소비만 하고 skip
    while (i + 1 < lines.length && lines[i + 1] !== '\\.') i++;
    continue;
  }

  // 데이터 구간 파싱
  while (i + 1 < lines.length) {
    const row = lines[i + 1];
    if (row === '\\.') { i++; break; } // COPY 종료
    if (row.trim().length) {
      const fields = row.split('\t').map(sqlEscape);
      // INSERT + 중복 무시
      out.push(`INSERT INTO ${tableIdent} (${cols.join(', ')}) VALUES (${fields.join(', ')}) ON CONFLICT DO NOTHING;`);
    }
    i++;
  }
}

// 최종 출력: INSERT로만 구성 (깨진 줄 방지)
const output = out.join('\n');
fs.writeFileSync(process.argv[3], output, 'utf8');
console.log('DONE. Wrote:', process.argv[3], 'statements:', out.length);
