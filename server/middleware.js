var morgan 							= require('morgan'),
    bodyParser 					= require('body-parser'),
 		databaseController  = require('./db/Mongo/databaseController.js'),
		SQLController 			= require('./db/SQL/SQLController.js');

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

	//Database Request for committee contributions and individual candidates
	app.get('/campaignContributions', SQLController.getSummaryData);
	app.post('/indCandidateData', SQLController.getSummaryDataByName);

	// Database Request for committee information 
	app.get('/contributors', SQLController.getContributors);
	app.get('/contributors/:id', SQLController.getContributorData);

	// Databse Request for candidate information
	app.get('/candidates', SQLController.getCandidates);
	app.get('/candidates/:id', SQLController.getCandidateData);

};