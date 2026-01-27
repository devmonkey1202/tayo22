-- Count per table
SELECT 'Review' t, COUNT(*) c FROM "Review" UNION ALL 
SELECT 'Reservation', COUNT(*) FROM "Reservation" UNION ALL 
SELECT 'Recipient', COUNT(*) FROM "Recipient" UNION ALL 
SELECT 'Faq', COUNT(*) FROM "Faq" UNION ALL 
SELECT 'Setting', COUNT(*) FROM "Setting"; 
-- Reservation NULL 현황 
SELECT 
  SUM(CASE WHEN "name"  IS NULL THEN 1 ELSE 0 END) AS null_name, 
  SUM(CASE WHEN "phone" IS NULL THEN 1 ELSE 0 END) AS null_phone, 
  SUM(CASE WHEN "carType" IS NULL THEN 1 ELSE 0 END) AS null_carType, 
  SUM(CASE WHEN "region"  IS NULL THEN 1 ELSE 0 END) AS null_region, 
  SUM(CASE WHEN "memo"    IS NULL THEN 1 ELSE 0 END) AS null_memo 
FROM "Reservation"; 
-- Recipient NULL 현황 
SELECT 
  SUM(CASE WHEN "name"  IS NULL THEN 1 ELSE 0 END) AS null_name, 
  SUM(CASE WHEN "phone" IS NULL THEN 1 ELSE 0 END) AS null_phone 
FROM "Recipient"; 
-- 샘플 5행 
SELECT * FROM "Reservation" ORDER BY "id" ASC LIMIT 5; 
SELECT * FROM "Recipient"  ORDER BY "id" ASC LIMIT 5; 
SELECT * FROM "Review"     ORDER BY "id" ASC LIMIT 5; 
