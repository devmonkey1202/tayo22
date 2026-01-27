INSERT INTO "Recipient"("name","phone","label")
SELECT DISTINCT COALESCE(res."name",'¹Ì»ó'), res."phone", 'from-reservation'
FROM "Reservation" res
WHERE res."phone" IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM "Recipient" r WHERE r."phone" = res."phone");
