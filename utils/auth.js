import cookie from "cookie";

export function parseCookies(req) {
  const header = req?.headers?.cookie || "";
  return cookie.parse(header || "");
}

export function requireAdmin(ctx) {
  const { req } = ctx;
  const cookies = parseCookies(req);
  if (cookies.admin !== "true") {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }
  return null;
}