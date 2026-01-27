import { useState } from "react";
import Head from "next/head";
import { parse } from "cookie";

export default function AdminLogin() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ password: pw }) });
    if (r.ok) location.href = "/admin"; else setErr("비밀번호가 올바르지 않습니다.");
  };
  return (
    <>
      <Head><title>관리자 로그인</title></Head>
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <form onSubmit={submit} className="bg-white rounded-2xl shadow border p-6 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-4">
            <img src="https://i.ibb.co/j9Q03zry/logo-main.webp" alt="타요드라이브" className="h-8"/>
            <b className="text-blue-800 text-lg">관리자 로그인</b>
          </div>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)}
                 className="w-full border rounded-lg px-3 py-2" placeholder="관리자 비밀번호" />
          {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
          <button className="mt-4 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold">
            로그인
          </button>
        </form>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx){
  const c = parse(ctx.req.headers.cookie || "");
  if (process.env.ADMIN_TOKEN && c.admin_token === process.env.ADMIN_TOKEN) {
    return { redirect: { destination: "/admin", permanent:false } };
  }
  return { props:{} };
}
