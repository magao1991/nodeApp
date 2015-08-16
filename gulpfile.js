var gulp = require('gulp'),
	path = require('path'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	del = require('del'),
	Q = require("q"),
	$ = gulpLoadPlugins(),
	bs = require('browser-sync').create(),
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
		dist: rootDir + 'static/js',
		filter: []
	},
	img: {
		src: './src/static/image/**/*.*',
		dist: rootDir + 'static/image',
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
	},
	wrapQ: function(callback) {
		var deferred = Q.defer();
		// do async stuff
		setTimeout(function() {
		    deferred.resolve(callback());
	  	}, 50);
		return deferred.promise;
	}
};

// 模板处理
gulp.task('jade', ['clean'], function() {
	return dealFn.wrapQ(function() {
		gulp.src(paths.jade.src)
		.pipe($.watch(paths.jade.src))
		.pipe($.replace(/(?:src|href).*\.+(?:js|coffee|css|less)+(?:\"|\')/gi, dealFn.replaceExt))
		// .pipe($.rev())
		.pipe(gulp.dest(paths.jade.dist))
		// .pipe($.livereload())
		// .pipe($.rev.manifest())
		// .pipe(gulp.dest(paths.rev.dist + 'jade'));
	});
});

// 样式处理
gulp.task('css', ['jade'], function() {
	return dealFn.wrapQ(function() {
		gulp.src(paths.css.src.concat(paths.css.filter))
		.pipe($.watch(paths.css.src))
		.pipe($.sourcemaps.init())
		.pipe($.less({paths: [paths.css.inc]}))
		.pipe($.minifyCss())
		.pipe($.sourcemaps.write())
		.pipe($.rename({suffix: ".min"}))
		// .pipe($.rev())
		.pipe(gulp.dest(paths.css.dist))
		// .pipe($.livereload())
		// .pipe($.rev.manifest())
		// .pipe(gulp.dest(paths.rev.dist + 'css'));
	});
});

// js处理
gulp.task('js', ['css'], function() {
	return dealFn.wrapQ(function() {
		gulp.src(paths.js.src)
		.pipe($.watch(paths.js.src))
	    .pipe($.sourcemaps.init())
	    .pipe($.if(dealFn.isCoffeeLess, $.coffee({bare: true})))
	    .pipe($.uglify())
	    .pipe($.sourcemaps.write())
	    .pipe($.rename({suffix: ".min"}))
	    // .pipe($.rev())
		.pipe(gulp.dest(paths.js.dist))
		// .pipe($.livereload())
		// .pipe($.rev.manifest())
		// .pipe(gulp.dest(paths.rev.dist + 'js'));
	});
})

// image处理
gulp.task('img', ['js'], function() {
	return dealFn.wrapQ(function() {
		gulp.src(paths.img.src)
		.pipe($.watch(paths.img.src))
		.pipe($.imagemin({
			optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
			progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
	        interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
	        multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
	        svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
	    	use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
		}))
	    // .pipe($.rev())
		.pipe(gulp.dest(paths.img.dist))
		// .pipe($.livereload())
		// .pipe($.rev.manifest())
		// .pipe(gulp.dest(paths.rev.dist + 'img'));
	});
})

//模板文件静态资源路径替换
// gulp.task('rev', ['jade', 'css', 'js', 'img'], function() {
// 	return gulp.src([paths.rev.dist + '**/*.json', paths.dist.src + '**/*.*', '!' + paths.img.dist + '/**/*.*'])
// 		   .pipe($.revCollector())
// 		   .pipe(gulp.dest(paths.dist.src))
// })


//清理所有文件
gulp.task('clean', function(cb) {
	del([paths.dist.src], function(err, paths) {
		console.log('Delete files/folders success~');
	});
	cb();
});

// 清理缓存
gulp.task('cleanCache', function(cb) {
	$.cache.clearAll();
	cb();
});

// 自动F5刷新
gulp.task('browserSync', function(){

	// $.livereload.listen();

	bs.init({
		proxy: config.domain + ':' + config.port,
		files: [paths.dist.src],
		open: false
	})

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
gulp.task('start', ['jade', 'css', 'js', 'img'], function(cb) {
	$.nodemon({
		script: 'app.js'
	});
	cb();
});

//默认任务
gulp.task('default', ['start'], function() {
	gulp.start('browserSync', function() {
		console.log('browserSync success~')
	});
	// gulp.start('rev');
});


