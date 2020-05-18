const { resolve: resolvePath } = require('path');
const cwd = process.cwd();

function getProjectPath(...filePath) {
  return resolvePath(cwd, ...filePath);
}

function resolve(moduleName) {
  return require.resolve(moduleName);
}

function getConfig() {
  const configPath = getProjectPath('.antd-tools.config.js');
  if (fs.existsSync(configPath)) {
    return require(configPath);
  }

  return {};
}

module.exports = {
  getProjectPath,
  resolve,
  getConfig
};