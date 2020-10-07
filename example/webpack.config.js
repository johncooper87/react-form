const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  mode: 'development',
  devtool: 'source-map',
  target: 'web',

  entry: './src/index.tsx',

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: path.resolve(__dirname, './src'),
        use: 'ts-loader'
      }
    ]
  },

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    }
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],

  watch: true,

  optimization: {
    chunkIds: 'named',
    moduleIds: 'named',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor'
        }
      }
    }
  },

  devServer: {
    port: 3000,
    historyApiFallback: true
  }
};