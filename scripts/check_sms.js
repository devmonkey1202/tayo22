// scripts/check_sms.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

(async () => {
  const all = await prisma.recipient.findMany({ orderBy: { createdAt: "desc" } });
  const admins = await prisma.recipient.findMany({
    where: { label: { in: ["site-admin","관리자","admin"] } },
    orderBy: { createdAt: "desc" }
  });
  console.log("Recipient total:", all.length);
  console.log("Admins:", admins.map(r => ({ id:r.id, name:r.name, phone:r.phone, label:r.label })));
  process.exit(0);
})();
