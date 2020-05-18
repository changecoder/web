const fs = require('fs')
const { resolve } = require('path')

function finalizeCompile() {
  if (fs.existsSync(resolve(__dirname, './lib'))) {
    // Build a entry less file to dist/antd.less
    const componentsPath = resolve(process.cwd(), 'components')
    let componentsLessContent = ''
    // Build components in one file: lib/style/components.less
    fs.readdir(componentsPath, (err, files) => {
      files.forEach(file => {
        if (fs.existsSync(resolve(componentsPath, file, 'style', 'index.less'))) {
          componentsLessContent += `@import "../${resolve(file, 'style', 'index.less')}";\n`
        }
      })
      fs.writeFileSync(
        resolve(process.cwd(), 'lib', 'style', 'components.less'),
        componentsLessContent
      )
    })
  }
}

function finalizeDist() {
  if (fs.existsSync(resolve(__dirname, './dist'))) {
    // Build less entry file: dist/antd.less
    fs.writeFileSync(
      resolve(process.cwd(), 'dist', 'ccui.less'),
      '@import "../lib/style/index.less";\n@import "../lib/style/components.less";',
    )
  }
}

module.exports = {
  compile: {
    finalize: finalizeCompile
  },
  dist: {
    finalize: finalizeDist
  }
}