var gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins(),
	port = 35792;

var paths = {
	css: {
		src: './src/less/**/*.less',
		dest: './dist/css',
		inc: './src/less/includes',
		filter: []
	},
	scripts: {
		src: './src/less',
		dest: './dist/css'
		filter: []
	},
	images: {
		src: './src/less',
		dest: './dist/css'
		filter: []
	}
}

// 样式处理
gulp.task('less', function() {
	gulp.src(path.css.src).pipe(plugins.less({
		paths: [paths.css.inc],
		plugins: []
	}))
})