// pages/admin/reviews.jsx
import React, { useState, useEffect } from "react";
import Head from "next/head";
import cookie from "cookie";
import AdminLayout from "@/components/admin/AdminLayout";

/* ─────────────────────────────
   Toolbar
────────────────────────────── */
function Toolbar({ onExport, onAppend, onReplace }) {
  return (
    <div className="admin-toolbar grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:gap-2">
      <a href="/reviews" target="_blank" className="btn-soft !bg-blue-50 !text-blue-700">
        유저 페이지 보기
      </a>
      <button onClick={onExport} className="btn-soft !bg-cyan-500 !text-white">
        CSV 내보내기
      </button>
      <label className="btn-soft cursor-pointer !bg-indigo-500 !text-white">
        CSV 불러오기(추가)
        <input type="file" accept=".csv" className="hidden" onChange={onAppend} />
      </label>
      <label className="btn-soft cursor-pointer !bg-rose-500 !text-white">
        CSV 불러오기(대체)
        <input type="file" accept=".csv" className="hidden" onChange={onReplace} />
      </label>
    </div>
  );
}

/* ─────────────────────────────
   데스크톱 표 Row
────────────────────────────── */
function Row({ item, onSave, onDelete, busy, onOpenFull }) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(item);

  const save = async () => {
    await onSave(item.id, {
      title: draft.title,
      author: draft.author,
      email: draft.email || "",
      image: draft.image || "",
      body: draft.body || "",
      rating: draft.rating ?? 5,
      views: Number(draft.views ?? 0), // ✅ 조회수 추가
    });
    setEdit(false);
  };

  return (
    <tr className="border-t">
      <td className="px-3 py-2 align-top">
        {edit ? (
          <input
            className="w-full border rounded px-2 py-1"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
        ) : (
          <div className="font-semibold text-blue-800 break-words">{item.title}</div>
        )}
      </td>
      <td className="px-3 py-2 align-top">
        {edit ? (
          <input
            className="w-full border rounded px-2 py-1"
            value={draft.author}
            onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))}
          />
        ) : (
          <div className="break-words">{item.author}</div>
        )}
      </td>
      <td className="px-3 py-2 align-top">
        {edit ? (
          <input
            className="w-full border rounded px-2 py-1"
            value={draft.image || ""}
            onChange={(e) => setDraft((d) => ({ ...d, image: e.target.value }))}
          />
        ) : item.image ? (
          <span className="text-gray-500 truncate inline-block max-w-[220px] align-top">
            {item.image}
          </span>
        ) : (
          "-"
        )}
      </td>
      <td className="px-3 py-2 align-top">
        {edit ? (
          <textarea
            rows={3}
            className="w-full border rounded px-2 py-1"
            value={draft.body || ""}
            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
          />
        ) : (
          <div className="text-gray-700 leading-6">
            <div className="whitespace-pre-wrap line-clamp-2">{item.body}</div>
            {item.body && item.body.length > 60 && (
              <button
                className="ml-1 text-cyan-700 text-xs underline"
                onClick={() => onOpenFull(item)}
              >
                자세히
              </button>
            )}
          </div>
        )}
      </td>
      {/* ✅ 조회수 칼럼 */}
      <td className="px-3 py-2 align-top text-center">
        {edit ? (
          <input
            type="number"
            className="w-full border rounded px-2 py-1 text-center"
            value={draft.views ?? 0}
            onChange={(e) =>
              setDraft((d) => ({ ...d, views: e.target.value }))
            }
          />
        ) : (
          <div>{item.views ?? 0}</div>
        )}
      </td>
      <td className="px-3 py-2 align-top">
        {!edit ? (
          <div className="flex gap-2">
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
          <div className="flex gap-2">
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
                setDraft(item);
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
   모바일 카드 Row
────────────────────────────── */
function MobileRow({ item, onSave, onDelete, busy }) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState(item);
  const [open, setOpen] = useState(false);

  const save = async () => {
    await onSave(item.id, {
      title: draft.title,
      author: draft.author,
      email: draft.email || "",
      image: draft.image || "",
      body: draft.body || "",
      rating: draft.rating ?? 5,
      views: Number(draft.views ?? 0), // ✅ 조회수 추가
    });
    setEdit(false);
  };

  return (
    <div className="border-t first:border-t-0 p-3">
      {!edit ? (
        <>
          <div className="font-extrabold text-blue-800 text-base break-words">
            {item.title}
          </div>
          <div className="mt-1 text-sm text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
            <span>
              <b className="text-slate-800">작성자</b> {item.author || "-"}
            </span>
            <span>
              <b className="text-slate-800">이미지</b>{" "}
              {item.image ? (
                <span className="text-gray-500 break-all">{item.image}</span>
              ) : (
                "-"
              )}
            </span>
            <span>
              <b className="text-slate-800">조회수</b> {item.views ?? 0}
            </span>
          </div>
          <div className="mt-2 text-[15px] text-slate-800 whitespace-pre-wrap leading-7">
            {!open ? <div className="line-clamp-5">{item.body}</div> : item.body}
          </div>
          {item.body && item.body.length > 120 && (
            <button
              className="mt-1 text-cyan-700 text-sm font-semibold"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "접기" : "더보기"}
            </button>
          )}
          <div className="mt-3 flex gap-2">
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
        </>
      ) : (
        <>
          <input
            className="w-full border rounded px-3 py-2"
            value={draft.title}
            placeholder="제목"
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
          />
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              className="border rounded px-3 py-2"
              value={draft.author}
              placeholder="작성자"
              onChange={(e) =>
                setDraft((d) => ({ ...d, author: e.target.value }))
              }
            />
            <input
              className="border rounded px-3 py-2"
              value={draft.image || ""}
              placeholder="이미지 URL"
              onChange={(e) =>
                setDraft((d) => ({ ...d, image: e.target.value }))
              }
            />
          </div>
          <textarea
            rows={4}
            className="mt-2 w-full border rounded px-3 py-2"
            value={draft.body || ""}
            placeholder="내용"
            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
          />
          <input
            type="number"
            className="mt-2 w-full border rounded px-3 py-2"
            value={draft.views ?? 0}
            placeholder="조회수"
            onChange={(e) =>
              setDraft((d) => ({ ...d, views: e.target.value }))
            }
          />
          <div className="mt-3 flex gap-2">
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
                setDraft(item);
                setEdit(false);
              }}
              className="px-3 py-1.5 rounded bg-slate-400 text-white"
            >
              취소
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────
   AdminReviewsPage
────────────────────────────── */
export default function AdminReviewsPage({ initial = [] }) {
  const [items, setItems] = useState(Array.isArray(initial) ? initial : []);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ title: "", author: "", email: "", image: "", body: "" });

  /* ✅ 페이지네이션 */
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const viewItems = items.slice(start, start + PAGE_SIZE);
  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [totalPages]);

  const [fullReview, setFullReview] = useState(null);

  const refresh = async () => {
    const r = await fetch("/api/admin/reviews", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    if (!r.ok) {
      console.warn("GET /api/admin/reviews failed:", r.status, await r.text().catch(() => null));
      setItems([]);
      return;
    }
    const data = await r.json();
    const list = Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.reviews)
      ? data.reviews
      : Array.isArray(data)
      ? data
      : [];
    setItems(list);
  };

  useEffect(() => { refresh(); }, []);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) return alert("제목/작성자는 필수입니다.");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          title: form.title.trim(),
          author: form.author.trim(),
          email: (form.email || "").trim(),
          image: (form.image || "").trim(),
          body: (form.body || "").trim(),
        }),
      });
      if (!r.ok) { const j = await r.json().catch(() => ({})); alert(j?.error || "추가 실패"); return; }
      setForm({ title: "", author: "", email: "", image: "", body: "" });
      await refresh();
    } finally { setBusy(false); }
  };

  const onUpdate = async (id, patch) => {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ id, ...patch }),
      });
      if (!r.ok) { const j = await r.json().catch(() => ({})); alert(j?.error || "수정 실패"); return; }
      await refresh();
    } finally { setBusy(false); }
  };

  const onDelete = async (id) => {
    if (!confirm("삭제하시겠습니까?")) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });
      if (!r.ok) { const j = await r.json().catch(() => ({})); alert(j?.error || "삭제 실패"); return; }
      await refresh();
    } finally { setBusy(false); }
  };

  const toCSV = () => {
    const rows = [
      ["id", "title", "author", "email", "image", "body", "rating", "views", "createdAt"],
      ...items.map((v) => [
        v.id ?? "",
        v.title ?? "",
        v.author ?? "",
        v.email ?? "",
        v.image ?? "",
        v.body ?? "",
        v.rating ?? 5,
        v.views ?? 0,
        v.createdAt ?? "",
      ]),
    ];
    const esc = (s = "") => `"${String(s).replace(/"/g, '""').replace(/\r?\n/g, "\\n")}"`;
    const csv = rows.map((r) => r.map(esc).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "reviews.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const Pager = () => (
    <div className="px-4 py-3 flex items-center justify-between border-t bg-white">
      <div className="text-sm text-slate-500">총 {total}건 · {page}/{totalPages}페이지</div>
      <div className="flex items-center gap-1">
        <button className="pg-btn" disabled={page === 1} onClick={() => setPage(1)}>«</button>
        <button className="pg-btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
          .reduce((acc, p) => {
            if (acc.prev && p - acc.prev > 1)
              acc.out.push(<span key={"d" + p} className="px-1 text-slate-400">…</span>);
            acc.out.push(
              <button
                key={p}
                className={`pg-btn ${p === page ? "pg-active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            );
            acc.prev = p;
            return acc;
          }, { prev: 0, out: [] }).out}
        <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>›</button>
        <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>»</button>
      </div>
    </div>
  );

  return (
    <>
      <Head><title>관리자 | 후기목록</title></Head>
      <AdminLayout title="후기목록" right={<Toolbar onExport={toCSV} />}>
        <div className="p-4">
          {/* 새 후기 추가 */}
          <form onSubmit={onAdd} className="bg-white rounded-2xl shadow border p-4 mb-6">
            <div className="font-bold text-blue-800 mb-3">새 후기 추가</div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input name="title" value={form.title} onChange={onChange} placeholder="제목" className="border rounded-lg px-3 py-2" />
              <input name="author" value={form.author} onChange={onChange} placeholder="작성자" className="border rounded-lg px-3 py-2" />
              <input name="email" value={form.email} onChange={onChange} placeholder="이메일(선택)" className="border rounded-lg px-3 py-2" />
              <input name="image" value={form.image} onChange={onChange} placeholder="이미지 URL(선택)" className="border rounded-lg px-3 py-2" />
              <input name="body" value={form.body} onChange={onChange} placeholder="내용(선택)" className="border rounded-lg px-3 py-2" />
            </div>
            <div className="mt-3 flex justify-end">
              <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold disabled:opacity-50">추가</button>
            </div>
          </form>

          {/* 목록 */}
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            {/* 데스크톱 표 */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="text-left px-3 py-2 w-2/12">제목</th>
                      <th className="text-left px-3 py-2 w-1/12">작성자</th>
                      <th className="text-left px-3 py-2 w-2/12">이미지</th>
                      <th className="text-left px-3 py-2">내용</th>
                      <th className="px-3 py-2 w-20">조회수</th> {/* ✅ 조회수 칼럼 */}
                      <th className="px-3 py-2 w-28">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewItems.map((v) => (
                      <Row key={v.id} item={v} onSave={onUpdate} onDelete={onDelete} busy={busy} onOpenFull={setFullReview} />
                    ))}
                  </tbody>
                </table>
              </div>
              <Pager />
            </div>

            {/* 모바일 카드 목록 */}
            <div className="md:hidden">
              {viewItems.map((v) => (
                <MobileRow key={v.id} item={v} onSave={onUpdate} onDelete={onDelete} busy={busy} />
              ))}
              <Pager />
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* 모달 */}
      {fullReview && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFullReview(null)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,92vw)] max-h-[80vh] overflow-auto bg-white rounded-2xl shadow-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">후기 내용</h3>
              <button className="px-3 py-1.5 rounded bg-slate-700 text-white" onClick={() => setFullReview(null)}>닫기</button>
            </div>
            <div className="text-sm text-slate-500 mb-2">
              <b className="text-slate-700">제목</b> {fullReview.title} · <b className="text-slate-700">작성자</b> {fullReview.author}
            </div>
            <div className="whitespace-pre-wrap leading-7 text-[15px] text-slate-800">{fullReview.body || "-"}</div>
          </div>
        </div>
      )}

      {/* 전용 스타일 */}
      <style jsx global>{`
        .btn-soft { display:inline-flex; justify-content:center; align-items:center; border-radius:12px; padding:6px 12px; font-weight:600; line-height:1.2; box-shadow:0 1px 2px rgba(0,0,0,.05); border:1px solid rgba(203,213,225,.6); background:#fff; color:#0f172a; }
        .pg-btn{ min-width:32px; height:32px; padding:0 6px; border-radius:8px; font-size:12px; font-weight:600; background:#f1f5f9; color:#0f172a; border:1px solid #e2e8f0; }
        .pg-btn:hover{ background:#e2e8f0; }
        .pg-btn:disabled{ opacity:.5; cursor:not-allowed; }
        .pg-active{ background:#0ea5e9 !important; color:#fff !important; border-color:#0ea5e9 !important; }
        @media (max-width: 767px) { .admin-vert-deco { display:none !important; } }
      `}</style>
    </>
  );
}

// 🔒 SSR 보호 + 초기 데이터
export async function getServerSideProps(ctx) {
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  const token = cookies["admin_token"] || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return { redirect: { destination: "/admin/login", permanent: false } };
  }
  const xfProto = (ctx.req.headers["x-forwarded-proto"] || "https").toString().split(",")[0].trim();
  const base = process.env.NEXT_PUBLIC_SITE_URL || `${xfProto}://${ctx.req.headers.host}`;
  const r = await fetch(`${base}/api/admin/reviews`, {
    headers: { Cookie: ctx.req.headers.cookie || "" },
    cache: "no-store",
  });
  const raw = r.ok ? await r.json() : {};
  const initial =
    Array.isArray(raw?.items)   ? raw.items :
    Array.isArray(raw?.reviews) ? raw.reviews :
    Array.isArray(raw)          ? raw : [];
  return { props: { initial } };
}
