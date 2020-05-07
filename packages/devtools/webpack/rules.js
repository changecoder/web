const babelConfig = require('../babel/.babelrc')

const jsRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: babelConfig
  }
}

module.exports = [
  jsRule
]