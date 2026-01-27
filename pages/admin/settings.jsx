// pages/admin/settings.jsx
import { useState } from "react";
import Head from "next/head";
import cookie from "cookie";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminSettings({ initial }) {
  const [form, setForm] = useState(
    initial || { kakaoUrl: "", metaTitle: "", metaDesc: "" }
  );
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const save = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // ✅ body를 반드시 JSON.stringify로 직렬화
        body: JSON.stringify({
          kakaoUrl: form.kakaoUrl ?? "",
          metaTitle: form.metaTitle ?? "",
          metaDesc: form.metaDesc ?? "",
        }),
      });

      const data = await r.json();
      if (data.ok) {
        alert("저장되었습니다 ✅");
      } else {
        alert("저장 실패 ❌: " + (data.error || "알 수 없는 오류"));
      }
    } catch (e) {
      console.error(e);
      alert("서버 오류");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout>
      <Head><title>관리자 설정</title></Head>
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-xl p-6 space-y-6 border">
          <h1 className="text-2xl font-bold text-gray-800">사이트 설정</h1>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              카카오 채널 URL
            </label>
            <input
              type="text"
              name="kakaoUrl"
              value={form.kakaoUrl}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="https://pf.kakao.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              메타 타이틀
            </label>
            <input
              type="text"
              name="metaTitle"
              value={form.metaTitle}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              placeholder="사이트 제목"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">
              메타 설명
            </label>
            <textarea
              name="metaDesc"
              value={form.metaDesc}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="사이트 설명을 입력하세요"
            />
          </div>

          <button
            onClick={save}
            disabled={busy}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow disabled:opacity-50"
          >
            {busy ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  if (!process.env.ADMIN_TOKEN || cookies.admin_token !== process.env.ADMIN_TOKEN) {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }

  const base =
    process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;
  const r = await fetch(`${base}/api/admin/settings`, {
    headers: { Cookie: ctx.req.headers.cookie },
  });

  let initial = { kakaoUrl: "", metaTitle: "", metaDesc: "" };
  if (r.ok) {
    const data = await r.json();
    if (data?.data) initial = data.data;
  }
  return { props: { initial } };
}
