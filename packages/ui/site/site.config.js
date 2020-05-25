const { resolve } = require('path')
const siteDir = process.cwd()

module.exports = {
  resolve: {
    alias: {
      'ccui': resolve(siteDir, 'components'),
      'ccui/es': resolve(siteDir, 'es'),
    }
  }
}