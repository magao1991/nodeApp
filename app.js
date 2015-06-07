var express = require('express'),
	path = require('path'),
	jade = require('jade'),
	app = express();

app.set('views', path.join(__dirname , 'src/views'));

// app.set('view engine', 'jade');
app.engine('jade', jade.__express);
app.engine('html', require('ejs').renderFile);

app.get(/\/jade\/*/, function (req, res) {
  	res.render('jade/index.jade', { title: 'Hey', message: 'Hello world!'});
})
app.get(/\/ejs\/*/, function (req, res) {
  	res.render('ejs/index.html', { title: 'Hey', message: 'Hello world!'});
})

var server = app.listen(3000, function() {
	console.log('listening on port %d', server.address().port);
});

