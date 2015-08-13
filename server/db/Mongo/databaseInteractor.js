var monk = require('monk');
var db = monk(process.env.CUSTOMCONNSTR_MONGOLAB_URI||'localhost/db');

//This holds connections for all the current collections
var collections = {
	dataSets: db.get('dataSets'),
	politicians: db.get('politicians'),
	politifactList: db.get('politifactList')
};



/* ----------------------------------------------------
 * dataSets.js
 * ----------------------------------------------------
 *	This file interacts with the mongoDB dataSets collection.
 *  It is meant to abstract away all the basic functions that
 *  might need to be used to interact with the database. 
 *-----------------------------------------------------
 */


/* function: chooseCollection
 * --------------------------
 * This function takes in the name of the collection and returns a connection 
 * that collection. 
*/
var chooseCollection = function(collectionName){
	return collections[collectionName];
};

/* function: addDataSet
 * --------------------
 * This function takes in a data set, a name for it, and a callback. It then stores
 * the data in the dataSets collection using that name as a reference. Later I might modify
 * it so that the name is actually indexed for faster lookup time
*/
var addDataSet = function(collectionName, data, name , callback){
	var collection = chooseCollection(collectionName);
	collection.insert({name: name, data: data}, function(err, resp){
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
var updateDataSet = function(collectionName, data, name, callback){
	var collection = chooseCollection(collectionName);
	collection.update({name: name}, {name: name, data: data}, function(err, resp){
		callback(resp);
	});
};


/* function: findDataSet 
 * ---------------------
 * This function takes in the name of the dataset and a callback. It then finds the item in the
 * database and calls the callback on the data given as a response. 
*/
var findDataSet = function(collectionName, name, callback){
	var collection = chooseCollection(collectionName);
	collection.find({name: name}, function (err, resp){
		if(resp.length === 0){
			callback(false);
		} else {
			callback(resp);
		}
	});
};

/* function: clearCollection
 * -------------------------
 * This function will allow the dataSet collection to be cleared. It will mainly be used
 * in development and should be removed before it is released. 
*/
var clearCollection = function(collectionName, callback){
	var collection = chooseCollection(collectionName);
	collection.remove({}, function(err, resp){
		callback(resp);
	});
};

/* function: removeFromCollection
 * ------------------------------
 * This function removes an item designated by the name from the collection
 * and calls the callback upon completion
*/
var removeFromCollection = function(collectionName, name, callback){
	var collection = chooseCollection(collectionName);
	collection.remove({name:name}, function(err, resp){
		callback(resp);	
	});
};

/*Exports section
 *----------------
 * This section exports the functions from the module to  
 * allow them to be accessed. 
*/
module.exports = {
	chooseCollection: chooseCollection,
	findDataSet: findDataSet,
	clearCollection: clearCollection,
	addDataSet: addDataSet,
	updateDataSet:updateDataSet,
	removeFromCollection: removeFromCollection
};