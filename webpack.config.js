const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

const outputDirectory = 'dist';

module.exports = function setup(env, argv) {
  const devMode = true; //!env.production;

  const styleLoader = devMode ? { loader: 'style-loader', options: { sourceMap: true } } : MiniCssExtractPlugin.loader;

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
        },
        {
          test: /\.s?[ac]ss$/,
          use: [
            styleLoader,
            { loader: 'css-loader', options: { sourceMap: true } },
            { loader: 'resolve-url-loader', options: { sourceMap: true } },
            // { loader: 'sass-loader', options: { sourceMap: true } }
          ],
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
      minimizer: [
        new UglifyJSPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: { inline: false }
          }
        })
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      ...base.plugins,
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css'
      })
    ],

    // TODO: library-ification?
    // externals: [nodeExternals()]
  };

  return dev;
};
