// pages/about.jsx
import React, { useEffect, useState } from "react";
import HeaderNav from "../components/HeaderNav";
import Head from "next/head";

export default function About({ settings }) {
  const { kakaoChannelUrl, metaTitle, metaDescription } = settings || {};

  // ── 푸터 접근 시 플로팅 자동 숨김 ─────────────────────────
  const [hideFloat, setHideFloat] = useState(false);
  useEffect(() => {
    const OFFSET = 160; 
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const footer = document.querySelector("footer");
        if (!footer) {
          setHideFloat(false);
          ticking = false;
          return;
        }
        const { top } = footer.getBoundingClientRect();
        const nearFooter = top - window.innerHeight < OFFSET;
        setHideFloat(nearFooter);
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll(); 
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  // ─────────────────────────────────────────────────────────

  return (
    <main className="bg-white text-gray-900 antialiased min-h-screen flex flex-col">
      <Head>
        <title>{metaTitle || "회사소개 | 타요드라이브"}</title>
        {metaDescription ? (
          <meta name="description" content={metaDescription} />
        ) : null}
      </Head>

      <HeaderNav />

      {/* 본문 */}
      <main className="pt-28 pb-20 flex-1">
        {/* ▶︎ 회사 소개 섹션 */}
        <section className="relative z-10 pt-16 pb-20 bg-gradient-to-b from-white via-cyan-50 to-white">
          <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">

            {/* ✅ 텍스트 먼저 */}
            <div
              className="max-w-3xl text-center md:text-left animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">
                타요드라이브에 오신 걸 환영합니다
              </h2>

              <div className="text-gray-700 leading-relaxed space-y-6 text-lg md:text-xl">
                <p className="border-l-4 border-cyan-400 pl-4 italic text-gray-800">
                  여러분의 새로운 시작이 두려움이 아닌{" "}
                  <b className="text-blue-700">자신감</b>이 되도록 함께합니다.
                </p>
                <p>
                  타요드라이브 홈페이지를 방문해주신 여러분, 진심으로 환영합니다.
                  저희는 수강생 한 분의 삶에 있어 ‘운전’이라는 새로운 시작이
                  두려움이 아닌 자신감이 되도록 최선을 다해 노력하고 있습니다.
                </p>
                <p>
                  타요드라이브의 입증된 전문 강사진은 오랜 경험과 친절함을
                  바탕으로 <span className="font-semibold text-blue-800">1:1 맞춤형 교육</span>을
                  진행하며, 수강생의 눈높이에 맞춘 세심한 지도와 실전 중심
                  커리큘럼을 통해 안전한 운전 습관과 실력 향상을 위해 여러분의
                  든든한 길잡이가 되겠습니다.
                </p>
                <p className="font-semibold text-blue-800 text-center md:text-left">
                  감사합니다.
                  <br />
                  <span className="text-cyan-700">타요드라이브 임직원 일동</span>
                </p>
              </div>
            </div>

            {/* ✅ 이미지 (본문 아래) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 mt-14">
              <img
                src="/images/50.png"
                alt="상단 안내 이미지"
                className="w-full h-auto object-contain rounded-3xl shadow-xl border-4 border-cyan-100"
              />
              <img
                src="/images/40.png"
                alt="하단 안내 이미지"
                className="w-full h-auto object-contain rounded-3xl shadow-xl border-4 border-cyan-100"
              />
            </div>
          </div>
        </section>
      </main>

      {/* 플로팅 상담 배너 */}
      <div
        className={`fixed right-4 bottom-6 z-50 flex flex-col items-center space-y-3 transition-all duration-300 ${
          hideFloat ? "opacity-0 translate-y-3 pointer-events-none" : "opacity-100"
        }`}
      >
        <img
          src="/images/side_banner.webp"
          alt="24시간 무료상담 1666-8512"
          className="w-24 md:w-28 rounded-xl shadow-lg border border-blue-200 bg-white/90"
        />
        <a
          href={kakaoChannelUrl || "http://pf.kakao.com/_QPRDn"}
          className="block mt-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/images/제목_없는_디자인__1_-removebg-preview.png"
            alt="카카오톡 상담하기"
            className="w-24 md:w-28 rounded-full shadow-lg border border-yellow-300 bg-white/95"
          />
        </a>
      </div>

      {/* 푸터 */}
      <footer className="bg-[#3a3e45] py-8 text-center text-sm text-gray-100 border-t border-blue-100">
        <img
          src="/images/logo_footer.webp"
          alt="타요드라이브 푸터 로고"
          className="mx-auto h-10 mb-2"
        />
        <div className="mb-1 font-semibold">
          타요드라이브 | 대표번호{" "}
          <span className="text-cyan-300">1666-8512</span>
        </div>
        <div className="mb-1">
          COPYRIGHT (C) 2025 타요드라이브 ALL RIGHTS RESERVED
        </div>
        <div className="font-bold text-cyan-200">
          24시간 무료상담 1666-8512
        </div>
      </footer>

      {/* 추가 스타일 */}
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 1.1s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

/* ───────── SSR: 관리자 설정 불러오기 ───────── */
export async function getServerSideProps(ctx) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL || `http://${ctx.req.headers.host}`;
  let settings = null;
  try {
    const res = await fetch(`${base}/api/settings-public`, {
      headers: { Accept: "application/json" },
    });
    if (res.ok) settings = await res.json();
  } catch {
    settings = null;
  }
  return { props: { settings } };
}
