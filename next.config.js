const withOffline = require('next-offline')

module.exports = withOffline({
  env: {
    VERSION: 'b40d571'
  },
  workboxOpts: {
    swDest: process.env.NEXT_EXPORT
      ? 'service-worker.js'
      : 'public/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          expiration: {
            maxEntries: 200
          }
        }
      }
    ]
  },
  experimental: {
    async rewrites() {
      return [
        {
          source: '/service-worker.js',
          destination: '/_next/static/service-worker.js'
        }
      ]
    }
  }
})
