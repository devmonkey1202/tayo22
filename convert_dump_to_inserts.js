// convert_dump_to_inserts.js
// Usage: node convert_dump_to_inserts.js input.sql output.sql
const fs = require('fs');

if (process.argv.length < 4) {
  console.error('Usage: node convert_dump_to_inserts.js input.sql output.sql');
  process.exit(1);
}

const input = fs.readFileSync(process.argv[2], 'utf8');
const lines = input.split(/\r?\n/);

function sqlEscape(val) {
  if (val === '\\N') return 'NULL';
  return "'" + val.replace(/'/g, "''") + "'";
}

let i = 0;
let out = [];
while (i < lines.length) {
  const line = lines[i];

  const m = line.match(/^COPY\s+([^\s]+)\s*\(([^)]+)\)\s+FROM\s+stdin;/i);
  if (!m) { if (!line.startsWith('\\')) out.push(line); i++; continue; }

  const tableIdent = m[1];
  const cols = m[2].split(',').map(s => s.trim());

  i++;
  let rowCount = 0;
  while (i < lines.length && lines[i] !== '\\.') {
    if (lines[i].trim().length) {
      const fields = lines[i].split('\t').map(sqlEscape);
      out.push(`INSERT INTO ${tableIdent} (${cols.join(', ')}) VALUES (${fields.join(', ')});`);
      rowCount++;
    }
    i++;
  }
  i++;
  out.push(`-- inserted ${rowCount} rows into ${tableIdent}`);
}

fs.writeFileSync(process.argv[3], out.join('\n'), 'utf8');
console.log('DONE. Wrote:', process.argv[3]);
