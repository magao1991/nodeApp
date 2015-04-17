var express = require('express'),
	path = require('path'),
	app = express();

app.set('views', path.join(__dirname , 'views'));

app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

app.get('/', function (req, res) {
  	res.render('jade/index', { title: 'Hey', message: 'Hello there!'});
})

var server = app.listen(3000, function() {
	console.log('listening on port %d', server.address().port);
});

