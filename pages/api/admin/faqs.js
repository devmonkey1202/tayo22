// pages/api/admin/faqs.js
import prisma from "@/lib/prisma";

function isAdmin(req) {
  const hdr = req.headers['x-admin-token'];
  const cookieHeader = req.headers.cookie || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(/;\s*/).filter(Boolean).map(kv => {
      const idx = kv.indexOf('=');
      if (idx === -1) return [kv, ''];
      return [decodeURIComponent(kv.slice(0, idx)), decodeURIComponent(kv.slice(idx + 1))];
    })
  );
  const token = hdr || cookies['admin_token'];
  return !!(token && process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN);
}
function cryptoRandom() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default async function handler(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    if (req.method === 'GET') {
      const items = await prisma.faq.findMany();
      return res.status(200).json({ ok: true, items });
    }

    if (req.method === 'POST') {
      const { icon = '❓', q, a } = req.body || {};
      if (!q || !a) return res.status(400).json({ ok: false, error: 'q/a required' });
      const created = await prisma.faq.create({
        data: { id: cryptoRandom(), icon: String(icon), q: String(q), a: String(a) },
      });
      return res.status(201).json({ ok: true, item: created });
    }

    if (req.method === 'PUT') {
      const { id, icon, q, a } = req.body || {};
      if (!id) return res.status(400).json({ ok: false, error: 'id required' });
      const updated = await prisma.faq.update({
        where: { id },
        data: {
          ...(icon !== undefined ? { icon: String(icon) } : {}),
          ...(q !== undefined ? { q: String(q) } : {}),
          ...(a !== undefined ? { a: String(a) } : {}),
        },
      });
      return res.status(200).json({ ok: true, item: updated });
    }

    if (req.method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) return res.status(400).json({ ok: false, error: 'id required' });
      await prisma.faq.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end('Method Not Allowed');
  } catch (e) {
    console.error('admin/faqs error:', e);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
