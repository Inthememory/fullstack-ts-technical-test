const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    ['/metrics', '/up'],
    createProxyMiddleware({
      target: process.env.API_PROXY_TARGET || 'http://localhost:3000',
      changeOrigin: true,
    })
  );
};
