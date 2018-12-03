const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');
const path = require('path');

const outputDirectory = 'dist';

module.exports = function setup(env, argv) {
  const devMode = true; //!env.production;

  const styleLoader = {
    loader: 'style-loader',
    options: { sourceMap: true }
  };

  const base = {
    entry: './src/client/index.js',
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.css$/,
          use: [
            styleLoader,
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'resolve-url-loader', options: { sourceMap: true } },
            { loader: 'resolve-url-loader', options: { sourceMap: true } },
          ]
        }
      ]
    },
    devServer: {
      port: 3000,
      open: true,
      hot: true,
      proxy: {
        '/api': 'http://localhost:8080'
      }
    },
    plugins: [
      new CleanWebpackPlugin([outputDirectory]),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.ico'
      })
    ]
  };

  const dev = {
    ...base,
    mode: 'development',
    plugins: [
      ...base.plugins,
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'cheap-module-source-map'
  };

  const prod = {
    ...base,
    mode: 'production',
    devtool: 'source-map',
    optimization: {
      ...base.optimization,
      runtimeChunk: 'single',
      
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      ...base.plugins
    ],

    // TODO: library-ification?
    // externals: [nodeExternals()]
  };

  return dev;
};
