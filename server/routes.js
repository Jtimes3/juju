module.exports = function (app) {
	app.get('/', function (req, res) {
		
	});
	app.get('*', function (req, res) {
		res.redirct('/');
	});
};
