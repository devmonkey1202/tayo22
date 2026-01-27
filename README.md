 HEAD
# tayodrive-portfolio
=======
# 타요드라이브 - 유저 사이트 + 어드민 + DB (SQLite/Prisma)

- 반응형 상단 네비게이션(햄버거/풀스크린 Drawer), 공통 푸터
- 어드민(로그인/후기/상담예약/설정)
- Prisma(SQLite) + API CRUD + CSV 내보내기
- 후기 페이지는 DB에서 **SSR** 로딩 → 어드민 변경 즉시 유저 페이지 반영

## 실행
npm i
npm run db:push
npm run db:seed
npm run dev

유저: http://localhost:3000
어드민: http://localhost:3000/admin  (기본 비번: .env의 ADMIN_PASSWORD)

## 구조
- pages/ 유저 페이지 (헤더/푸터는 _app.jsx에서 공통)
- pages/reviews.jsx DB SSR
- pages/admin/* 어드민 화면
- pages/api/* CRUD & Export
- prisma/ SQLite 스키마 및 시드
- components/HeaderNav.jsx 반응형 네비
- components/Footer.jsx 공통 푸터
>>>>>>> 407edab2 (first commit)
