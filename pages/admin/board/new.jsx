// pages/admin/board/new.jsx
import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";

function safeTrim(s) {
  return String(s || "").replace(/\s+/g, " ").trim();
}

export default function AdminBoardNew() {
  const router = useRouter();
  const page = Math.max(parseInt(router.query.page || "1", 10), 1);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState(false);

  const titleRef = useRef(null);

  const listHref = useMemo(() => `/admin/board?page=${page}`, [page]);

  const canSave = useMemo(() => {
    return safeTrim(title).length >= 1 && safeTrim(content).length >= 1 && !saving;
  }, [title, content, saving]);

  // 토스트 자동 종료
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 1600);
    return () => clearTimeout(t);
  }, [toast]);

  // 첫 포커스
  useEffect(() => {
    titleRef.current?.focus?.();
  }, []);

  // 드래프트(로컬) 자동 저장: 고령 사용자에게 “날아감” 방지 UX
  useEffect(() => {
    const key = "admin_board_draft_v1";
    const saved = (() => {
      try {
        return JSON.parse(localStorage.getItem(key) || "null");
      } catch {
        return null;
      }
    })();
    if (saved?.title || saved?.content) {
      setTitle(saved.title || "");
      setContent(saved.content || "");
      setIsPublished(saved.isPublished ?? true);
      setIsPinned(saved.isPinned ?? false);
      setToast("임시저장 불러옴");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const key = "admin_board_draft_v1";
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ title, content, isPublished, isPinned, ts: Date.now() })
        );
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [title, content, isPublished, isPinned]);

  // 떠나기 경고(작성 중)
  useEffect(() => {
    const hasDirty = safeTrim(title) || safeTrim(content);
    const onBeforeUnload = (e) => {
      if (!hasDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [title, content]);

  // 단축키: Ctrl+Enter 저장, Esc 취소
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
  }, [listHref, title, content, isPublished, isPinned, saving]);

  async function onSave() {
    if (!canSave) {
      setToast("제목/내용을 입력하세요");
      return;
    }
    setSaving(true);

    const r = await fetch("/api/admin/board", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ 가장 안전한 필드만 전송
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

    // 드래프트 제거
    try {
      localStorage.removeItem("admin_board_draft_v1");
    } catch {}

    setToast("저장 완료");

    // 생성 결과가 slug/id를 주면, 바로 수정 페이지로 이동
    const createdId = j.item?.id || j.id;
    if (createdId) {
      router.replace(`/admin/board/edit/${createdId}?page=${page}`);
      return;
    }

    router.replace(listHref);
  }

  function onResetDraft() {
    try {
      localStorage.removeItem("admin_board_draft_v1");
    } catch {}
    setTitle("");
    setContent("");
    setIsPublished(true);
    setIsPinned(false);
    setToast("임시저장 삭제");
    titleRef.current?.focus?.();
  }

  return (
    <>
      <Head>
        <title>글쓰기 | 게시판 관리</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>

      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* 상단 헤더 */}
          <div className="rounded-3xl border border-gray-200 bg-white shadow-[0_18px_50px_rgba(2,6,23,.08)] p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-sm font-semibold text-gray-500">Admin</div>
                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
                  글쓰기
                </h1>
                <p className="mt-2 text-gray-600 text-sm sm:text-base">
                  Ctrl+Enter 저장 · Esc 취소
                </p>
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
                  onClick={onResetDraft}
                  className="min-h-[48px] px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99]"
                  title="임시저장 삭제"
                >
                  초기화
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

          {/* 본문 카드 */}
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

              {!preview ? (
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
                        팁: 중요한 문장은 첫 줄에, 연락/시간/주소는 마지막에.
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

          {/* 하단 고정 액션(모바일/고령 사용자용 큰 버튼) */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Link
              href={listHref}
              className="min-h-[52px] px-6 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 font-extrabold hover:bg-gray-50 active:scale-[0.99] text-center"
            >
              취소(목록)
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
