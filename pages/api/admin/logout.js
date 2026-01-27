import cookie from "cookie";
export default function handler(req, res) {
  res.setHeader("Set-Cookie",
    cookie.serialize("admin_token", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 })
  );
  res.json({ ok: true });
}
