var morgan = require('morgan');
var bodyParser = require('body-parser');
var dataSets = require('./db/dataSetsController.js');

module.exports = function(app, express){

	//This section handles the basic middleware
	app.use(morgan('dev')); // Console logs the incoming requests 
	app.use(bodyParser.json()); // Allows the body to be accessed
	app.use(bodyParser.urlencoded({extended: true})); //Allows the URL to be accessed


	//Serves the public directory to the user
	app.use(express.static(__dirname + '/../public'));

	//Database Requests for dataSets
	app.get('/dataSets/:name', dataSets.findDataSet);
	app.post('/dataSets', dataSets.addDataSet);
	app.post('/dataSets/clear', dataSets.clearCollection);
	app.post('/dataSets/:name', dataSets.updateDataSet);


	//Database Request for politicians 
	app.get('/dataSets/:name', dataSets.findDataSet);
	app.post('/dataSets', dataSets.addDataSet);
	app.post('/dataSets/clear', dataSets.clearCollection);
	app.post('/dataSets/:name', dataSets.updateDataSet);

};