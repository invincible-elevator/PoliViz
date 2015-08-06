var monk = require('monk');
var db = monk(process.env.CUSTOMCONNSTR_MONGOLAB_URI||'localhost/db');
var dataSets = db.get('dataSets');


/* ----------------------------------------------------
 * dataSets.js
 * ----------------------------------------------------
 *	This file interacts with the mongoDB dataSets collection.
 *  It is meant to abstract away all the basic functions that
 *  might need to be used to interact with the database. 
 *-----------------------------------------------------
 */




/* function: addDataSet
 * --------------------
 * This function takes in a data set, a name for it, and a callback. It then stores
 * the data in the dataSets collection using that name as a reference. Later I might modify
 * it so that the dataSetName is actually indexed for faster lookup time
*/
var addDataSet = function(data, dataSetName , callback){
	dataSets.insert({dataSetName: dataSetName, data: data}, function(err, resp){
		if(err){
			callback(false);
		} else {
			callback(true);
		}
	});	
};

/* function: updateDataSet
 * -----------------------
 * This function allows for the updating of an entry in the collection. It requires the new data, 
 * the data set name, and a callback which is called once the item has been updated. 
*/
var updateDataSet = function(data, dataSetName, callback){
	dataSets.update({dataSet: dataSetName}, {dataSetName: dataSetName, data: data}, function(err, resp){
		callback(resp);
	});
};


/* function: findDataSet 
 * ---------------------
 * This function takes in the name of the dataset and a callback. It then finds the item in the
 * database and calls the callback on the data given as a response. 
*/
var findDataSet = function(dataSetName, callback){
	dataSets.find({dataSetName: dataSetName}, function (err, resp){
		callback(resp);
	});
};

/* function: clearCollection
 * -------------------------
 * This function will allow the dataSet collection to be cleared. It will mainly be used
 * in development and should be removed before it is released. 
*/
var clearCollection = function(callback){
	dataSets.remove({}, function(err, resp){
		callback(resp);
	});
};

/* function: removeFromCollection
 * ------------------------------
 * This function removes an item designated by the dataSetName from the collection
 * and calls the callback upon completion
*/
var removeFromCollection = function(dataSetName, callback){
	dataSets.remove({dataSetName:dataSetName}, function(err, resp){
		callback(resp);	
	});
};

/*Exports section
 *----------------
 * This section exports the functions from the module to  
 * allow them to be accessed. 
*/
module.exports = {
	findDataSet: findDataSet,
	clearCollection: clearCollection,
	addDataSet: addDataSet,
	updateDataSet:updateDataSet,
	removeFromCollection: removeFromCollection
};