import cookie from "cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { password } = req.body || {};
  if (!process.env.ADMIN_TOKEN || password !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "INVALID" });
  }
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("admin_token", process.env.ADMIN_TOKEN, {
      httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 // 7d
    })
  );
  return res.json({ ok: true });
}
