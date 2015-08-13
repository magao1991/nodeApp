var express = require('express'),
	path = require('path'),
	jade = require('jade'),
	ejs = require('ejs'),
	util = require('util'),
	router = require('./node/routers/router-common.js'),
	config = require('./app-config.js'),
	app = express();

app.set('env', config.debug ? 'development' : 'production');
app.set('port', config.port || 3000);
app.set('rootDir', config.rootDir);

app.set('views', path.join(__dirname , app.get('rootDir'), 'views'));
app.set('view engine', 'jade');

app.engine('jade', jade.__express);
// app.engine('html', ejs.renderFile);

app.use('/css', express.static(path.join(__dirname, app.get('rootDir'), 'static/css')));
app.use('/js', express.static(path.join(__dirname, app.get('rootDir'), 'static/js')));
app.use('/img', express.static(path.join(__dirname, app.get('rootDir'), 'static/image')));
app.use('/', router);

var server = app.listen(app.get('port'), function() {
	console.log('listening on port %s %d', app.get('env'), server.address().port);
});

// node进程内存使用情况
console.log(util.inspect(process.memoryUsage()));
