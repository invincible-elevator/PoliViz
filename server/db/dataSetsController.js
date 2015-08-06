var dataSets = require('./dataSets.js');

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
	var data = req.body.data;
	var dataSetName = req.body.dataSetName;
	dataSets.addDataSet(data, dataSetName, function(resp){
		res.send(200, resp);
	});
};


/* function: updateDataSet
 * ----------------------------
 * This function handles requests to update a dataset in the dataSets collection. I have not
 * been able to test this function fully so I'm not sure it works exactly as planned
*/
var updateDataSet = function(req, res, next){
	var data = req.body.data;
	var dataSetName = req.body.dataSetName;
	console.log(data, dataSetName);
	dataSets.updateDataSet(data, dataSetName, function(resp){
		res.send(200, resp);
	});
};

/* function: findDataSet
 * ----------------------------
 * This function handles requests to find one dataset from the dataSets collection.
 * This acts on the second element of the url /dataSet/:dataSetName
*/
var findDataSet = function(req, res, next){
	var dataSetName = req.url.split('/')[2];
	dataSets.findDataSet(dataSetName, function(resp){
		res.send(200, resp);
	});
};

/* function: clearCollection 
 * ----------------------------
 * This function clears out the data from the collection. It should be removed before deployment
*/
var clearCollection = function(req, res, next){
	dataSets.clearCollection(function(resp){
		res.send(200, resp);
	});
};

/* function: removeFromCollection
 * ------------------------------
 * This function removes dataSets from the collection. It acts on 3rd portion
 * of the url /dataSets/clear/:dataSetName. 
*/
var removeFromCollection = function(req,res, next){
	var dataSetName = req.url.split('/')[3];
	dataSets.removeFromCollection(dataSetName, function(resp){
		res.send(200);
	}):
};

module.exports = {
	addDataSet:addDataSet,
	updateDataSet:updateDataSet,
	findDataSet: findDataSet,
	clearCollection:clearCollection,
	removeFromCollection:removeFromCollection
};