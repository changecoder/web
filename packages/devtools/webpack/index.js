const paths = require('../paths')
const isProd = process.env.NODE_ENV === 'production'
const plugins = require('./plugins')
const rules = require('./rules')

module.exports = {
  entry: paths.appClientJs,
  output: {
    filename: `changecoder.${paths.packageName}.js`,
    path: paths.appBuild,
    libraryTarget: 'window'
  },
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'hidden-source-map' : 'source-map',
  module: {
    rules
  },
  plugins
}