var gulp = require('gulp'),
	gutil = require('gulp-util'),
  runSequence = require('run-sequence'),
  notify = require("gulp-notify"),
  plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify  = require('gulp-uglify'),
	minifycss = require('gulp-minify-css'),
	sass = require('gulp-sass'),
  concat = require('gulp-concat'),

	src  = {
    'scss': 'src/scss/*/*.scss',
    'js'  : 'src/js/app*.js',
    'sw'  : 'src/js/sw.js'
  };

gulp.task('default', function() {
  gulp.watch(src.scss, ['scss']);
  gulp.watch(src.js, ['js']);
  gulp.watch(src.sw, ['sw']);
});

gulp.task('build', function() {
  runSequence(
    'scss',
    'js',
    'sw',
    'img',
		'html'
	);
})

gulp.task('html', function() {
  return gulp.src(['src/*.*'])
    .pipe(gulp.dest('dist/'))
    .pipe(notify({ message: 'html task complete!' }))
})

gulp.task('img',function(){
  return gulp.src([
      'src/img/*.+(png|jpg|gif|svg)',
      'src/img/day/*.+(png|jpg|gif|svg)',
      'src/img/night/*.+(png|jpg|gif|svg)'
  ],  {base: 'src/img'}) 
  .pipe(gulp.dest('dist/img/'))
  .pipe(notify({ message: 'img task complete!' }));
});

gulp.task('scss', function(){
  gulp.src([src.scss])
    .pipe(plumber({
      errorHandler: function (err) {
        console.log(err.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('src'))
    .pipe(minifycss())
    .pipe(notify({ message: 'Styles task complete!' }))
});

gulp.task('js', function() {
  gulp.src([src.js])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(uglify())
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('src'))
    .pipe(notify('js task complete'))
});

gulp.task('sw', function() {
  gulp.src([src.sw])
    .pipe(plumber({
      handleError: function (err) {
        console.log(err);
        this.emit('end');
      }
    }))
    .pipe(uglify())
    .pipe(gulp.dest('src'))
    .pipe(notify('sw task complete'))
});