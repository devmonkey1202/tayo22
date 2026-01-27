// convert_dump_to_inserts_only.js
// Usage: node convert_dump_to_inserts_only.js input.sql output.sql
// - COPY ... FROM stdin; 블록만 파싱해서 1행=1 INSERT로 변환
// - DDL/코멘트/psql 메타라인(\...)은 완전히 무시
// - "Faq" 테이블은 스킵
const fs = require('fs');

if (process.argv.length < 4) {
  console.error('Usage: node convert_dump_to_inserts_only.js input.sql output.sql');
  process.exit(1);
}

const input = fs.readFileSync(process.argv[2], 'utf8');
const lines = input.split(/\r?\n/);

function sqlEscape(val) {
  if (val === '\\N') return 'NULL';
  return "'" + val.replace(/'/g, "''") + "'";
}

let out = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // COPY public."Table" (col1, col2, ...) FROM stdin;
  const m = line.match(/^COPY\s+([^\s]+)\s*\(([^)]+)\)\s+FROM\s+stdin;/i);
  if (!m) continue; // 오직 COPY 블록만 처리

  const tableIdentRaw = m[1];   // e.g., public."Reservation"
  const tableIdent = tableIdentRaw.replace(/\s+/g, ''); // 안전 차원
  const cols = m[2].split(',').map(s => s.trim());

  // Faq 테이블은 스킵
  const tblNameMatch = tableIdent.match(/\.?"?([^".]+)"?$/);
  const baseTableName = tblNameMatch ? tblNameMatch[1] : tableIdent;
  if (/^Faq$/i.test(baseTableName)) {
    // 블록 consume만 하고 건너뛰기
    while (i + 1 < lines.length && lines[i + 1] !== '\\.') i++;
    continue;
  }

  // 데이터 구간 파싱
  while (i + 1 < lines.length) {
    const row = lines[i + 1];
    if (row === '\\.') { i++; break; } // COPY 종료
    if (row.trim().length) {
      const fields = row.split('\t').map(sqlEscape);
      out.push(`INSERT INTO ${tableIdent} (${cols.join(', ')}) VALUES (${fields.join(', ')});`);
    }
    i++;
  }
}

// 최종 저장
fs.writeFileSync(process.argv[3], out.join('\n'), 'utf8');
console.log('DONE. Wrote:', process.argv[3], 'lines:', out.length);
