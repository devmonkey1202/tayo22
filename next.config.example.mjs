/** cloudrun/next.config.example.mjs
 * Recommended if you want a smaller image:
 * 1) Rename to next.config.mjs (or merge into your existing config).
 * 2) Add `output: 'standalone'` so `.next/standalone` can be used.
 */
const nextConfig = {
  reactStrictMode: true,
  // Reduce runtime deps by outputting a standalone server
  output: 'standalone',
  // If you load remote images, configure domains here
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
};

export default nextConfig;