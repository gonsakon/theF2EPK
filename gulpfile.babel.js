import gulp from 'gulp';
import jade from 'gulp-jade';
import watch from 'gulp-watch';
import compass from 'gulp-compass';
import plumber from 'gulp-plumber';
import webserver from 'gulp-webserver';
import concat from 'gulp-concat';
import babel from 'gulp-babel';
import es2015 from 'babel-preset-es2015';
import ghPages from 'gulp-gh-pages';
import path from 'path';

const paths = {
  source: './source',
  dist: './dist',
  cssdir: './dist/css',
  sassdir: './source/sass'
};

gulp.task('deploy', () => gulp.src('./dist/**/*')
  .pipe(ghPages()));

gulp.task('compass', () => {
  gulp.src([`${paths.sassdir}/**/*.scss`, `${paths.sassdir}/**/*.sass`])
    .pipe(plumber())
    .pipe(compass({
      config_file: 'config.rb',
      sourcemap: true,
      css: './dist/css',
      sass: './source/sass'
    }))
    .pipe(gulp.dest(paths.cssdir));
});

watch([`${paths.sassdir}/**/*.scss`, `${paths.sassdir}/**/*.sass`], () => {
  gulp.start('compass');
});


gulp.task('templates', () => {
  const YOUR_LOCALS = {};

  gulp.src([`${paths.source}/partial/*.jade`])
    .pipe(plumber())
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(`${paths.dist}/partial/`));

  gulp.src([`${paths.source}/*.jade`])
    .pipe(plumber())
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest(paths.dist));
});

watch([`${paths.source}/*.jade`, `${paths.source}/partial/*.jade`], () => {
  gulp.start('templates');
});


gulp.task('webserver', () => {
  gulp.src('./dist/')
    .pipe(webserver({
      livereload: true,
      open: false,
      host: '0.0.0.0',
      port: 12222,
    }));
});
gulp.task('scripts', () => {
  gulp.src([`${paths.source}js/*.js`])
    .pipe(concat('all-min.js'))
    .pipe(babel({
      presets: [es2015]
    }))
    .pipe(gulp.dest(`${paths.dist}/js/`));
});
watch([`${paths.source}/js/*.js`], () => {
  gulp.start(['scripts']);
});
gulp.task('default', ['compass', 'templates', 'webserver', 'scripts']);
