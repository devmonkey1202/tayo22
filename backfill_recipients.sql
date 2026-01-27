-- (옵션) 이름으로 전화 매칭: 동명이인 있으면 잘못 들어갈 수 있음 
WITH latest_phone AS (
  SELECT "name", MAX("id") AS max_id
  FROM "Reservation" WHERE "phone" IS NOT NULL GROUP BY "name"
)
UPDATE "Recipient" r
SET "phone" = res."phone"
FROM "Reservation" res
JOIN latest_phone lp ON lp."name" = res."name" AND lp.max_id = res."id"
WHERE r."phone" IS NULL AND r."name" IS NOT NULL AND r."name" = res."name";
-- 최소 기본값 보정(확실) 
UPDATE "Recipient" SET "phone" = COALESCE("phone",'000-0000-0000');
UPDATE "Recipient" SET "name"  = COALESCE("name",'미상');
