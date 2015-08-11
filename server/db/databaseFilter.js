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
            request('http://www.politifact.com/api/statements/truth-o-meter/people/' +nameId+ '/json/?n=100', function (error, response, body) {
              var data = JSON.parse(body);
              if (!error && response.statusCode == 200) {
                //filter the data before storage and send to client)
                var filteredData = {
                  rulingMap: [
                    {"ruling":"true", "value": 0},
                    {"ruling":"mostly-true", "value": 0},
                    {"ruling":"false", "value": 0},
                    {"ruling":"pants-fire", "value": 0},
                    {"ruling":"no-flip", "value": 0},
                    {"ruling":"half-flip", "value": 0},
                    {"ruling":"barely-true", "value": 0},
                    {"ruling":"full-flop", "value":0},
                    {"ruling":"half-true", "value": 0}
                  ],
                  pantsFireQuotes: [],
                  fullFlopQuotes:[]
                };
                for (var i = 0; i < data.length; i++) {
                  if (data[i].speaker.name_slug === nameId) {
                    if (data[i].ruling.ruling_slug === 'true') {
                      filteredData.rulingMap[0].value++;
                    } else if (data[i].ruling.ruling_slug === 'mostly-true') {
                      filteredData.rulingMap[1].value++;
                    } else if (data[i].ruling.ruling_slug === 'false') {
                      filteredData.rulingMap[2].value++;
                    } else if (data[i].ruling.ruling_slug === 'pants-fire') {
                      filteredData.rulingMap[3].value++;
                    } else if (data[i].ruling.ruling_slug === 'no-flip') {
                      filteredData.rulingMap[4].value++;
                    } else if (data[i].ruling.ruling_slug === 'half-flip') {
                      filteredData.rulingMap[5].value++;
                    } else if (data[i].ruling.ruling_slug === 'barely-true') {
                      filteredData.rulingMap[6].value++;
                    } else if (data[i].ruling.ruling_slug === 'full-flop') {
                      filteredData.rulingMap[7].value++;
                    } else if (data[i].ruling.ruling_slug === 'half-true') {
                      filteredData.rulingMap[8].value++;
                    } 
                  }
                  if (data[i].ruling.ruling_slug === "pants-fire"  && data[i].speaker.name_slug === nameId) {
                    filteredData.pantsFireQuotes.push(data[i].statement);
                  }
                  if (data[i].ruling.ruling_slug === "full-flop"  && data[i].speaker.name_slug === nameId) {
                   filteredData.fullFlopQuotes.push(data[i].statement); 
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



