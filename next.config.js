const withOffline = require('next-offline')

module.exports = withOffline({
  workboxOpts: {
    swDest: '../public/service-worker.js',
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
  }
})
