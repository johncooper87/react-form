//@ts-check

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: {
      auto: () => true,
      localIdentContext: path.resolve(__dirname, 'src'),
      localIdentName: '[path][name]__[local]',
      //localIdentName: '[path][name]__[local]--[hash:base64:5]',
    },
  },
};

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
      },

      // {
      //   test: /\.css$/,
      //   use: ['style-loader', cssLoader],
      // },

      // {
      //   test: /\.scss$/,
      //   use: ['style-loader', cssLoader, 'sass-loader'],
      // },

      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, cssLoader],
      },

      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, cssLoader, 'sass-loader'],
      },

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
    path: path.resolve(__dirname, 'dist'),
    //chunkFilename : "[name].[chunkhash].js"
    // chunkFilename: ({ chunk, contentHashType }) => {
    //   console.log(chunk);
    //   return 'asd.js';
    // }
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin(),
  ],

  watch: true,

  // optimization: {
  //   chunkIds: 'named',
  //   moduleIds: 'named',
  //   splitChunks: {
  //     chunks: 'all',
  //     cacheGroups: {
  //       vendor: {
  //         test: /node_modules/,
  //         name: 'vendor'
  //       }
  //     }
  //   }
  // },

  optimization: {
    chunkIds: 'named',
    splitChunks: {
      chunks: 'async',
      //minSize: 20000,
      //minRemainingSize: 0,
      //maxSize: 0,
      //minChunks: 1,
      //maxAsyncRequests: 30,
      //maxInitialRequests: 30,
      //automaticNameDelimiter: '~',
      //enforceSizeThreshold: 50000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        // default: {
        //   minChunks: 2,
        //   priority: -20,
        //   reuseExistingChunk: true
        // }
      }
    }
  },

  devServer: {
    port: 3000,
    historyApiFallback: true
  }
};