/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    //CORS 문제 해결을 위한 설정(proxy 설정)
    return [
      {
        source: "/api/:path*",
        destination: `http://localhost:8080/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
