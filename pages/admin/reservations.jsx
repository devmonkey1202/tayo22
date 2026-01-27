// pages/admin/reservations.jsx
import Head from "next/head";
import cookie from "cookie";
import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useRef, useState } from "react";

/* 어떤 응답이 와도 배열로 정규화 */
const toArray = (j) =>
  Array.isArray(j) ? j :
  Array.isArray(j.items) ? j.items :
  Array.isArray(j.reservations) ? j.reservations :
  Array.isArray(j.data) ? j.data : [];

/* 한국시간 짧은 포맷 */
const formatKST = (iso) => {
  const v = iso ? new Date(iso) : null;
  if (!v || Number.isNaN(v.getTime())) return "-";
  const y = String(v.getFullYear()).slice(2);
  const mm = String(v.getMonth()+1).padStart(2,"0");
  const dd = String(v.getDate()).padStart(2,"0");
  const hh = String(v.getHours()).padStart(2,"0");
  const mi = String(v.getMinutes()).padStart(2,"0");
  return `${y}.${mm}.${dd} ${hh}:${mi}`;
};

/* ✅ 상태값 → 배지 색상 클래스 */
const statusBadgeClass = (status) => {
  const s = String(status || "상담신청중");
  if (s.includes("완료"))   return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (s.includes("취소"))   return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  if (s.includes("확인"))   return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
  // 기본(신청중 등)
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
};

/* 한 줄 말줄임 셀 */
function CellTrunc({ children, titleText }) {
  const text = children == null ? "" : String(children);
  return <div className="truncate" title={titleText ?? text}>{text || "-"}</div>;
}

/* Toolbar */
function Toolbar({ onExport, onAppend, onReplace }) {
  return (
    <div className="admin-toolbar grid grid-cols-2 gap-2 md:flex md:flex-wrap md:items-center md:gap-2">
      <a href="/reviews" target="_blank" className="btn-soft !bg-blue-50 !text-blue-700">유저 페이지 보기</a>
      <button onClick={onExport} className="btn-soft !bg-cyan-500 !text-white">CSV 내보내기</button>
      <label className="btn-soft cursor-pointer !bg-indigo-500 !text-white">
        CSV 불러오기(추가)
        <input type="file" accept=".csv" className="hidden" onChange={onAppend}/>
      </label>
      <label className="btn-soft cursor-pointer !bg-rose-500 !text-white">
        CSV 불러오기(대체)
        <input type="file" accept=".csv" className="hidden" onChange={onReplace}/>
      </label>
    </div>
  );
}

