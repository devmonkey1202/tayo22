// pages/api/admin/board/index.js
import prisma from "../../../../lib/prisma";
import { requireAdminApi } from "../../../../lib/adminAuth";

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "") // 문자/숫자/공백/하이픈만
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function uniqueSlug(base) {
  let slug = base || "post";
  let n = 2;

  while (true) {
    const exists = await prisma.boardPost.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${n++}`;
  }
}

export default async function handler(req, res) {
  if (!requireAdminApi(req, res)) return;

  // ✅ GET: 관리자 목록 (페이지네이션)
  if (req.method === "GET") {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const take = Math.min(Math.max(parseInt(req.query.take || "10", 10), 5), 30); // 5~30
    const skip = (page - 1) * take;

    try {
      const [items, total] = await Promise.all([
        prisma.boardPost.findMany({
          orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
          skip,
          take,
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
            isPinned: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
        prisma.boardPost.count(),
      ]);

      return res.status(200).json({
        ok: true,
        items,
        page,
        take,
        total,
        totalPages: Math.max(Math.ceil(total / take), 1),
      });
    } catch (e) {
      console.error("ADMIN BOARD GET ERROR:", e);
      return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
    }
  }

  // ✅ POST: 글 생성
  if (req.method === "POST") {
    const { title, content, isPublished, isPinned } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ ok: false, error: "TITLE_REQUIRED" });
    }
    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ ok: false, error: "CONTENT_REQUIRED" });
    }

    try {
      const baseSlug = slugify(title) || "post";
      const slug = await uniqueSlug(baseSlug);

      const created = await prisma.boardPost.create({
        data: {
          title: title.trim(),
          slug,
          content: content.trim(),
          isPublished: Boolean(isPublished),
          isPinned: Boolean(isPinned),
        },
        select: { id: true, slug: true },
      });

      return res.status(200).json({ ok: true, created });
    } catch (e) {
      console.error("ADMIN BOARD POST ERROR:", e);
      return res.status(500).json({ ok: false, error: "SERVER_ERROR" });
    }
  }

  return res.status(405).json({ ok: false });
}
