var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	$ = gulpLoadPlugins(),
	pngquant = require('imagemin-pngquant'),
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
		src: ['./src/static/css/**/*.+(less|css)'],
		inc: './src/static/css/includes',
		dist: rootDir + 'static/css',
		filter: ['!./src/static/css/includes/*.less']
	},
	js: {
		src: './src/static/js/**/*.+(js|coffee)',
		dist: rootDir + '/static/js',
		filter: []
	},
	img: {
		src: './src/static/image/**/*.+(png|jepg|jpg|gif|svg)',
		dist: rootDir + '/static/image',
		filter: []
	}
}

var dealFn = {
	isCoffeeLess: function(file) {
		return $.match(file, /.*\.(coffee|less)$/);
	},
	replaceExt: function(str){ 
					var index = str.lastIndexOf('.'),
						ext = str.substring(index + 1, str.length - 1),
						reg = /(^(?:src|href).*)(\.+(?:js|coffee|css|less)+)+(\"|\')$/gi;
					switch(ext) {
						case 'css':
							return str.replace(reg, "$1.min.css$3");
						break;
						case 'less':
							return str.replace(reg, "$1.min.css$3");
						break;
						case 'js':
							return str.replace(reg, "$1.min.js$3");
						break;
						case 'coffee':
							return str.replace(reg, "$1.min.js$3");
						break;
					}
				}
};

// 模板处理
gulp.task('jade', function() {
	return  gulp.src(paths.jade.src)
			.pipe($.watch(paths.jade.src))
			.pipe($.replace(/(?:src|href).*\.+(?:js|coffee|css|less)+(?:\"|\')/gi, dealFn.replaceExt))
			// .pipe($.rev())
    		.pipe(gulp.dest(paths.jade.dist))
    		.pipe($.livereload())
    		// .pipe($.rev.manifest())
			// .pipe(gulp.dest(paths.rev.dist + 'jade'));
});


// 样式处理
gulp.task('css', function() {
	return 	gulp.src(paths.css.src.concat(paths.css.filter))
			.pipe($.watch(paths.css.src))
			.pipe($.sourcemaps.init())
			.pipe($.less({paths: [paths.css.inc]}))
			.pipe($.minifyCss())
			.pipe($.sourcemaps.write())
			.pipe($.rename({suffix: ".min"}))
			// .pipe($.rev())
			.pipe(gulp.dest(paths.css.dist))
			.pipe($.livereload())
			// .pipe($.rev.manifest())
			// .pipe(gulp.dest(paths.rev.dist + 'css'));
});

// js处理
gulp.task('js', function() {
	return  gulp.src(paths.js.src)
			.pipe($.watch(paths.js.src))
		    .pipe($.sourcemaps.init())
		    .pipe($.if(dealFn.isCoffeeLess, $.coffee({bare: true})))
		    .pipe($.uglify())
		    .pipe($.sourcemaps.write())
		    .pipe($.rename({suffix: ".min"}))
		    // .pipe($.rev())
			.pipe(gulp.dest(paths.js.dist))
			.pipe($.livereload())
			// .pipe($.rev.manifest())
			// .pipe(gulp.dest(paths.rev.dist + 'js'));
})

// image处理
gulp.task('img', function() {
	return  gulp.src(paths.img.src)
			.pipe($.watch(paths.img.src))
			.pipe($.imagemin({
				progressive: true,
	            svgoPlugins: [{removeViewBox: false}],
	            use: [pngquant()]
			}))
		    // .pipe($.rev())
			.pipe(gulp.dest(paths.img.dist))
			.pipe($.livereload())
			// .pipe($.rev.manifest())
			// .pipe(gulp.dest(paths.rev.dist + 'img'));
})

//模板文件静态资源路径替换
// gulp.task('rev', ['jade', 'css', 'js', 'img'], function() {
// 	return gulp.src([paths.rev.dist + '**/*.json', paths.dist.src + '**/*.*', '!' + paths.img.dist + '/**/*.*'])
// 		   .pipe($.revCollector())
// 		   .pipe(gulp.dest(paths.dist.src))
// })


//清理所有文件
gulp.task('clean', function() {
	return 	gulp.src([paths.dist.src], {read: false})//read：不读取文件加快程序
			.pipe($.clean());
});

// 监听任务 运行语句 gulp watch
gulp.task('watch', function(){

	$.livereload.listen();


	// gulp.watch('./src/**/*.*', ['rev']);

	// gulp.watch(paths.jade.src, ['jade']).on('change', function(event) {
	// 	console.log('Event type: ' + event.type); 
 //   		console.log('Event path: ' + event.path); 
	// });
	// gulp.watch(paths.css.src, ['css']);
	// gulp.watch(paths.js.src, ['js']);
	// gulp.watch(paths.img.src, ['img']);


});

// 启动app
gulp.task('start', function() {
	$.nodemon({
		script: 'app.js'
	})
});

//默认任务
gulp.task('default', ['watch', 'clean'], function() {
	gulp.start('jade', 'css', 'js', 'img', 'start');
	// gulp.start('rev');
	console.log('gulp suc');
});