/* ─────────────────────────────
   데스크톱 행(수정 모드 지원)
────────────────────────────── */
function DesktopRow({ r, busy, onChangeStatus, onDelete, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState(r);
  const [openMemo, setOpenMemo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => setD(r), [r.id]);

  // 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const save = async () => {
    await onUpdate(r.id, {
      name: d.name || "", gender: d.gender || "", phone: d.phone || "",
      carType: d.carType || "", region: d.region || "", memo: d.memo || "",
    });
    setEdit(false);
  };

  return (
    <>
      <tr className="border-t align-middle h-12">
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.name || ""} onChange={e=>setD(o=>({...o, name:e.target.value}))}/>
          : <CellTrunc>{r.name}</CellTrunc>}
        </td>
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.gender || ""} onChange={e=>setD(o=>({...o, gender:e.target.value}))}/>
          : <CellTrunc>{r.gender}</CellTrunc>}
        </td>
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.phone || ""} onChange={e=>setD(o=>({...o, phone:e.target.value}))}/>
          : <CellTrunc>{r.phone}</CellTrunc>}
        </td>
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.carType || ""} onChange={e=>setD(o=>({...o, carType:e.target.value}))}/>
          : <CellTrunc>{r.carType}</CellTrunc>}
        </td>
        <td className="px-3 py-2">{edit
          ? <input className="w-full border rounded px-2 py-1" value={d.region || ""} onChange={e=>setD(o=>({...o, region:e.target.value}))}/>
          : <CellTrunc>{r.region}</CellTrunc>}
        </td>

        {/* 메모: 미리보기 + 자세히 */}
        <td className="px-3 py-2">
          {edit ? (
            <textarea rows={3} className="w-full border rounded px-2 py-1" value={d.memo || ""} onChange={e=>setD(o=>({...o, memo:e.target.value}))}/>
          ) : (
            <div className="flex items-center gap-2">
              <CellTrunc titleText={r.memo}>{r.memo}</CellTrunc>
              {r.memo && r.memo.length > 0 && (
                <button className="link-sm" onClick={()=>setOpenMemo(true)}>자세히</button>
              )}
            </div>
          )}
        </td>

        {/* ✅ 상태 배지: 색상 자동 분기 */}
        <td className="px-3 py-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusBadgeClass(r.status)}`}
          >
            {r.status || "상담신청중"}
          </span>
        </td>

        <td className="px-3 py-2 text-slate-600 whitespace-nowrap">
          {formatKST(r.createdAt || r.updatedAt)}
        </td>

        {/* 관리: 드롭다운으로 접기 */}
        <td className="px-3 py-2 relative">
          {!edit ? (
            <div className="flex justify-end">
              <button className="btn-icon" onClick={()=>setMenuOpen(v=>!v)} aria-label="관리">⋯</button>
              {menuOpen && (
                <div ref={menuRef} className="action-menu">
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); setEdit(true); }} className="action-item">✏️ 수정</button>
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); onChangeStatus(r.id,"상담확인"); }} className="action-item">확인</button>
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); onChangeStatus(r.id,"상담완료됨"); }} className="action-item">완료</button>
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); onChangeStatus(r.id,"상담취소"); }} className="action-item">취소</button>
                  <button disabled={busy} onClick={()=>{ setMenuOpen(false); onDelete(r.id); }} className="action-item text-rose-600 hover:bg-rose-50">삭제</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-1">
              <button disabled={busy} onClick={save} className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">저장</button>
              <button disabled={busy} onClick={()=>{ setD(r); setEdit(false); }} className="px-2 py-1 rounded bg-slate-400 text-white text-xs">취소</button>
            </div>
          )}
        </td>
      </tr>

      {/* 메모 모달 */}
      {openMemo && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setOpenMemo(false)} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,92vw)] max-h-[80vh] overflow-auto bg-white rounded-2xl shadow-xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">메모 전체보기</h3>
              <button className="px-3 py-1.5 rounded bg-slate-700 text-white" onClick={()=>setOpenMemo(false)}>닫기</button>
            </div>
            <div className="whitespace-pre-wrap leading-7 text-[15px] text-slate-800">{r.memo || "-"}</div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────
   모바일 카드 (기능 동일)
