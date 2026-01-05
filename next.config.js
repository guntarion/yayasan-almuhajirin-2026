/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React StrictMode for better development experience
  reactStrictMode: true,

  // Configure image domains for optimization
  images: {
    domains: [
      'images.unsplash.com', 
      'plus.unsplash.com',
      'lh3.googleusercontent.com', // Google profile images
      'avatars.githubusercontent.com', // GitHub profile images
      'platform-lookaside.fbsbx.com', // Facebook profile images
    ],
  },

  // Experimental features
  experimental: {
    // Keep these experimental features enabled if needed
    serverActions: {
      // Izinkan semua subdomain untuk development
      allowedOrigins: [
        'localhost:3000',
        '127.0.0.1:3000',
        '*.localhost:3000', // subdomain development
        '*.muhajirinrewwin.or.id', // subdomain production
        'muhajirinrewwin.or.id',
      ],
    },
  },

  // Rewrites untuk development subdomain testing
  // Gunakan format: http://subdomain.localhost:3000
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrites ini akan dihandle oleh middleware
        // Tapi kita definisikan di sini untuk dokumentasi
      ],
    };
  },
};

module.exports = nextConfig;
