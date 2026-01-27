-- A) name 일치 + createdAt 가장 가까운 예약으로 phone 채우기 
UPDATE "Recipient" r 
SET "phone" = m."phone" 
FROM LATERAL ( 
  SELECT res."phone" 
  FROM "Reservation" res 
  WHERE res."phone" IS NOT NULL AND r."name" IS NOT NULL AND res."name" = r."name" 
  ORDER BY ABS(EXTRACT(EPOCH FROM (res."createdAt" - r."createdAt"))) ASC 
  LIMIT 1 
) m 
WHERE r."phone" IS NULL 
  AND m."phone" IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM "Recipient" r2 WHERE r2."phone" = m."phone"); 
-- B) name NULL이면 시간 근접치(±5분)로 name, phone 동시 채우기 
UPDATE "Recipient" r 
SET "name" = m."name", "phone" = m."phone" 
FROM LATERAL ( 
  SELECT res."name", res."phone" 
  FROM "Reservation" res 
  WHERE res."phone" IS NOT NULL 
    AND res."createdAt" BETWEEN r."createdAt" - INTERVAL '5 minutes' AND r."createdAt" + INTERVAL '5 minutes' 
  ORDER BY ABS(EXTRACT(EPOCH FROM (res."createdAt" - r."createdAt"))) ASC 
  LIMIT 1 
) m 
WHERE r."phone" IS NULL 
  AND m."phone" IS NOT NULL 
  AND NOT EXISTS (SELECT 1 FROM "Recipient" r2 WHERE r2."phone" = m."phone"); 
