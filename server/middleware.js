var morgan = require('morgan');
var bodyParser = require('body-parser');
var databaseController = require('./db/Mongo/databaseController.js');
var SQLController = require('./db/SQL/SQLController.js')

module.exports = function(app, express){

	//This section handles the basic middleware
	app.use(morgan('dev')); // Console logs the incoming requests 
	app.use(bodyParser.json()); // Allows the body to be accessed
	app.use(bodyParser.urlencoded({extended: true})); //Allows the URL to be accessed


	//Serves the public directory to the user
	app.use(express.static(__dirname + '/../public'));

	//Database Requests for dataSets
	app.get('/dataSets/:name', databaseController.findDataSet);
	app.post('/dataSets', databaseController.addDataSet);
	app.post('/dataSets/clear', databaseController.clearCollection);
	app.post('/dataSets/:name', databaseController.updateDataSet);


	//Database Request for politicians 
	app.get('/politicians/:name', databaseController.findDataSet);
	app.post('/politicians', databaseController.addDataSet);
	app.post('/politicians/clear', databaseController.clearCollection);
	app.post('/politicians/:name', databaseController.updateDataSet);

};