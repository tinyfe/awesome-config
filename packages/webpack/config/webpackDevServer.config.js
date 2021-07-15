const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const DEFAULT_HOST = process.env.HOST || '0.0.0.0';
const DEFAULT_PORT = 9527;

module.exports = (port = DEFAULT_PORT, proxy, allowedHost) => {
  return {
    host: DEFAULT_HOST,
    port,
    contentBase: paths.appPublic,
    // stats: 'errors-only',
    clientLogLevel: 'none',
    watchContentBase: true,
    compress: true,
    // open: true,
    hot: true,
    proxy,
    // before(app, server) {},
  };
};
