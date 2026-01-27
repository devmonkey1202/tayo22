// pages/admin/faqs.jsx
import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import cookie from "cookie";
import AdminLayout from "../../components/admin/AdminLayout"; // 기존 상대경로 유지

/* ─────────────────────────────
   툴바 (모바일 2열, 데스크탑 가로)
────────────────────────────── */
function Toolbar({ onExport, onImport }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:gap-2">
      <a
        href="/faq"
        target="_blank"
        className="btn-soft !bg-blue-50 !text-blue-700"
      >
        유저 페이지 보기
      </a>

      <button onClick={onExport} className="btn-soft !bg-cyan-500 !text-white">
        CSV 내보내기
      </button>

      <label className="btn-soft cursor-pointer !bg-indigo-500 !text-white">
        CSV 가져오기
        <input type="file" accept=".csv,text/csv" className="hidden" onChange={onImport} />
      </label>
    </div>
  );
}

/* ─────────────────────────────
   데스크탑 행 (수정 모드 지원)
────────────────────────────── */
function DesktopRow({ item, onSave, onDelete, busy }) {
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState(item);
  useEffect(() => setD(item), [item.id]);

  const save = async () => {
    await onSave(item.id, { icon: d.icon || "❓", q: d.q || "", a: d.a || "" });
    setEdit(false);
  };

  return (
    <tr className="border-t align-top">
      <td className="px-3 py-2">
        {edit ? (
          <input
            className="w-16 border rounded px-2 py-1 text-center"
            value={d.icon || ""}
            onChange={(e) => setD((o) => ({ ...o, icon: e.target.value }))}
            placeholder="❓"
          />
        ) : (
          <span className="text-xl">{item.icon}</span>
        )}
      </td>
      <td className="px-3 py-2">
        {edit ? (
          <input
            className="w-full border rounded px-2 py-1"
            value={d.q || ""}
            onChange={(e) => setD((o) => ({ ...o, q: e.target.value }))}
            placeholder="질문"
          />
        ) : (
          <div className="font-semibold text-blue-800">{item.q}</div>
        )}
      </td>
      <td className="px-3 py-2">
        {edit ? (
          <textarea
            rows={3}
            className="w-full border rounded px-2 py-1"
            value={d.a || ""}
            onChange={(e) => setD((o) => ({ ...o, a: e.target.value }))}
            placeholder="답변"
          />
        ) : (
          <div className="text-gray-700 leading-7 clamp-3 whitespace-pre-wrap">
            {item.a}
          </div>
        )}
      </td>
      <td className="px-3 py-2">
        {!edit ? (
          <div className="flex flex-wrap gap-2">
            <button
              disabled={busy}
              onClick={() => setEdit(true)}
              className="px-3 py-1.5 rounded bg-blue-600 text-white"
            >
              수정
            </button>
            <button
              disabled={busy}
              onClick={() => onDelete(item.id)}
              className="px-3 py-1.5 rounded bg-red-600 text-white"
            >
              삭제
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              disabled={busy}
              onClick={save}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white"
            >
              저장
            </button>
            <button
              disabled={busy}
              onClick={() => {
                setD(item);
                setEdit(false);
              }}
              className="px-3 py-1.5 rounded bg-slate-400 text-white"
            >
              취소
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

/* ─────────────────────────────
   모바일 카드 (읽기 쉬움 + 수정 모드)
────────────────────────────── */
function MobileCard({ item, onSave, onDelete, busy }) {
  const [edit, setEdit] = useState(false);
  const [more, setMore] = useState(false);
  const [d, setD] = useState(item);
  useEffect(() => setD(item), [item.id]);

  const save = async () => {
    await onSave(item.id, { icon: d.icon || "❓", q: d.q || "", a: d.a || "" });
    setEdit(false);
  };

  if (!edit) {
    return (
      <div className="border-t first:border-t-0 p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{item.icon}</div>
          <div className="flex-1">
            <div className="font-extrabold text-slate-900">{item.q}</div>
            {item.a && (
              <div className="mt-2 text-[15px] text-slate-800 leading-7 whitespace-pre-wrap">
                {!more ? <div className="clamp-5">{item.a}</div> : item.a}
              </div>
            )}
            {item.a && item.a.length > 120 && (
              <button
                className="mt-1 text-cyan-700 text-sm font-semibold"
                onClick={() => setMore((v) => !v)}
              >
                {more ? "답변 접기" : "답변 더보기"}
              </button>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                disabled={busy}
                onClick={() => setEdit(true)}
                className="px-3 py-1.5 rounded bg-slate-600 text-white"
              >
                수정
              </button>
              <button
                disabled={busy}
                onClick={() => onDelete(item.id)}
                className="px-3 py-1.5 rounded bg-rose-600 text-white"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 편집 모드(모바일)
  return (
    <div className="border-t first:border-t-0 p-4">
      <div className="grid grid-cols-4 gap-2">
        <input
          className="col-span-1 border rounded px-3 py-2 text-center"
          value={d.icon || ""}
          placeholder="❓"
          onChange={(e) => setD((o) => ({ ...o, icon: e.target.value }))}
        />
        <input
          className="col-span-3 border rounded px-3 py-2"
          value={d.q || ""}
          placeholder="질문"
          onChange={(e) => setD((o) => ({ ...o, q: e.target.value }))}
        />
      </div>
      <textarea
        rows={5}
        className="mt-2 w-full border rounded px-3 py-2"
        value={d.a || ""}
        placeholder="답변"
        onChange={(e) => setD((o) => ({ ...o, a: e.target.value }))}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          disabled={busy}
          onClick={save}
          className="px-3 py-1.5 rounded bg-emerald-600 text-white"
        >
          저장
        </button>
        <button
          disabled={busy}
          onClick={() => {
            setD(item);
            setEdit(false);
          }}
          className="px-3 py-1.5 rounded bg-slate-400 text-white"
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default function AdminFaqs({ initialFaqs, baseUrl }) {
  const [faqs, setFaqs] = useState(Array.isArray(initialFaqs) ? initialFaqs : []);
  const [form, setForm] = useState({ icon: "❓", q: "", a: "" });
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    const res = await fetch("/api/admin/faqs", { credentials: "same-origin" });
    const data = await res.json().catch(() => []);
    setFaqs(Array.isArray(data) ? data : []);
  };

  const addFaq = async (e) => {
    e.preventDefault();
    if (!form.q.trim() || !form.a.trim()) return;
    setBusy(true);
    try {
      await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ icon: "❓", q: "", a: "" });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const updateFaq = async (id, patch) => {
    setBusy(true);
    try {
      await fetch("/api/admin/faqs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const deleteFaq = async (id) => {
    if (!confirm("삭제하시겠습니까?")) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/faqs?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  // ✅ Excel 친화적 CSV 내보내기(BOM 포함, 줄바꿈/따옴표 이스케이프)
  const exportCSV = async () => {
    const res = await fetch("/api/admin/faqs", { credentials: "same-origin" });
    const arr = await res.json().catch(() => []);
    const rows = [["id", "icon", "q", "a"]].concat(
      (Array.isArray(arr) ? arr : []).map((f) => [
        f.id ?? "",
        f.icon ?? "❓",
        f.q ?? "",
        f.a ?? "",
      ])
    );
    const esc = (s = "") =>
      `"${String(s).replace(/"/g, '""').replace(/\r?\n/g, "\\n")}"`;
    const csv = rows.map((r) => r.map(esc).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "faqs.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // ✅ CSV 가져오기(헤더: id,icon,q,a). id 있으면 수정, 없으면 생성.
  const importCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();

    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = lines.shift() || "";
    const headers =
      header.match(/("([^"]|"")*"|[^,]+)/g)?.map((s) =>
        s.replace(/^"|"$/g, "").trim()
      ) || [];
    const need = ["id", "icon", "q", "a"];
    if (!need.every((k) => headers.includes(k))) {
      alert("CSV 헤더는 id,icon,q,a 이어야 합니다.");
      e.target.value = "";
      return;
    }
    const idx = (k) => headers.indexOf(k);

    setBusy(true);
    try {
      for (const ln of lines) {
        const cols =
          ln.match(/("([^"]|"")*"|[^,]+)/g)?.map((s) =>
            s.replace(/^"|"$/g, "").replace(/""/g, '"').replace(/\\n/g, "\n")
          ) || [];
        const payload = {
          icon: cols[idx("icon")] || "❓",
          q: cols[idx("q")] || "",
          a: cols[idx("a")] || "",
        };
        const id = (cols[idx("id")] || "").trim();

        if (id) {
          await fetch("/api/admin/faqs", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, ...payload }),
          });
        } else {
          await fetch("/api/admin/faqs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      }
      await refresh();
      alert("CSV 가져오기가 완료되었습니다.");
    } catch (err) {
      console.error(err);
      alert("CSV 가져오기 중 오류가 발생했습니다.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <Head>
        <title>관리자 | FAQ 관리</title>
      </Head>

      <AdminLayout
        title="FAQ"
        right={<Toolbar onExport={exportCSV} onImport={importCSV} />}
      >
        <div className="p-4 md:p-6">
          {/* 추가 폼 */}
          <form
            onSubmit={addFaq}
            className="bg-white rounded-2xl shadow border p-4 mb-6"
          >
            <div className="font-bold text-blue-800 mb-3">새 FAQ 추가</div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <input
                className="md:col-span-1 border rounded-lg px-3 py-2 text-center"
                placeholder="아이콘(예: ❓)"
                value={form.icon}
                onChange={(e) =>
                  setForm((f) => ({ ...f, icon: e.target.value }))
                }
              />
              <input
                className="md:col-span-2 border rounded-lg px-3 py-2"
                placeholder="질문"
                value={form.q}
                onChange={(e) => setForm((f) => ({ ...f, q: e.target.value }))}
              />
              <textarea
                className="md:col-span-3 border rounded-lg px-3 py-2"
                placeholder="답변(줄바꿈 가능)"
                rows={2}
                value={form.a}
                onChange={(e) => setForm((f) => ({ ...f, a: e.target.value }))}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <button
                disabled={busy}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold disabled:opacity-50"
              >
                추가
              </button>
            </div>
          </form>

          {/* 목록: 데스크톱 테이블 + 모바일 카드 */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            {/* 데스크톱 */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2 w-16">아이콘</th>
                    <th className="text-left px-3 py-2">질문</th>
                    <th className="text-left px-3 py-2">답변</th>
                    <th className="px-3 py-2 w-36">작업</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((f) => (
                    <DesktopRow
                      key={f.id}
                      item={f}
                      onSave={updateFaq}
                      onDelete={deleteFaq}
                      busy={busy}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* 모바일 */}
            <div className="md:hidden">
              {faqs.map((f) => (
                <MobileCard
                  key={f.id}
                  item={f}
                  onSave={updateFaq}
                  onDelete={deleteFaq}
                  busy={busy}
                />
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* 이 페이지 전용 경량 스타일 */}
      <style jsx global>{`
        .btn-soft {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          border-radius: 0.75rem;       /* rounded-xl */
          padding: 0.375rem 0.75rem;    /* px-3 py-1.5 */
          font-weight: 600;
          line-height: 1.2;
          box-shadow: 0 1px 2px rgba(0,0,0,.05);
          border: 1px solid rgba(203,213,225,.6); /* slate-300/60 */
          background: #fff;
          color: #0f172a;               /* slate-900 */
        }
        /* 상단 장식 세로글자 겹침 방지(모바일 숨김, 데스크탑 유지) */
        @media (max-width: 767px) {
          .admin-vert-deco { display: none !important; }
        }
      `}</style>
    </>
  );
}

// -------- SSR 보호: 토큰 검증 후 초기 데이터 주입 --------
export async function getServerSideProps(ctx) {
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  const token = cookies["admin_token"] || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;
  const res = await fetch(`${baseUrl}/api/admin/faqs`, {
    headers: { Cookie: ctx.req.headers.cookie || "" },
  });
  const initialFaqs = res.ok ? await res.json() : [];
  return { props: { initialFaqs, baseUrl } };
}
