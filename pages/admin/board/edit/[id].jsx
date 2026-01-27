// pages/admin/board/edit/[id].jsx
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

function safeTrim(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}
function fmt(iso) {
  try {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function AdminBoardEdit() {
  const router = useRouter();
  const { id } = router.query;
  const page = Math.max(parseInt(router.query.page || "1", 10), 1);
  const listHref = useMemo(() => `/admin/board?page=${page}`, [page]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState(false);

  const [item, setItem] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  const titleRef = useRef(null);

  const canSave = useMemo(() => {
    return safeTrim(title).length >= 1 && safeTrim(content).length >= 1 && !saving;
  }, [title, content, saving]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    const r = await fetch(`/api/admin/board/${id}`);
    if (r.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.ok || !j.item) {
      setLoading(false);
      setToast("불러오기 실패");
      return;
    }

    const x = j.item;
    setItem(x);

    // ✅ content/body 둘 중 무엇이 와도 최대한 안전하게 수용
    setTitle(x.title ?? "");
    setContent(x.content ?? x.body ?? "");
    setIsPublished(Boolean(x.isPublished));
    setIsPinned(Boolean(x.isPinned));

    setLoading(false);

    setTimeout(() => titleRef.current?.focus?.(), 0);
  }

  // 떠나기 경고(수정 중)
  useEffect(() => {
    const hasDirty =
      item &&
      (safeTrim(title) !== safeTrim(item.title) ||
        String(content || "") !== String(item.content ?? item.body ?? "") ||
        Boolean(isPublished) !== Boolean(item.isPublished) ||
        Boolean(isPinned) !== Boolean(item.isPinned));

    const onBeforeUnload = (e) => {
      if (!hasDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [item, title, content, isPublished, isPinned]);

  // 단축키
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onSave();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        router.push(listHref);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listHref, title, content, isPublished, isPinned, saving, item]);

  async function onSave() {
    if (!canSave) {
      setToast("제목/내용을 입력하세요");
      return;
    }
    setSaving(true);

    const r = await fetch(`/api/admin/board/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      // ✅ 안전 필드만 전송
      body: JSON.stringify({
        title: safeTrim(title),
        content: String(content || ""),
        isPublished: Boolean(isPublished),
        isPinned: Boolean(isPinned),
      }),
    });

    if (r.status === 401) {
      router.replace("/admin/login");
      return;
    }

    const j = await r.json().catch(() => ({}));
    setSaving(false);

    if (!r.ok || !j.ok) {
      setToast("저장 실패");
      return;
    }

    setToast("저장 완료");
    await load();
  }

  function openPreview() {
    const slug = item?.slug;
    if (!slug) {
      setToast("slug 없음");
      return;
    }
    window.open(`/board/${slug}?page=1`, "_blank", "noopener,noreferrer");
  }

  async function copyUrl() {
    try {
      const slug = item?.slug;
      if (!slug) return setToast("slug 없음");
      const url = `${window.location.origin}/board/${slug}`;
      await navigator.clipboard.writeText(url);
      setToast("URL 복사 완료");
    } catch {
      setToast("복사 실패");
    }
  }

  return (
    <>
      <Head>
        <title>글 수정 | 게시판 관리</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* 헤더 */}
          <div className="rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(2,6,23,.08)] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-sm font-semibold text-gray-500">Admin</div>
                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
                  글 수정
                </h1>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">
                  Ctrl+Enter 저장 · Esc 목록
                </p>

                {item ? (
                  <div className="mt-3 text-sm text-gray-500 font-semibold">
                    URL:{" "}
                    <span className="font-extrabold text-gray-900">
                      /board/{item.slug}
                    </span>{" "}
                    · 작성 {fmt(item.createdAt)} · 수정 {fmt(item.updatedAt)}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Link
                  href={listHref}
                  className="min-h-[48px] px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99]"
                >
                  ← 목록
                </Link>

                <button
                  onClick={() => setPreview((v) => !v)}
                  className="min-h-[48px] px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99]"
                >
                  {preview ? "편집" : "미리보기"}
                </button>

                <button
                  onClick={copyUrl}
                  disabled={!item?.slug}
                  className="min-h-[48px] px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99] disabled:opacity-50"
                >
                  URL복사
                </button>

                <button
                  onClick={openPreview}
                  disabled={!item?.slug}
                  className="min-h-[48px] px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold shadow-lg hover:from-cyan-400 hover:to-blue-500 active:scale-[0.99] disabled:opacity-50"
                >
                  보기
                </button>

                <button
                  onClick={onSave}
                  disabled={!canSave}
                  className={`min-h-[48px] px-6 py-3 rounded-2xl font-extrabold shadow-lg active:scale-[0.99] transition-all ${
                    canSave
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  }`}
                >
                  {saving ? "저장 중…" : "저장"}
                </button>
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="mt-6 rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(2,6,23,.08)] overflow-visible">
            <div className="rounded-3xl overflow-hidden">
              <div className="px-6 sm:px-8 py-6 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-2 text-gray-800 font-extrabold">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="h-5 w-5"
                    />
                    공개
                  </label>
                  <label className="flex items-center gap-2 text-gray-800 font-extrabold">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="h-5 w-5"
                    />
                    상단고정
                  </label>
                </div>

                <div className="text-sm text-gray-500 font-semibold">
                  제목 {safeTrim(title).length}자 · 내용 {String(content || "").length}자
                </div>
              </div>

              {loading ? (
                <div className="px-6 py-14 text-center text-gray-500">
                  불러오는 중…
                </div>
              ) : !preview ? (
                <div className="px-6 sm:px-8 py-7 sm:py-8">
                  <div className="space-y-5">
                    <div>
                      <div className="text-sm font-extrabold text-gray-800">제목</div>
                      <input
                        ref={titleRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="예: 1월 휴무 안내"
                        className="mt-2 w-full min-h-[52px] px-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-semibold outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-200"
                      />
                    </div>

                    <div>
                      <div className="text-sm font-extrabold text-gray-800">내용</div>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="안내 내용을 입력하세요. 줄바꿈 그대로 표시됩니다."
                        className="mt-2 w-full min-h-[320px] px-4 py-4 rounded-2xl border border-gray-200 bg-white text-gray-900 font-medium outline-none focus:ring-4 focus:ring-cyan-100 focus:border-cyan-200"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        팁: 첫 줄에 핵심 요약을 적으면 읽는 속도가 확 올라갑니다.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 sm:px-8 py-7 sm:py-8">
                  <div className="text-sm font-extrabold text-gray-800">미리보기</div>
                  <div className="mt-4 rounded-3xl border border-gray-200 bg-gray-50 p-6 sm:p-7">
                    <div className="flex items-center gap-2">
                      {isPinned ? (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-50 text-cyan-800 border border-cyan-100">
                          공지
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gray-100 text-gray-700 border border-gray-200">
                          안내
                        </span>
                      )}
                      <div className="text-xl sm:text-2xl font-extrabold text-gray-900">
                        {safeTrim(title) || "제목이 없습니다"}
                      </div>
                    </div>
                    <div className="mt-4 text-[15px] sm:text-[16px] leading-7 sm:leading-8 text-gray-900 whitespace-pre-wrap">
                      {content || "내용이 없습니다"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 하단 큰 버튼 */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Link
              href={listHref}
              className="min-h-[52px] px-6 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99] text-center"
            >
              목록으로
            </Link>

            <button
              onClick={onSave}
              disabled={!canSave}
              className={`min-h-[52px] px-6 py-3 rounded-2xl font-extrabold shadow-lg active:scale-[0.99] transition-all ${
                canSave
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
                  : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
              }`}
            >
              {saving ? "저장 중…" : "저장"}
            </button>
          </div>
        </div>

        {toast ? (
          <div className="fixed left-1/2 bottom-6 -translate-x-1/2 px-4 py-3 rounded-full bg-gray-900 text-white text-sm font-extrabold shadow-lg">
            {toast}
          </div>
        ) : null}
      </div>
    </>
  );
}
