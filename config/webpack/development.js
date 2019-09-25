// Note: You must restart bin/webpack-dev-server for changes to take effect

const webpack = require('webpack')
const merge = require('webpack-merge')
const sharedConfig = require('./shared.js')
const { settings, output } = require('./configuration.js')
const { join, resolve } = require('path')

const entryPath = join(settings.source_path, settings.source_entry_path)

module.exports = merge(sharedConfig, {
  devtool: 'sourcemap',

  stats: {
    errorDetails: true,
  },

  output: {
    pathinfo: true,
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],

  devServer: {
    hot: true,
    clientLogLevel: 'none',
    https: settings.dev_server.https,
    host: settings.dev_server.host,
    port: settings.dev_server.port,
    disableHostCheck: true,
    contentBase: [output.path, join(__dirname, 'config/locales/rosetta')],
    publicPath: output.publicPath,
    compress: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
})