────────────────────────────── */
function MobileCard({ r, busy, onChangeStatus, onDelete, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState(r);

  useEffect(() => setD(r), [r.id]);

  const save = async () => {
    await onUpdate(r.id, {
      name: d.name || "", gender: d.gender || "", phone: d.phone || "",
      carType: d.carType || "", region: d.region || "", memo: d.memo || "",
    });
    setEdit(false);
  };

  if (!edit) {
    return (
      <div className="border-t first:border-t-0 p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-extrabold text-slate-900 text-base">{r.name || "-"}</div>
            <div className="mt-1 text-[12px] text-slate-500">신청시각: {formatKST(r.createdAt || r.updatedAt)}</div>
            <div className="mt-1 text-[13px] text-slate-600 flex flex-wrap gap-x-3 gap-y-1">
              <span><b className="text-slate-800">성별</b> {r.gender || "-"}</span>
              <span className="whitespace-nowrap"><b className="text-slate-800">전화</b> {r.phone || "-"}</span>
              <span><b className="text-slate-800">차종</b> {r.carType || "-"}</span>
              <span><b className="text-slate-800">지역</b> {r.region || "-"}</span>
            </div>
          </div>
          {/* ✅ 모바일도 같은 색상 규칙 적용 */}
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${statusBadgeClass(r.status)}`}
          >
            {r.status || "상담신청중"}
          </span>
        </div>

        {r.memo && (
          <div className="mt-2 text-[15px] text-slate-800 whitespace-pre-wrap leading-7">
            {!open ? <div className="line-clamp-5">{r.memo}</div> : r.memo}
          </div>
        )}
        {r.memo && r.memo.length > 120 && (
          <button className="mt-1 text-cyan-700 text-sm font-semibold" onClick={() => setOpen(v=>!v)}>
            {open ? "메모 접기" : "메모 더보기"}
          </button>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <button disabled={busy} onClick={()=>setEdit(true)} className="px-3 py-1.5 rounded bg-slate-600 text-white">수정</button>
          <button disabled={busy} onClick={()=>onChangeStatus(r.id,"상담확인")} className="px-3 py-1.5 rounded bg-blue-600 text-white">확인</button>
          <button disabled={busy} onClick={()=>onChangeStatus(r.id,"상담완료됨")} className="px-3 py-1.5 rounded bg-emerald-600 text-white">완료</button>
          <button disabled={busy} onClick={()=>onChangeStatus(r.id,"상담취소")} className="px-3 py-1.5 rounded bg-amber-600 text-white">취소</button>
          <button disabled={busy} onClick={()=>onDelete(r.id)} className="px-3 py-1.5 rounded bg-rose-600 text-white">삭제</button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t first:border-t-0 p-3">
      <div className="grid grid-cols-2 gap-2">
        <input className="border rounded px-3 py-2" value={d.name || ""} placeholder="이름" onChange={e=>setD(o=>({...o, name:e.target.value}))}/>
        <input className="border rounded px-3 py-2" value={d.gender || ""} placeholder="성별" onChange={e=>setD(o=>({...o, gender:e.target.value}))}/>
        <input className="border rounded px-3 py-2" value={d.phone || ""} placeholder="전화번호" onChange={e=>setD(o=>({...o, phone:e.target.value}))}/>
        <input className="border rounded px-3 py-2" value={d.carType || ""} placeholder="차종" onChange={e=>setD(o=>({...o, carType:e.target.value}))}/>
        <input className="border rounded px-3 py-2 col-span-2" value={d.region || ""} placeholder="지역" onChange={e=>setD(o=>({...o, region:e.target.value}))}/>
      </div>
      <textarea rows={4} className="mt-2 w-full border rounded px-3 py-2" value={d.memo || ""} placeholder="메모" onChange={e=>setD(o=>({...o, memo:e.target.value}))}/>
      <div className="mt-3 flex flex-wrap gap-2">
        <button disabled={busy} onClick={save} className="px-3 py-1.5 rounded bg-emerald-600 text-white">저장</button>
        <button disabled={busy} onClick={()=>{ setD(r); setEdit(false); }} className="px-3 py-1.5 rounded bg-slate-400 text-white">취소</button>
      </div>
    </div>
  );
}

export default function AdminReservations({ initial, baseUrl }) {
  const [rows, setRows] = useState(() => toArray(initial || []));
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  // 페이지네이션 상태
  const PAGE_SIZE = 15;
  const [page, setPage] = useState(1);
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const viewRows = rows.slice(start, start + PAGE_SIZE);

  // 데이터 수 변동 시 현재 페이지 보정
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages]); // eslint-disable-line react-hooks/exhaustive-deps

  async function refresh() {
    try {
      setLoading(true);
      const r = await fetch("/api/admin/reservations", { headers: { Accept: "application/json" } });
      const d = await r.json().catch(() => []);
      const arr = toArray(d);
      setRows(arr);
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function del(id){
    if (!confirm("삭제하시겠습니까?")) return;
    setBusy(true);
    try{
      await fetch(`/api/admin/reservations?id=${encodeURIComponent(id)}`, { method:"DELETE" });
      await refresh();
    } finally { setBusy(false); }
  }

  async function changeStatus(id, status){
    setBusy(true);
    try{
      await fetch("/api/admin/reservations", {
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ id, status })
      });
      await refresh();
    } finally { setBusy(false); }
  }

  async function updateReservation(id, patch){
    setBusy(true);
    try{
      await fetch("/api/admin/reservations", {
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ id, ...patch })
      });
      await refresh();
    } finally { setBusy(false); }
  }

  // CSV 내보내기
  async function exportCsv(){
    try{
      const res = await fetch("/api/admin/reservations-csv", { credentials: "same-origin" });
      if(!res.ok){
        const t = await res.text().catch(()=> "");
        alert("CSV 내보내기 실패" + (t ? `: ${t}` : ""));
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reservations.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch(err){ alert("CSV 내보내기 중 오류"); }
  }

  const onCsvPick = (mode) => async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setBusy(true);
    try{
      const r = await fetch("/api/admin/reservations-import", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ csv:text, mode })
      });
      if (!r.ok) throw new Error("import failed");
      await refresh();
    } finally { setBusy(false); e.target.value = ""; }
  };

  // 페이지네이션 바 컴포넌트
  const Pager = () => (
    <div className="px-4 py-3 flex items-center justify-between border-t bg-white">
      <div className="text-sm text-slate-500">총 {total}건 · {page}/{totalPages}페이지</div>
      <div className="flex items-center gap-1">
        <button className="pg-btn" disabled={page===1} onClick={()=>setPage(1)}>{'«'}</button>
        <button className="pg-btn" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>{'‹'}</button>
        {
          Array.from({length: totalPages}, (_,i)=>i+1)
            .filter(p => p===1 || p===totalPages || Math.abs(p-page)<=2)
            .reduce((acc,p)=>{
              if(acc.prev && p-acc.prev>1) acc.out.push(<span key={'d'+p} className="px-1 text-slate-400">…</span>);
              acc.out.push(
                <button key={p} className={`pg-btn ${p===page ? 'pg-active' : ''}`} onClick={()=>setPage(p)}>{p}</button>
              );
              acc.prev=p; return acc;
            }, {prev:0,out:[]}).out
        }
        <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>{'›'}</button>
        <button className="pg-btn" disabled={page===totalPages} onClick={()=>setPage(totalPages)}>{'»'}</button>
      </div>
    </div>
  );

  return (
    <>
      <Head><title>관리자 | 상담예약목록</title></Head>
      <AdminLayout
        title="상담예약목록"
        right={<Toolbar onExport={exportCsv} onAppend={onCsvPick("append")} onReplace={onCsvPick("replace")} />}
      >
        <div className="p-4">
         <CreateInlineForm onCreated={() => refresh()} />
          <div className="bg-white rounded-2xl shadow border overflow-hidden">
            {/* 데스크톱 표 */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                {/* 고정 레이아웃 + 각 컬럼 너비 지정 */}
                <table className="w-full text-sm table-fixed">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 w-[12%]">이름</th>
                      <th className="px-3 py-2 w-[8%]">성별</th>
                      <th className="px-3 py-2 w-[14%]">전화번호</th>
                      <th className="px-3 py-2 w-[10%]">차종</th>
                      <th className="px-3 py-2 w-[10%]">지역</th>
                      <th className="px-3 py-2">메모</th>
                      <th className="px-3 py-2 w-[10%]">상태</th>
                      <th className="px-3 py-2 w-[16%]">신청시각</th>
                      <th className="px-3 py-2 w-[80px]">관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={9} className="text-center text-gray-500 py-10">불러오는 중…</td></tr>
                    ) : viewRows.length === 0 ? (
                      <tr><td colSpan={9} className="text-center text-gray-500 py-10">데이터가 없습니다.</td></tr>
                    ) : (
                      viewRows.map(r=>(
                        <DesktopRow
                          key={r.id}
                          r={r}
                          busy={busy}
                          onChangeStatus={changeStatus}
                          onDelete={del}
                          onUpdate={updateReservation}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* 데스크톱 페이지바 */}
              <Pager />
            </div>

            {/* 모바일 카드 목록 */}
            <div className="md:hidden">
              {loading ? (
                <div className="py-10 text-center text-gray-500">불러오는 중…</div>
              ) : viewRows.length === 0 ? (
                <div className="py-10 text-center text-gray-500">데이터가 없습니다.</div>
              ) : (
                viewRows.map((r) => (
                  <MobileCard
                    key={r.id}
                    r={r}
                    busy={busy}
                    onChangeStatus={changeStatus}
                    onDelete={del}
                    onUpdate={updateReservation}
                  />
                ))
              )}
              {/* 모바일 페이지바 */}
              <Pager />
            </div>
          </div>
        </div>
      </AdminLayout>

      {/* 경량 전용 스타일 */}
      <style jsx global>{`
        .btn-soft {
          display:inline-flex;justify-content:center;align-items:center;
          border-radius:12px;padding:6px 12px;font-weight:600;line-height:1.2;
          box-shadow:0 1px 2px rgba(0,0,0,.05);
          border:1px solid rgba(203,213,225,.6);background:#fff;color:#0f172a;
        }
        .link-sm { font-size:12px; color:#0ea5e9; text-decoration:underline; }
        .btn-icon {
          width:32px;height:32px;border-radius:8px;background:#334155;color:#fff;
          display:inline-flex;align-items:center;justify-content:center;font-size:18px;
        }
        .btn-icon:hover { background:#1f2937; }
        .action-menu {
          position:absolute; right:0; top:100%; margin-top:6px; z-index:50;
          background:#fff; border:1px solid rgba(0,0,0,.06); border-radius:12px;
          box-shadow:0 8px 24px rgba(0,0,0,.12); padding:6px; min-width:120px;
        }
        .action-item {
          display:block; width:100%; text-align:left; font-size:12px;
          padding:8px 10px; border-radius:8px;
        }
        .action-item:hover { background:#f8fafc; }

        /* 페이지네이션 버튼 */
        .pg-btn{
          min-width:32px; height:32px; padding:0 6px;
          border-radius:8px; font-size:12px; font-weight:600;
          background:#f1f5f9; color:#0f172a; border:1px solid #e2e8f0;
        }
        .pg-btn:hover{ background:#e2e8f0; }
        .pg-btn:disabled{ opacity:.5; cursor:not-allowed; }
        .pg-active{ background:#0ea5e9 !important; color:#fff !important; border-color:#0ea5e9 !important; }

        @media (max-width: 767px) { .admin-vert-deco { display:none!important; } }
      `}</style>
    </>
  );
}

/* ─────────────────────────────
   상단 인라인 입력폼 (신규 예약 추가) - UX 업그레이드 버전
   - 성별: 남/여 세그먼트 토글
   - 차종: 자차/희망 세그먼트 토글
   - 폼 레이아웃/가독성/포커스 상태 강화
────────────────────────────── */
function CreateInlineForm({ onCreated }) {
  const [f, setF] = useState({
    name: "", gender: "", phone: "", carType: "", region: "", memo: "",
    status: "상담신청중",
    createdAtLocal: "", // datetime-local (로컬)
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // 기본 신청시각: 현재 시각을 로컬 datetime-local 포맷으로 세팅
  useEffect(() => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());
    const hh = pad(now.getHours());
    const mi = pad(now.getMinutes());
    setF((p) => ({ ...p, createdAtLocal: `${yyyy}-${mm}-${dd}T${hh}:${mi}` }));
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setF((p) => ({ ...p, [name]: value }));
  };

  // 세그먼트 버튼 공통 렌더러
  const Segmented = ({ name, value, onChange, options }) => (
    <div className="seg-wrap" role="group" aria-label={name}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            className={`seg-btn ${active ? "seg-active" : ""}`}
            aria-pressed={active}
            onClick={() => onChange({ target: { name, value: opt.value } })}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    // 최소 유효성(성별/차종은 선택 편의 제공이지만 미선택도 허용 → 원하는 경우 필수로 바꿔도 됨)
    if (!f.name.trim() || !f.phone.trim()) {
      setErr("이름과 전화번호는 필수입니다.");
      return;
    }

    setSubmitting(true);
    try {
      // datetime-local(로컬)을 ISO(UTC)로 변환
      let createdAtISO = null;
      if (f.createdAtLocal) {
        const dt = new Date(f.createdAtLocal);
        if (!Number.isNaN(dt.getTime())) createdAtISO = dt.toISOString();
      }

      const res = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          gender: f.gender,                 // "남" | "여" | ""
          phone: f.phone,
          carType: f.carType,               // "자차" | "희망" | ""
          region: f.region,
          memo: f.memo,
          status: f.status,                 // 4가지 값 중 하나
          createdAt: createdAtISO,
        }),
      });

      const j = await res.json().catch(() => ({}));
      const created = j?.data ?? j;
      if (!res.ok || !created?.id) throw new Error(j?.error || "생성 실패");

      // 초기화 & 상위 리프레시
      setF((p) => ({
        ...p,
        name: "", gender: "", phone: "", carType: "", region: "", memo: "",
      }));
      onCreated && onCreated(created);
    } catch (e) {
      setErr(e?.message || "네트워크 오류");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-4 rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-extrabold text-slate-900">신규 예약 추가</div>
        {submitting && <div className="text-sm text-slate-500">처리 중…</div>}
      </div>

      {err && (
        <div className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-rose-700 text-sm">
          {err}
        </div>
      )}

      {/* 상단: 핵심 필드 */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-3">
          <label className="lbl">이름 <span className="req">*</span></label>
          <input
            name="name" value={f.name} onChange={change}
            className="inp" placeholder="홍길동"
            autoComplete="name"
          />
        </div>

        <div className="md:col-span-3">
          <label className="lbl">전화번호 <span className="req">*</span></label>
          <input
            name="phone" value={f.phone} onChange={change}
            className="inp" placeholder="010-1234-5678"
            inputMode="tel" autoComplete="tel"
          />
        </div>

        <div className="md:col-span-3">
          <label className="lbl">성별</label>
          <Segmented
            name="gender"
            value={f.gender}
            onChange={change}
            options={[
              { label: "남", value: "남" },
              { label: "여", value: "여" },
            ]}
          />
        </div>

        <div className="md:col-span-3">
          <label className="lbl">차종</label>
          <Segmented
            name="carType"
            value={f.carType}
            onChange={change}
            options={[
              { label: "자차", value: "자차" },
              { label: "희망", value: "희망" },
            ]}
          />
        </div>
      </div>

      {/* 중단: 지역/상태/신청시각 */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-3">
          <label className="lbl">지역</label>
          <input
            name="region" value={f.region} onChange={change}
            className="inp" placeholder="서울 강남구"
            autoComplete="address-level2"
          />
        </div>

        <div className="md:col-span-3">
          <label className="lbl">상태</label>
          <select name="status" value={f.status} onChange={change} className="inp">
            <option value="상담신청중">상담신청중</option>
            <option value="상담확인">상담확인</option>
            <option value="상담완료">상담완료</option>
            <option value="상담취소">상담취소</option>
          </select>
        </div>

        <div className="md:col-span-6">
          <label className="lbl">신청시각</label>
          <input
            type="datetime-local"
            name="createdAtLocal"
            value={f.createdAtLocal}
            onChange={change}
            className="inp"
            title="신청시각(로컬)"
          />
        </div>
      </div>

      {/* 하단: 메모 */}
      <div className="mt-3">
        <label className="lbl">메모</label>
        <textarea
          rows={3}
          name="memo"
          value={f.memo}
          onChange={change}
          className="inp"
          placeholder="상담 관련 메모를 입력하세요"
        />
      </div>

      {/* 액션 */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          className="btn ghost"
          onClick={() =>
            setF((p) => ({
              ...p,
              name: "", gender: "", phone: "", carType: "", region: "", memo: "",
              status: "상담신청중",
            }))
          }
          disabled={submitting}
        >
          초기화
        </button>
        <button
          disabled={submitting}
          className="btn primary"
        >
          {submitting ? "추가 중…" : "추가"}
        </button>
      </div>

      {/* 컴포넌트 전용 경량 스타일 */}
      <style jsx global>{`
        .lbl { display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:6px; }
        .req { color:#ef4444; }
        .inp {
          width:100%; border:1px solid #e2e8f0; border-radius:12px;
          padding:10px 12px; font-size:14px; background:#fff;
          transition:border-color .15s, box-shadow .15s;
        }
        .inp:focus { outline:none; border-color:#93c5fd; box-shadow:0 0 0 3px rgba(59,130,246,.15); }

        .seg-wrap {
          display:flex; gap:6px; background:#f8fafc; padding:6px;
          border:1px solid #e2e8f0; border-radius:12px;
        }
        .seg-btn {
          flex:1; padding:8px 10px; font-weight:700; font-size:13px;
          border-radius:10px; border:1px solid transparent; background:#fff; color:#0f172a;
        }
        .seg-btn:hover { background:#f1f5f9; }
        .seg-active { background:#0ea5e9; color:#fff; border-color:#0ea5e9; }

        .btn {
          border-radius:12px; padding:10px 16px; font-weight:800; font-size:14px;
          border:1px solid transparent; transition:background .15s, opacity .15s, box-shadow .15s;
        }
        .btn.primary { background:#2563eb; color:#fff; box-shadow:0 6px 16px rgba(37,99,235,.25); }
        .btn.primary:hover { background:#1d4ed8; }
        .btn.ghost { background:#fff; color:#334155; border-color:#e2e8f0; }
        .btn.ghost:hover { background:#f8fafc; }
        .btn:disabled { opacity:.6; cursor:not-allowed; box-shadow:none; }
      `}</style>
    </form>
  );
}



export async function getServerSideProps(ctx){
  const cookies = cookie.parse(ctx.req.headers.cookie || "");
  const token = cookies["admin_token"] || "";
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return { redirect:{ destination:"/admin/login", permanent:false } };
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;
  const r = await fetch(`${baseUrl}/api/admin/reservations`, {
    headers:{ Cookie: ctx.req.headers.cookie || "", Accept: "application/json" }
  });

  const normalize = (j) =>
    Array.isArray(j) ? j :
    Array.isArray(j.items) ? j.items :
    Array.isArray(j.reservations) ? j.reservations :
    Array.isArray(j.data) ? j.data : [];

  const initialRaw = r.ok ? await r.json() : [];
  const initial = normalize(initialRaw);

  return { props:{ initial, baseUrl } };
}
