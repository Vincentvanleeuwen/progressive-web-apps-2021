const gulp = require('gulp')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

gulp.src([
  "./src/css/*.css"
])
.pipe(concat('index.css'))
.pipe(cleanCSS())
.pipe(autoprefixer({
  cascade: false
}))
.pipe(gulp.dest('./public/css'))
