var database = require('./databaseInteractor.js');
var request = require('request');
var dbFilter = require('./databaseFilter.js')

/* --------------------------------------------
 * dataSetsController.js
 * --------------------------------------------
 * This is the controller which creates all the middleware
 * needed deal with the dataSets collection. This is meant 
 * deal with taking the requests and generating a response.
 * -------------------------------------------------
*/  

/* function: addDataSet
 * ----------------------------
 * This function handles requests to add a dataset to the dataSets collection.
*/
var addDataSet = function(req, res, next){
	var collectionName = req.url.split('/')[1];
	var data = req.body.data;
	var name = req.body.name;
	database.addDataSet(collectionName, data, name, function(resp){
		res.send(200, resp);
	});
};


/* function: updateDataSet
 * ----------------------------
 * This function handles requests to update a dataset in the dataSets collection. I have not
 * been able to test this function fully so I'm not sure it works exactly as planned
*/
var updateDataSet = function(req, res, next){
	var collectionName = req.url.split('/')[1];
	var data = req.body.data;
	var name = req.body.name;
	database.updateDataSet(collectionName, data, name, function(resp){
		res.send(200, resp);
	});
};

/* function: findDataSet
 * ----------------------------
 * This function handles requests to find one dataset from the dataSets collection.
 * This acts on the second element of the url /dataSet/:name
*/
var findDataSet = function(req, res, next){
	var collectionName = req.url.split('/')[1];
	var name = req.url.split('/')[2];
	var firstName = name.split('_')[0];
	var lastName = name.split('_')[1];
	dbFilter.databaseFilter(collectionName, name, firstName, lastName, req, res);
};

/* function: clearCollection 
 * ----------------------------
 * This function clears out the data from the collection. It should be removed before deployment
*/
var clearCollection = function(req, res, next){
	var collectionName = req.url.split('/')[1];
	database.clearCollection(collectionName, function(resp){
		res.send(200, resp);
	});
};

/* function: removeFromCollection
 * ------------------------------
 * This function removes dataSets from the collection. It acts on 3rd portion
 * of the url /dataSets/clear/:name. 
*/
var removeFromCollection = function(req,res, next){
	var collectionName = req.url.split('/')[1];
	var name = req.url.split('/')[3];
	database.removeFromCollection(collectionName, name, function(resp){
		res.send(200);
	});
};

module.exports = {
	addDataSet:addDataSet,
	updateDataSet:updateDataSet,
	findDataSet: findDataSet,
	clearCollection:clearCollection,
	removeFromCollection:removeFromCollection
};