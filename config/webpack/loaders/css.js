const { env } = require('../configuration.js')

module.exports = {
  test: /\.css$/i,
  use: [
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        modules: true,
        importLoaders: 1,
      },
    },
    { loader: 'postcss-loader', options: { sourceMap: true } },
  ],
  exclude: /react-big-calendar|react-table/,
}
