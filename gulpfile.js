var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins(),
	port = 35792;

var paths = {
	jade: {
		src: ['./src/views/**/*.*'],
		dist: './dist/views'
	},
	css: {
		src: ['./src/static/css/**/*.less'],
		inc: './src/static/css/includes',
		dist: './dist/static/css',
		filter: ['!./src/static/css/includes/*.less']
	},
	scripts: {
		src: './src/static/js/**/*.js',
		dist: './dist/static/js',
		filter: []
	},
	images: {
		src: './src/images/**/*',
		dist: './dist/images',
		filter: []
	}
}

// 模板处理
gulp.task('jade', function() {
	return  gulp.src(paths.jade.src)
    		.pipe(gulp.dest(paths.jade.dist)).pipe(plugins.livereload());
});

// 样式处理
gulp.task('less', function() {
	// var lessFilter = plugins.filter(paths.css.filter);
	return 	gulp.src(paths.css.src.concat(paths.css.filter))
			// .pipe(lessFilter)
			// .pipe(lessFilter.restore())
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.less({paths: [paths.css.inc]}))
			.pipe(plugins.minifyCss())
			.pipe(plugins.sourcemaps.write())
			.pipe(plugins.rename({suffix: ".min"}))
			.pipe(gulp.dest(paths.css.dist)).pipe(plugins.livereload());
});

// 模板处理
gulp.task('jadeclean', ['clean'], function() {
	return  gulp.src(paths.jade.src)
    		.pipe(gulp.dest(paths.jade.dist)).pipe(plugins.livereload());
});

// 样式处理
gulp.task('lessclean', ['clean'], function() {
	// var lessFilter = plugins.filter(paths.css.filter);
	return 	gulp.src(paths.css.src.concat(paths.css.filter))
			// .pipe(lessFilter)
			// .pipe(lessFilter.restore())
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.less({paths: [paths.css.inc]}))
			.pipe(plugins.minifyCss())
			.pipe(plugins.sourcemaps.write())
			.pipe(plugins.rename({suffix: ".min"}))
			.pipe(gulp.dest(paths.css.dist)).pipe(plugins.livereload());
});

//清理文件
gulp.task('clean', function() {
	return 	gulp.src([paths.css.dist, paths.jade.dist], {read: false})
			.pipe(plugins.clean());
});

// 监听任务 运行语句 gulp watch
gulp.task('watch', ['clean'], function(){

	plugins.livereload.listen();

    // 监听jade
    // gulp.watch(paths.jade.src, function(event){
    //     gulp.run('jade');
    // })
	gulp.watch(paths.jade.src, ['jade']);

    // 监听less
    gulp.watch(paths.css.src, ['less']);

});

//默认任务
gulp.task('default', ['clean', 'jadeclean', 'lessclean', 'watch'], function() {
	console.log('suc');
});


