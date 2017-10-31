/* eslint-disable no-var */
var path = require('path')
var webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version)
    })
  ],
  module: {
    preLoaders: [{
      test: /\.js$/,
      loader: 'eslint',
      include: path.resolve(__dirname, 'src')
    }],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, './node_modules'),
          path.resolve(__dirname, './samples')]
      }
    ],
    eslint: {
      configFile: path.resolve(__dirname,'./.eslintrc.js'),
      failOnWarning: true, // eslint报warning了就终止webpack编译
      failOnError: true, // eslint报error了就终止webpack编译
      cache: true, // 开启eslint的cache，cache存在node_modules/.cache目录里
    }
  },
  resolve: {
    root: path.resolve(__dirname, 'src'),
    extensions: ['', '.js']
  },
  devtool: 'source-map'
}
