const fs = require('fs')
const { resolve } = require('path')

const babel = require('@babel/core')

const paths = require('../paths')
const rootPath = resolve(paths.rootDir, 'src')
const outputPath = resolve(paths.rootDir, 'libs/src')

const transformPath = (absolutePath) => {
  const filePath = absolutePath.replace(rootPath, 'src')
  const arr = filePath.split('\\')
  return arr.reduce((a, b) => `../${a}`, filePath)
}

function transformFile (filePath, filename, outputPath) {
  const source = fs.readFileSync(filePath, "utf8");
  const { code, map } = babel.transformSync(source, {
    sourceMaps: true,
    sourceFileName: transformPath(filePath),
    configFile: resolve(__dirname, '../babel/babel.config.json')
  });
  fs.writeFileSync(outputPath, `${code}//# sourceMappingURL=${filename}.map `, 'utf-8')
  fs.writeFileSync(`${outputPath}.map`, JSON.stringify({...map, file: filename}), 'utf-8')
}

function transformFilePath (dir, outPath) {
  fs.exists(outPath, function(exist) {
    if (!exist) {
      fs.mkdir(outPath, function(err) {
        if (err) {
          console.log(err)
        }
      })
    }
  })

  fs.readdir(dir, function(err, files) {
    files.forEach(file => {
      const newPath = resolve(dir, file)
      const newOutPath = resolve(outPath, file)
      fs.stat(newPath, function(error, stats) {
        if (stats.isDirectory()) {
          transformFilePath(newPath, newOutPath)
        } else {
          transformFile(newPath, file, newOutPath)
        }
      });
    });
  });
};

fs.mkdir(resolve(paths.rootDir, 'libs'), function(err) {
  if (err) {
    console.log(err)
  }
})

transformFilePath(rootPath, outputPath)