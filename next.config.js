/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lokesh-food-ordering.s3.amazonaws.com',
      },
    ]
  }
}

module.exports = nextConfig
