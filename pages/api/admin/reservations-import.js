// pages/api/admin/reservations-import.js
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const { csv, mode } = req.body || {};
    if (!csv) return res.status(400).json({ error: 'csv required' });

    const lines = csv.split(/\r?\n/).filter(Boolean);
    const header = lines.shift().split(',').map(h => h.replace(/^"|"$/g, ''));
    const idx = (k) => header.indexOf(k);

    const data = lines.map(line => {
      const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').replace(/\\n/g, '\n'));
      return {
        name: cols[idx('name')] || '',
        gender: cols[idx('gender')] || '',
        phone: cols[idx('phone')] || '',
        carType: cols[idx('carType')] || '',
        region: cols[idx('region')] || '',
        memo: cols[idx('memo')] || '',
        status: cols[idx('status')] || '상담신청중',
      };
    });

    if (mode === 'replace') {
      await prisma.reservation.deleteMany({});
    }
    await prisma.reservation.createMany({ data, skipDuplicates: true });

    return res.status(200).json({ ok: true, count: data.length });
  } catch (err) {
    console.error('[reservations-import] error', err);
    return res.status(500).json({ error: 'import failed', message: err.message });
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
