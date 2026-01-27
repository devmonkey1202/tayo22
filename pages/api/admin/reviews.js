// pages/api/admin/reviews.js
import cookie from "cookie";
import prisma from "@/lib/prisma"; // 싱글턴 PrismaClient 사용

/** 관리자 인증: admin_token 쿠키가 ADMIN_TOKEN과 일치해야 함 */
function requireAdmin(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies["admin_token"] || "";
  if (!process.env.ADMIN_TOKEN) {
    res.status(500).json({ error: "ADMIN_TOKEN_NOT_SET" });
    return false;
  }
  if (token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "UNAUTHORIZED" });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  try {
    if (!requireAdmin(req, res)) return;

    // ── 목록 조회(GET) ────────────────────────────────
    if (req.method === "GET") {
      const page = Math.max(1, parseInt(req.query.page ?? "1", 10) || 1);
      const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize ?? "50", 10) || 50));
      const skip = (page - 1) * pageSize;

      const [items, total] = await Promise.all([
        prisma.review.findMany({
          orderBy: { createdAt: "desc" }, // ← createdAt 기준으로 정렬
          skip,
          take: pageSize,
        }),
        prisma.review.count(),
      ]);

      res.setHeader("Cache-Control", "no-store");
      return res.status(200).json({ items, reviews: items, total, page, pageSize });
    }

    // ── 신규 추가(POST) ──────────────────────────────
    if (req.method === "POST") {
      const {
        title = "",
        author = "",
        email = "",
        image = "",
        body = "",
        rating = 5,
        views = 0,
      } = req.body || {};

      if (!title.trim() || !author.trim()) {
        return res.status(400).json({ error: "REQUIRED" });
      }

      const created = await prisma.review.create({
        data: {
          title: String(title).trim(),
          author: String(author).trim(),
          email: String(email || ""),
          image: String(image || ""),
          body: String(body || ""),
          rating: Number.isFinite(+rating) ? +rating : 5,
          views: Number.isFinite(+views) ? +views : 0,
        },
      });

      return res.status(200).json({ ok: true, item: created });
    }

    // ── 수정(PUT) ────────────────────────────────────
    if (req.method === "PUT") {
      const { id, ...patch } = req.body || {};
      const reviewId = Number(id);
      if (!Number.isFinite(reviewId)) {
        return res.status(400).json({ error: "INVALID_ID" });
      }

      const updated = await prisma.review.update({
        where: { id: reviewId },
        data: {
          ...(patch.title  != null ? { title: String(patch.title) } : {}),
          ...(patch.author != null ? { author: String(patch.author) } : {}),
          ...(patch.email  != null ? { email: String(patch.email || "") } : {}),
          ...(patch.image  != null ? { image: String(patch.image || "") } : {}),
          ...(patch.body   != null ? { body: String(patch.body || "") } : {}),
          ...(patch.rating != null ? { rating: Number.isFinite(+patch.rating) ? +patch.rating : 5 } : {}),
          ...(patch.views  != null ? { views: Number.isFinite(+patch.views) ? +patch.views : 0 } : {}), // ✅ 조회수 반영
        },
      });

      return res.status(200).json({ ok: true, item: updated });
    }

    // ── 삭제(DELETE) ─────────────────────────────────
    if (req.method === "DELETE") {
      const id = Number(req.query.id ?? req.body?.id);
      if (!Number.isFinite(id)) {
        return res.status(400).json({ error: "INVALID_ID" });
      }

      await prisma.review.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    }

    // ── 허용되지 않은 메소드 ──────────────────────────
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: "METHOD_NOT_ALLOWED" });
  } catch (err) {
    console.error("[/api/admin/reviews] error:", err);
    return res.status(500).json({
      error: "INTERNAL",
      detail: String(err?.message || err),
    });
  }
}
