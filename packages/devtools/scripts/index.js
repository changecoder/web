const webpack = require('webpack')

const webpackConfig = require('../webpack')

const execWebpack = (config) => {
  const compiler = webpack(config)

  compiler.run((err, stats) => { 
    if (err) {
      console.log(err)
      return 
    }
  
    const { errors, warnings } = stats.compilation
    
    if (errors.length > 0) {
      console.log(errors)
    }
  
    if (warnings.length > 0) {
      console.log(warnings)
    }
  })

}

const buildClient = () => {
  execWebpack(webpackConfig)
}

module.exports = {
  buildClient
}