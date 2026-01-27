// scripts/seed-from-json.cjs
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const CFG = {
  host: process.env.SEED_DB_HOST || '127.0.0.1', // Cloud SQL 공개 IP나 프록시 주소
  port: Number(process.env.SEED_DB_PORT || 3306),
  user: process.env.SEED_DB_USER || 'tayodrive',
  password: process.env.SEED_DB_PASS || 'juwon1202!',
  database: process.env.SEED_DB_NAME || 'dbtayodrive',
};

const P = (f) => path.join(process.cwd(), f);
const exists = (p) => fs.existsSync(p);
const readJSON = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

function uid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function upsertFaqs(conn, items) {
  for (const x of items) {
    const id = x.id || uid();
    const icon = x.icon ?? null;
    const q = x.q || x.question || '';
    const a = x.a || x.answer || '';
    await conn.execute(
      `INSERT INTO faqs (id, icon, q, a, createdAt)
       VALUES (?, ?, ?, ?, NOW(3))
       ON DUPLICATE KEY UPDATE icon=VALUES(icon), q=VALUES(q), a=VALUES(a)`,
      [id, icon, q, a]
    );
  }
}

async function upsertReviews(conn, items) {
  for (const x of items) {
    const id = x.id || uid();
    const title = x.title || '';
    const author = x.author || '';
    const content = x.content || x.text || '';
    const rating = Number.isFinite(x.rating) ? x.rating : 5;
    const email = x.email ?? null;
    const image = x.image ?? null;
    await conn.execute(
      `INSERT INTO reviews (id, title, author, content, rating, email, image, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(3))
       ON DUPLICATE KEY UPDATE title=VALUES(title), author=VALUES(author),
         content=VALUES(content), rating=VALUES(rating), email=VALUES(email), image=VALUES(image)`,
      [id, title, author, content, rating, email, image]
    );
  }
}

async function upsertReservations(conn, items) {
  for (const x of items) {
    const id = x.id || uid();
    const name = x.name || '';
    thePhone = x.phone || '';
    const phone = thePhone; // keep field name
    const region = x.region ?? x.area ?? null;
    const carType = x.carType ?? x.cartype ?? null;
    const gender = x.gender ?? null;
    const memo = x.memo ?? x.content ?? null;
    const status = x.status ?? '신청';
    await conn.execute(
      `INSERT INTO reservations (id, name, phone, region, carType, gender, memo, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(3))
       ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), region=VALUES(region),
         carType=VALUES(carType), gender=VALUES(gender), memo=VALUES(memo), status=VALUES(status)`,
      [id, name, phone, region, carType, gender, memo, status]
    );
  }
}

async function upsertSettings(conn, obj) {
  if (!obj || typeof obj !== 'object') return;
  const id = 1;
  const metaTitle = obj.metaTitle ?? null;
  const metaDescription = obj.metaDescription ?? null;
  const kakaoChannelUrl = obj.kakaoChannelUrl ?? obj.kakao ?? null;
  await conn.execute(
    `INSERT INTO settings (id, metaTitle, metaDescription, kakaoChannelUrl, createdAt)
     VALUES (?, ?, ?, ?, NOW(3))
     ON DUPLICATE KEY UPDATE metaTitle=VALUES(metaTitle),
       metaDescription=VALUES(metaDescription), kakaoChannelUrl=VALUES(kakaoChannelUrl)`,
    [id, metaTitle, metaDescription, kakaoChannelUrl]
  );
}

async function main() {
  const conn = await mysql.createConnection(CFG);
  if (exists(P('faqs.json')))        await upsertFaqs(conn, readJSON(P('faqs.json')));
  if (exists(P('reviews.json')))     await upsertReviews(conn, readJSON(P('reviews.json')));
  if (exists(P('reservations.json')))await upsertReservations(conn, readJSON(P('reservations.json')));
  if (exists(P('settings.json')))    await upsertSettings(conn, readJSON(P('settings.json')));
  await conn.end();
  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
