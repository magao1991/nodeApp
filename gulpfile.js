var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins(),
	port = 35792;

var paths = {
	css: {
		src: ['./src/css/**/*.less'],
		inc: './src/css/includes',
		dist: './dist/css',
		filter: ['!./src/css/includes/*.less']
	},
	scripts: {
		src: './src/js/**/*.js',
		dist: './dist/js',
		filter: []
	},
	images: {
		src: './src/images/**/*',
		dist: './dist/images',
		filter: []
	}
}

// 样式处理
gulp.task('less', ['clean'], function() {
	// var lessFilter = plugins.filter(paths.css.filter);
	return 	gulp.src(paths.css.src.concat(paths.css.filter))
			// .pipe(lessFilter)
			// .pipe(lessFilter.restore())
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.less({paths: [paths.css.inc]}))
			.pipe(plugins.minifyCss())
			.pipe(plugins.sourcemaps.write())
			.pipe(plugins.rename({suffix: ".min"}))
			.pipe(gulp.dest(paths.css.dist));
});

//清理文件
gulp.task('clean', function() {
	return 	gulp.src([paths.css.dist], {read: false})
			.pipe(plugins.clean());
});

//默认任务
gulp.task('default', ['clean', 'less'], function() {
	console.log('suc');
})