const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production', // or 'development'
  entry: './src/server.ts',
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'public')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  target: 'node',
  plugins: [
    new webpack.ContextReplacementPlugin(
      /express\/lib/,
      path.resolve(__dirname, 'src')
    )
  ]
};