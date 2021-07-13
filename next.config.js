const withOffline = require('next-offline')

module.exports = withOffline({
  env: {
    VERSION: 'b40d571'
  },
  workboxOpts: {
//    swDest: 'static/service-worker.js',
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
