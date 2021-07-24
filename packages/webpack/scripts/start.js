process.on('unhandledRejection', err => {
  throw err;
});

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const configFactory = require('../config/webpack.config');

const devServerConfigFactory = require('../config/webpackDevServer.config');

const PORT = '9527';
const HOST = '0.0.0.0';

// Generate configuration
const config = configFactory('production');
const devServerConfig = devServerConfigFactory(PORT);

function createCompiler({ config, webpack }) {
  let complier;

  try {
    complier = webpack(config);
  } catch (err) {
    console.log(err.message || err);
  }

  return complier;
}

const complier = createCompiler({ config, webpack });

const devServer = new WebpackDevServer(complier, devServerConfig);

devServer.listen(PORT, HOST, err => {
  if (err) {
    return console.log(err);
  }

  // open
});
