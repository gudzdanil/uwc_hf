var gulp = require('gulp'),
	watch = require('gulp-watch'),
	stylus = require('gulp-stylus'),
	dookie = require('dookie-css'),
	concat = require('gulp-concat'),
	minifyCSS = require('gulp-minify-css'),
	connect = require('gulp-connect'),
	fileinclude = require('gulp-file-include'),
	nib= require('nib'),
	rupture = require('rupture'),
	spritesmith = require('gulp.spritesmith');

gulp.task('stylus', function () {
	gulp
		.src('./stylus/*.styl')
		.pipe(stylus({
			use: [dookie.css(), nib(), rupture()]
		}))
		.pipe(connect.reload())
		.pipe(gulp.dest('./css'));
});


gulp.task('watch', function () {
	gulp.watch('./stylus/**/*.styl', ['stylus', 'cssbuild']);
	gulp.watch('./html/**/*.html', ['html']);
});

gulp.task('html', function() {
	gulp.src('./html/*.html')
		.pipe(fileinclude({
			prefix: '@@'
		}))
		.pipe(gulp.dest('./'));
});

gulp.task('cssbuild', function () {

	gulp
		.src('./css/*.css')
			.pipe(concat('main.css'))
			.pipe(minifyCSS())
		.pipe(gulp.dest('./build/'));
});

gulp.task('connect', function () {
	connect.server({
		livereload: true
	});
});

gulp.task('spritesmith', function () {
	var sprites = gulp.src('images/icons/**/*.png')
		.pipe(spritesmith({
		cssFormat: 'stylus',
		imgName: 'sprites.png',
		cssName: 'index.styl',
		imgPath: '../images/sprites.png',
		cssVarMap: function(sprite) {
		    sprite.name = 'i-' + sprite.name
		}
	}));

	sprites.img.pipe(gulp.dest('./images/'));
	sprites.css.pipe(gulp.dest('./stylus/sprites/'));
});

gulp.task('default', ['stylus', 'watch', 'cssbuild']);