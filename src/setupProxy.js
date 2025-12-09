const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Only create proxy in development - in production, we'll use REACT_APP_API_BASE
  if (process.env.NODE_ENV === 'development') {
    console.log('Setting up API proxy to http://localhost:5000');
    app.use(
      ['/api', '/export-model', '/import-model'],
      createProxyMiddleware({
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Log proxy activity to troubleshoot issues
        logLevel: 'debug',
        pathRewrite: {
          '^/export-model': '/api/export-model',
          '^/import-model': '/api/import-model',
        },
      })
    );
  }
};
