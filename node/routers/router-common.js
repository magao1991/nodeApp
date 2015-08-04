var express = require('express'),
	router = express.Router();

router.use(function(req, res, next) {
	console.log('%s %s %s', req.method, req.url, req.path);
	next();
});

router.use('/', function (req, res) {
  	res.render('index.jade', { title: 'Hey', message: 'Hello world!'});
})


module.exports = router;