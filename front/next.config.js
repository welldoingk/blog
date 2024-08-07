/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 개발 환경에서만 rewrites 적용
  ...(process.env.NODE_ENV === 'development' && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: `http://localhost:8080/api/:path*`,
        },
      ];
    },
  }),

  // 프로덕션 빌드 시 정적 내보내기 설정
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
  }),

  // 환경변수를 클라이언트에 노출
  env: {
    API_URL: process.env.NODE_ENV === 'production'
        ?  process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:8080/',
  },
};

module.exports = nextConfig;