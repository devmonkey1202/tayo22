// pages/api/admin/board/[id].js
import prisma from "../../../../lib/prisma";
import { requireAdminApi } from "../../../../lib/adminAuth";

function toBool(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v === 1;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    if (s === "true" || s === "1" || s === "on") return true;
    if (s === "false" || s === "0" || s === "off") return false;
  }
  return undefined; // "전달 안 됨"
}

export default async function handler(req, res) {
  if (!requireAdminApi(req, res)) return;

  const id = Number(req.query.id);
  if (!Number.isFinite(id)) return res.status(400).json({ ok: false, error: "BAD_ID" });

  if (req.method === "GET") {
    const item = await prisma.boardPost.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
    return res.status(200).json({ ok: true, item });
  }

  if (req.method === "PUT") {
    const body = req.body || {};
    const data = {};

    if (typeof body.title === "string") {
      if (!body.title.trim()) return res.status(400).json({ ok: false, error: "TITLE_REQUIRED" });
      data.title = body.title;
    }
    if (typeof body.content === "string") {
      if (!body.content.trim()) return res.status(400).json({ ok: false, error: "CONTENT_REQUIRED" });
      data.content = body.content;
    }

    const p = toBool(body.isPublished);
    const pin = toBool(body.isPinned);
    if (p !== undefined) data.isPublished = p;
    if (pin !== undefined) data.isPinned = pin;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ ok: false, error: "NO_FIELDS" });
    }

    const updated = await prisma.boardPost.update({
      where: { id },
      data,
      select: { id: true, isPublished: true, isPinned: true },
    });

    return res.status(200).json({ ok: true, updated });
  }

  if (req.method === "DELETE") {
    await prisma.boardPost.delete({ where: { id } });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false });
}
