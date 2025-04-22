const nextConfig = {
  reactStrictMode: true,
  // Force Next.js to use the SWC compiler for CSS
  swcMinify: true,
  // Disable CSS optimization to troubleshoot CSS issues
  optimizeCss: false,
  // Add a custom webpack configuration to debug CSS loading
  webpack: (config, { dev, isServer }) => {
    // Log when webpack is processing CSS files
    if (dev && !isServer) {
      config.module.rules.forEach((rule) => {
        if (rule.test && rule.test.toString().includes('css')) {
          console.log('Processing CSS rule:', rule);
        }
      });
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
