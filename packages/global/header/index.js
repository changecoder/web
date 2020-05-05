import Header from './src'

module.exports = Object.assign(
  require('./module'),
  {
    widget: Header,
    preload: null,
    params: null
  }
)