// pages/api/admin/reservations.js
import prisma from "@/lib/prisma";
import cookie from "cookie";

function requireAdmin(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies["admin_token"] || "";
  if (token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  try {
    if (!requireAdmin(req, res)) return;

    // ── 목록 조회(GET) ────────────────────────────────
    if (req.method === "GET") {
      const rows = await prisma.reservation.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json({ items: rows, total: rows.length });
    }

    // ── 신규 생성(POST) ───────────────────────────────
    if (req.method === "POST") {
      const data = req.body || {};
      const created = await prisma.reservation.create({
        data: {
          name: data.name || "",
          phone: data.phone || "",
          gender: data.gender || null,
          carType: data.carType || null,
          region: data.region || null,
          memo: data.memo || null,
          status: data.status || "상담신청중",
          // 신청시각 지정 시 반영, 없으면 DB 기본값(now())
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        },
      });
      return res.status(200).json(created);
    }

    // ── 수정(PUT) ────────────────────────────────────
    if (req.method === "PUT") {
      const data = req.body || {};
      const id = Number(data.id || req.query.id);
      if (!id) return res.status(400).json({ error: "id required" });

      const updated = await prisma.reservation.update({
        where: { id },
        data: {
          name: data.name ?? undefined,
          phone: data.phone ?? undefined,
          gender: data.gender ?? undefined,
          carType: data.carType ?? undefined,
          region: data.region ?? undefined,
          memo: data.memo ?? undefined,
          status: data.status ?? undefined,
          // 필요 시 createdAt 수정도 허용
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        },
      });
      return res.status(200).json(updated);
    }

    // ── 삭제(DELETE) ─────────────────────────────────
    if (req.method === "DELETE") {
      const id = Number(req.query.id || req.body?.id);
      if (!id) return res.status(400).json({ error: "id required" });

      await prisma.reservation.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    }

    // 허용되지 않은 메소드
    res.setHeader("Allow", "GET,POST,PUT,DELETE");
    return res.status(405).end();
  } catch (e) {
    console.error("[/api/admin/reservations] error:", e);
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
