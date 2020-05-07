const fs = require('fs')

const { resolve } = require('path')

const appDirectory = fs.realpathSync(process.cwd())

const resolveApp = relativePath => resolve(appDirectory, relativePath)

const modulePackage = require(resolve(appDirectory, 'package.json'))

module.exports = {
  appIndexJs: resolveApp('src/index.js'),
  appClientJs: resolveApp('client.js'),
  appBuild: resolveApp('libs'),
  rootDir: appDirectory,
  packageName: modulePackage.name.split('/')[1]
}