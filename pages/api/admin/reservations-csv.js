// pages/api/admin/reservations-csv.js
export default async function handler(req, res) {
  try {
    const proto = (req.headers["x-forwarded-proto"] || "").split(",")[0] || "http";
    const base = process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${req.headers.host}`;

    // 내부 JSON API에서 예약 목록을 받아 CSV로 변환
    const r = await fetch(`${base}/api/admin/reservations`, {
      headers: { Cookie: req.headers.cookie || "", Accept: "application/json" },
    });
    if (!r.ok) throw new Error(`fetch reservations failed: ${r.status}`);
    const data = await r.json().catch(() => []);

    const toArray = (j) =>
      Array.isArray(j) ? j :
      Array.isArray(j.items) ? j.items :
      Array.isArray(j.reservations) ? j.reservations :
      Array.isArray(j.data) ? j.data : [];

    const rows = toArray(data);

    const headers = ["id","name","gender","phone","carType","region","memo","status","createdAt"];
    const esc = (s = "") => `"${String(s).replace(/"/g,'""').replace(/\r?\n/g,"\\n")}"`;
    const csv = [
      headers.join(","),
      ...rows.map(row => headers.map(k => esc(row?.[k] ?? "")).join(",")),
    ].join("\r\n");

    // Excel 친화적(한글/줄바꿈) 응답
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="reservations.csv"');
    res.status(200).send("\uFEFF" + csv); // UTF-8 BOM
  } catch (err) {
    console.error("[reservations-csv] error:", err);
    res.status(500).json({ error: "CSV export failed", message: String(err?.message || err) });
  }
}
