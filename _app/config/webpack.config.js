const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '../deploy/dist');
const NOTEBOOK_DIR = path.join(process.cwd(), '../book');

module.exports = {
  entry: path.resolve(__dirname, '../src/main.js'),
  output: {
    filename: '[name].js',
    path: OUTPUT_DIR,
    clean: true,
  },
  devtool: 'eval-source-map', // 开发环境调试时浏览器展示源码
  devServer: {
    static: NOTEBOOK_DIR,
    port: 7777,
  },
  performance: {
    maxEntrypointSize: 1024 * 1024 * 100,
    maxAssetSize: 1024 * 1024 * 100
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'), // 指向模板文件
    }),
    new CopyPlugin({
      patterns: [
        {
          from: NOTEBOOK_DIR,
          to: OUTPUT_DIR,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
};
