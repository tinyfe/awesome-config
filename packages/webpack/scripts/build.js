process.on('unhandledRejection', err => {
  throw err;
});

const webpack = require('webpack');
const configFactory = require('../config/webpack.config');

// Generate configuration
const config = configFactory('production');

function build() {
  console.log('Creating an optimized production build...');

  const complier = webpack(config);

  return new Promise((resolve, reject) => {
    complier.run((err, stats) => {
      let message;

      if (err) {
        if (!err.message) {
          return reject(err);
        }
      }
    });
  });
}

build();
