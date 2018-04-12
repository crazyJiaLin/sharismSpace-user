const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => ({
  entry: {
    vendor: './src/vendor',
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name]-personal.js' : '[name]-personal.js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
    // publicPath: '/'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
    // ,
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }, 
    //   sourceMap: false
    // })
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.js'
    }
  },
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: {
      '/api/': {
        target: 'localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
