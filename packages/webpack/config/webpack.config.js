const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBar = require('webpackbar');

const postcssNormalize = require('postcss-normalize');

const paths = require('./paths');

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/i;
const scssRegex = /\.s[ac]ss$/i;
const scssModuleRegex = /\.module\.s[ac]ss$/i;

module.exports = webpackEnv => {
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  const getStyleLoaders = (cssOptions, preProcessor, preOptions = {}) => {
    const loaders = [
      isEnvDevelopment && require.resolve('style-loader'),
      isEnvProduction && {
        loader: MiniCssExtractPlugin.loader,
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            ident: 'postcss',
            plugins: () => [
              'postcss-flexbugs-fixes',
              [
                'postcss-preset-env',
                {
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                },
              ],
              [
                'cssnano',
                {
                  preset: 'default',
                },
              ],
              postcssNormalize(),
            ],
            sourceMap: isEnvProduction,
          },
        },
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push(
        {
          loader: require.resolve('resolve-url-loader'),
          options: {
            sourceMap: true,
          },
        },
        {
          loader: require.resolve(preProcessor),
          options: preOptions,
        },
      );
    }

    return loaders;
  };

  return {
    target: isEnvDevelopment ? ['web'] : ['web', 'es5'],
    mode: isEnvDevelopment ? 'development' : 'production',
    entry: paths.appIndexJs,
    output: {
      filename: '[name].[fullhash:8].js',
      path: paths.appBuild,
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: paths.resolveApp('.temp_cache'),
    },
    devtool: isEnvDevelopment ? 'eval-cheap-module-source-map' : 'cheap-module-source-map',
    resolve: {
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`),
    },
    // externals: {
    //     react: 'React',
    //     'react-dom': 'ReactDOM',
    // },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          exclude: /\.min\.js$/,
          // terserOptions: {
          //     parse: {
          //         ecma: 8,
          //     },
          //     compress: {
          //         ecma: 5,
          //         warnings: false,
          //         comparisons: false,
          //         inline: 2,
          //     },
          //     cache: true,
          // },
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(tsx?|jsx?)$/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
          exclude: /node_modules/,
        },
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isEnvProduction,
          }),
        },
        {
          test: cssModuleRegex,
          use: getStyleLoaders({
            importLoaders: 1,
            sourceMap: isEnvProduction,
            modules: true,
          }),
        },
        {
          test: scssRegex,
          exclude: scssModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              modules: false,
              sourceMap: !isEnvProduction,
            },
            'sass-loader',
            {
              implementation: require.resolve('sass'),
              sourceMap: true,
            },
          ),
        },
        {
          test: scssModuleRegex,
          use: getStyleLoaders(
            {
              importLoaders: 2,
              modules: true,
              sourceMap: !isEnvProduction,
            },
            'sass-loader',
            {
              implementation: require.resolve('sass'),
              sourceMap: true,
            },
          ),
        },
        {
          test: [/\.png$/, /\.gif$/, /\.jpe?g$/, /\.bmp$/],
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10 * 1024,
                name: '[name].[contenthash:8].[ext]',
                outputPath: 'assets/images',
              },
            },
          ],
        },
        {
          test: /\.(ttf|woff|woff2|eot|otf)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name].[contenthash:8].[ext]',
                outputPath: 'assets/fonts',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            template: paths.appHtml,
            cache: false,
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined,
        ),
      ),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
      new WebpackBar(),
      new CleanWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],
    devServer: {
      host: '0.0.0.0',
      port: 9527,
      contentBase: paths.appPublic,
      // stats: 'errors-only',
      clientLogLevel: 'none',
      watchContentBase: true,
      compress: true,
      // open: true,
      hot: true,
      // historyApiFallback: true,
    },
    performance: false,
  };
};
