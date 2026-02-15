import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['api.dicebear.com'],
  },
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/:path*',
      },
    ]
  },
}

export default nextConfig
