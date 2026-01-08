/** @type {import('next').NextConfig} */
const nextConfig = {
/** @type {import('next').NextConfig} */

  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*', 
        destination: 'https://jobify-wss2.onrender.com/api/:path*', 
      },
    ];
  },
};

export default nextConfig;
