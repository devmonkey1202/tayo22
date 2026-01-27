// cloudrun/scripts/sqlite-prep.cjs
// Copies prisma/dev.db into /tmp (the only writable path on Cloud Run) and
// sets DATABASE_URL to point there. This is ephemeral (not persisted).
// Use ONLY for quick demos; for production, switch to Cloud SQL.
const fs = require('fs');
const path = require('path');

const src = process.env.SQLITE_SRC_PATH || path.join(process.cwd(), 'prisma', 'dev.db');
const dst = '/tmp/dev.db';

try {
  fs.mkdirSync('/tmp', { recursive: true });
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    process.env.DATABASE_URL = `file:${dst}`;
    console.log(`[sqlite-prep] Copied ${src} -> ${dst}`);
    console.log(`[sqlite-prep] DATABASE_URL=file:${dst}`);
  } else {
    console.warn(`[sqlite-prep] Source DB not found at ${src}. Skipping copy.`);
  }
} catch (e) {
  console.error('[sqlite-prep] Error preparing SQLite file for /tmp:', e);
}