var database = require('./databaseInteractor.js');
var request = require('request');

var databaseFilter = function(collectionName, name, firstName, lastName, req, res) {
  if (collectionName === 'dataSets') {
    //check database for dataset
    database.findDataSet(collectionName, name, function(resp){
      //if no data, request from API
      if (resp === false) {
        var nameId = "";
        var politifactDb = database.chooseCollection("politifactList");
        politifactDb.findOne({"last_name":lastName, "first_name": firstName}).on('success', function(doc){
          if (doc === null) {
            res.status(200).send("Enter Valid Name");
          } else {
            nameId = doc.name_slug;
            //*****CHANGE FOR PRODUCTION USE******
            //Number of documents returned set to 5.  Change the end of request string n=5 to n=(desired amount)
            request('http://www.politifact.com/api/statements/truth-o-meter/people/' +nameId+ '/json/?n=5', function (error, response, body) {
              var data = JSON.parse(body);
              if (!error && response.statusCode == 200) {
                //filter the data before storage and send to client)
                var filteredData = {
                  rulingMap: {
                    "true": 0,
                    "mostly-true": 0,
                    "false": 0,
                    "pants-fire": 0,
                    "no-flip": 0,
                    "half-flip": 0,
                    "barely-true": 0,
                    "full-flop":0,
                    "half-true": 0
                  },
                  pantsFireQuotes: []
                };
                for (var i = 0; i < data.length; i++) {
                  if (data[i].speaker.name_slug === nameId) {
                    filteredData.rulingMap[data[i].ruling.ruling_slug]++;
                  }
                  if (data[i].ruling.ruling_slug === "pants-fire"  && data[i].speaker.name_slug === nameId) {
                    filteredData.pantsFireQuotes.push(data[i].statement);
                  }
                }
                //send to client and store in db
                database.addDataSet(collectionName, filteredData, name, function (err){});
                res.status(200).send(filteredData);
              }
            });
          }
        });
      } else {
        //if in db, send to client
        res.status(200).send(resp); 
      }
    });
  }
}

module.exports = {
  databaseFilter: databaseFilter
};



