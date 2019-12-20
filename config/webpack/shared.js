// Note: You must restart bin/webpack-dev-server for changes to take effect

/* eslint global-require: 0 */
/* eslint import/no-dynamic-require: 0 */

const webpack = require('webpack')
const { join, resolve } = require('path')
const { sync } = require('glob')
const ManifestPlugin = require('webpack-manifest-plugin')
const extname = require('path-complete-extname')
const { env, settings, output, loadersDir } = require('./configuration.js')

const RosettaI18nextPlugin = require('../locales/rosetta/rosetta-i18next-plugin')

const entryPath = join(settings.source_path, settings.source_entry_path)

console.log('WEBPACK RULES', sync(join(loadersDir, '*.js')).map(loader => require(loader)))

module.exports = {
  entry: resolve(entryPath, 'index.js'),

  output: {
    filename: 'portal.js',
    path: output.path,
    publicPath: output.publicPath,
  },

  module: {
    rules: sync(join(loadersDir, '*.js')).map(loader => require(loader)),
  },

  plugins: [
    new webpack.EnvironmentPlugin(JSON.parse(JSON.stringify(env))),
    new ManifestPlugin({
      publicPath: output.publicPath,
      writeToFileEmit: true,
    }),
    new RosettaI18nextPlugin({ options: true }),
  ],

  resolve: {
    extensions: settings.extensions,
    modules: [resolve(settings.source_path), 'node_modules'],
  },

  resolveLoader: {
    modules: ['node_modules'],
  },
}
