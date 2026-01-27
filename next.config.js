// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },   // imgbb CDN
      { protocol: 'https', hostname: 'svgshare.com' } // (프로젝트에서 쓰면)
      // 필요 시 다른 외부 이미지 도메인도 여기에 추가
    ],
  },
};

module.exports = nextConfig;
