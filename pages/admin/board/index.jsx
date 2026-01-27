// pages/admin/board/index.jsx
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";

function fmt(iso) {
  try {
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function AdminBoardList() {
  const router = useRouter();
  const page = Math.max(parseInt(router.query.page || "1", 10), 1);

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, take: 10 });
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  async function load(p = page) {
    setLoading(true);
    const r = await fetch(`/api/admin/board?page=${p}&take=10`);
    if (r.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const j = await r.json().catch(() => ({}));
    setItems(j.items || []);
    setMeta({
      total: j.total || 0,
      totalPages: j.totalPages || 1,
      take: j.take || 10,
    });
    setLoading(false);
  }

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const headerLabel = useMemo(() => {
    if (loading) return "불러오는 중…";
    return `총 ${meta.total}개 · ${page}/${meta.totalPages} 페이지`;
  }, [loading, meta.total, page, meta.totalPages]);

  function makeViewUrl(slug) {
    // ✅ 관리자 컨텍스트 전달: from=admin + apage(관리자 목록 페이지)
    // (유저 페이지의 page 파라미터는 “유저 목록 페이지” 용도로만 쓰도록 분리)
    const qs = new URLSearchParams();
    qs.set("from", "admin");
    qs.set("apage", String(page));
    return `/board/${encodeURIComponent(slug)}?${qs.toString()}`;
  }

  async function safeToggle(id, key) {
    const cur = items.find((x) => x.id === id);
    if (!cur) return;

    const next = !Boolean(cur[key]);

    // optimistic update
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, [key]: next } : x)));

    setBusyId(id);
    const r = await fetch(`/api/admin/board/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [key]: next }),
    });
    setBusyId(null);

    if (r.status === 401) {
      router.replace("/admin/login");
      return;
    }

    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok) {
      // rollback
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, [key]: !next } : x)));
      setToast("변경 실패");
      return;
    }

    setToast("변경 완료");
  }

  async function copyUrl(slug) {
    try {
      const url = `${window.location.origin}/board/${slug}`;
      await navigator.clipboard.writeText(url);
      setToast("URL 복사 완료");
    } catch {
      setToast("복사 실패");
    }
  }

  function openPreview(slug) {
    // ✅ 새 탭 “보기” + 관리자 컨텍스트 포함
    window.open(makeViewUrl(slug), "_blank", "noopener,noreferrer");
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const right = (
    <>
      <button
        onClick={() => load(page)}
        className="min-h-[44px] px-4 py-2 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99]"
      >
        새로고침
      </button>
      <Link
        href={`/admin/board/new?page=${page}`}
        className="min-h-[44px] px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold shadow-lg hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99]"
      >
        글쓰기
      </Link>
      <button
        onClick={onLogout}
        className="min-h-[44px] px-4 py-2 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99]"
      >
        로그아웃
      </button>
    </>
  );

  return (
    <AdminLayout title="게시판관리" right={right}>
      <Head>
        <title>게시판 관리 | 타요드라이브</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      {/* ✅ AdminLayout 컨텐츠 영역 안쪽 패딩만 */}
      <div className="p-4 sm:p-6">
        {/* 상단 요약 */}
        <div className="mb-4">
          <div className="text-gray-700 text-sm sm:text-base font-extrabold">{headerLabel}</div>
        </div>

        {/* 리스트 카드 */}
        <div className="rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(2,6,23,.08)] overflow-hidden">
          <div className="px-5 sm:px-7 py-4 border-b border-gray-200 text-gray-700 text-sm font-extrabold">
            게시글 목록
          </div>

          {loading ? (
            <div className="px-6 py-14 text-center text-gray-500">불러오는 중…</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {items.map((x) => {
                const published = Boolean(x.isPublished);
                const pinned = Boolean(x.isPinned);
                const isBusy = busyId === x.id;

                return (
                  <div
                    key={x.id}
                    className={`px-5 sm:px-7 py-5 sm:py-6 ${
                      isBusy ? "opacity-80" : ""
                    }`}
                  >
                    {/* ✅ 모바일: 위(제목/상태) 아래(버튼)로 자연스럽게 분리 */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      {/* 왼쪽 정보 */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {pinned ? (
                            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-100">
                              상단
                            </span>
                          ) : null}

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                              published
                                ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }`}
                          >
                            {published ? "공개" : "비공개"}
                          </span>

                          <div className="min-w-0 truncate text-[16px] sm:text-[18px] font-extrabold text-gray-900">
                            {x.title}
                          </div>
                        </div>

                        {/* ✅ URL: 모바일에서 깨지지 않게 한 줄 + 잘림 처리 */}
                        <div className="mt-2 text-sm sm:text-base text-gray-600">
                          URL:{" "}
                          <span className="font-extrabold text-gray-900 inline-block max-w-full truncate align-bottom">
                            /board/{x.slug}
                          </span>
                        </div>

                        <div className="mt-1 text-sm text-gray-500">
                          작성 {fmt(x.createdAt)} · 수정 {fmt(x.updatedAt)}
                        </div>
                      </div>

                      {/* 오른쪽 액션 */}
                      <div className="shrink-0">
                        {/* ✅ 모바일: 버튼이 많으면 “가로 스크롤”로 안전하게 (깨짐 방지) */}
                        <div className="-mx-1 overflow-x-auto">
                          <div className="px-1 flex items-center gap-2 w-max">
                            <button
                              onClick={() => safeToggle(x.id, "isPublished")}
                              disabled={isBusy}
                              className="min-h-[44px] px-4 py-2 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99] disabled:opacity-60"
                              title="공개 상태 변경"
                            >
                              {published ? "비공개로" : "공개로"}
                            </button>

                            <button
                              onClick={() => safeToggle(x.id, "isPinned")}
                              disabled={isBusy}
                              className="min-h-[44px] px-4 py-2 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99] disabled:opacity-60"
                              title="상단 고정 변경"
                            >
                              {pinned ? "상단해제" : "상단고정"}
                            </button>

                            <button
                              onClick={() => copyUrl(x.slug)}
                              className="min-h-[44px] px-4 py-2 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99]"
                              title="URL 복사"
                            >
                              URL복사
                            </button>

                            <button
                              onClick={() => openPreview(x.slug)}
                              className="min-h-[44px] px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold shadow-lg hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99]"
                              title="새 탭에서 보기"
                            >
                              보기
                            </button>

                            <Link
                              href={`/admin/board/edit/${x.id}?page=${page}`}
                              className="min-h-[44px] px-4 py-2 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99]"
                            >
                              수정
                            </Link>
                          </div>
                        </div>

                        {/* ✅ 모바일 힌트(선택) */}
                        <div className="mt-2 text-xs text-gray-400 sm:hidden">
                          버튼이 많으면 좌우로 밀어서 보세요 →
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {items.length === 0 ? (
                <div className="px-6 py-14 text-center text-gray-500">
                  글이 없습니다. “글쓰기”로 추가하세요.
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          {Array.from({ length: meta.totalPages }).map((_, i) => {
            const p = i + 1;
            const active = p === page;
            return (
              <Link
                key={p}
                href={`/admin/board?page=${p}`}
                className={`min-h-[48px] min-w-[48px] px-4 py-3 rounded-2xl font-extrabold border transition-all ${
                  active
                    ? "border-cyan-200 bg-cyan-50 text-cyan-900"
                    : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50 active:scale-[0.99]"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>

        {/* 토스트 */}
        {toast ? (
          <div className="fixed left-1/2 bottom-6 -translate-x-1/2 px-4 py-3 rounded-full bg-gray-900 text-white text-sm font-extrabold shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
}
