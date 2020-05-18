const gulp = require('gulp');
const rimraf = require('rimraf');
const merge2 = require('merge2');
const argv = require('minimist')(process.argv.slice(2));
const through2 = require('through2');

const stripCode = require('gulp-strip-code');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');

const tsConfig = require('./getTSCommonConfig')();
const getBabelCommonConfig = require('./getBabelCommonConfig');
const replaceLib = require('./replaceLib');

const tsDefaultReporter = ts.reporter.defaultReporter();

const { getProjectPath, getConfig } = require('./utils/projectHelper'); 

const libDir = getProjectPath('lib');
const esDir = getProjectPath('es');

gulp.task('compile-with-es', done => {
  console.log('[Parallel] Compile to es...');
  compile(false).on('finish', done);
});

gulp.task('compile-with-lib', done => {
  console.log('[Parallel] Compile to js...');
  compile().on('finish', done);
});

gulp.task('compile-finalize', done => {
  // Additional process of compile finalize
  const { compile: { finalize } = {} } = getConfig();
  if (finalize) {
    console.log('[Compile] Finalization...');
    finalize();
  }
  done();
});

gulp.task(
  'compile',
  gulp.series(gulp.parallel('compile-with-es', 'compile-with-lib'), 'compile-finalize')
);

function compile(modules) {
  rimraf.sync(modules !== false ? libDir : esDir);
  let error = 0;
  const source = [
    'components/**/*.tsx',
    'components/**/*.ts',
    'typings/**/*.d.ts'
  ];
  // allow jsx file in components/xxx/
  if (tsConfig.allowJs) {
    source.unshift('components/**/*.jsx');
  }

  const tsResult = gulp.src(source).pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e);
        error = 1;
      },
      finish: tsDefaultReporter.finish,
    })
  );

  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1);
    }
  }

  tsResult.on('finish', check);
  tsResult.on('end', check);

  const tsFilesStream = babelify(tsResult.js, modules);
  const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? esDir : libDir));

  return merge2([tsFilesStream, tsd]);
}

function dist(done) {
  rimraf.sync(getProjectPath('dist'));
  process.env.RUN_ENV = 'PRODUCTION';
  const webpackConfig = require(getProjectPath('webpack.config.js'));
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }

    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    });
    console.log(buildInfo);

    // Additional process of dist finalize
    const { dist: { finalize } = {} } = getConfig();
    if (finalize) {
      console.log('[Dist] Finalization...');
      finalize();
    }

    done(0);
  });
}

function babelify(js, modules) {
  const babelConfig = getBabelCommonConfig(modules);
  delete babelConfig.cacheDirectory;

  if (modules === false) {
    babelConfig.plugins.push(replaceLib);
  }

  let stream = js.pipe(babel(babelConfig)).pipe(
    through2.obj(function (file, encoding, next) {
      console.log(file)
      this.push(file.clone());
      if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
        const content = file.contents.toString(encoding);
        if (content.indexOf("'react-native'") !== -1) {
          next();
          return;
        }

        file.contents = Buffer.from(cssInjection(content));
        file.path = file.path.replace(/index\.js/, 'css.js');
        this.push(file);
        next();
      } else {
        next();
      }
    })
  );

  if (modules === false) {
    stream = stream.pipe(
      stripCode({
        start_comment: '@remove-on-es-build-begin',
        end_comment: '@remove-on-es-build-end',
      })
    );
  }
  return stream.pipe(gulp.dest(modules === false ? esDir : libDir));
}