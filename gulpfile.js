var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins(),
	port = 35792;

var paths = {
	css: {
		src: './src/css/**/*.less',
		inc: './src/css/includes',
		dist: './dist/css',
		filter: []
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
gulp.task('less', function() {
	return gulp.src(paths.css.src).pipe(plugins.less({
		paths: [paths.css.inc]
	})).pipe(gulp.dest(paths.css.dist));
});

//清理文件
gulp.task('clean', function() {
	return gulp.src([paths.css.dist], {read: false}).pipe(plugins.clean());
});

//默认任务
gulp.task('default', ['clean', 'less'], function() {
	console.log('suc');
})