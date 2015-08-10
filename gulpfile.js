var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	plugins = gulpLoadPlugins(),
	config = require('./app-config.js'),
	port = 35792;

var rootDir = config.rootDir;	

var paths = {
	dist: {
		src: rootDir
	},
	rev: {
		dist: rootDir + 'rev/'
	},
	jade: {
		src: ['./src/views/**/*.*'],
		dist: rootDir + 'views'
	},
	css: {
		src: ['./src/static/css/**/*.less'],
		inc: './src/static/css/includes',
		dist: rootDir + 'static/css',
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
    		.pipe(gulp.dest(paths.jade.dist));
});

// 样式处理
gulp.task('css', function() {
	// var lessFilter = plugins.filter(paths.css.filter);
	return 	gulp.src(paths.css.src.concat(paths.css.filter))
			// .pipe(lessFilter)
			// .pipe(lessFilter.restore())
			.pipe(plugins.sourcemaps.init())
			.pipe(plugins.less({paths: [paths.css.inc]}))
			.pipe(plugins.minifyCss())
			.pipe(plugins.sourcemaps.write())
			.pipe(plugins.rename({suffix: ".min"}))
			.pipe(plugins.rev())
			.pipe(gulp.dest(paths.css.dist))
			.pipe(plugins.rev.manifest())
			.pipe(gulp.dest(paths.rev.dist + 'css'));
});

//模板文件静态资源路径替换
gulp.task('rev', ['jade', 'css'], function() {
	console.log(paths.rev.dist + '**/*.json');
	console.log(paths.jade.dist + '/**/*.jade');
	return gulp.src([paths.rev.dist + '**/*.json', paths.jade.dist + '/**/*.jade'])
		   .pipe(plugins.revCollector())
		   .pipe(gulp.dest(paths.jade.dist))
		   .pipe(plugins.livereload())
})

//清理所有文件
gulp.task('clean', function() {
	return 	gulp.src([paths.dist.src], {read: false})//read：不读取文件加快程序
			.pipe(plugins.clean());
});

// 监听任务 运行语句 gulp watch
gulp.task('watch', function(){

	plugins.livereload.listen();
	gulp.watch('./src/**/*.*', ['rev']);

 //    // 监听jade
	// gulp.watch(paths.jade.src, ['jade']);

 //    // 监听less
 //    gulp.watch(paths.css.src, ['css']);

});

// 启动app
gulp.task('start', function() {
	plugins.nodemon({
		script: 'app.js'
	})
});

//默认任务
gulp.task('default', ['watch', 'clean'], function() {
	gulp.start('rev', 'start');
	console.log('gulp suc');
});


