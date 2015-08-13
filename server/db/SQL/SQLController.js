var SQLdb = require('./SQLInteractor.js')

var getFinancialData = function(req, res, next){ 
  SQLdb.getContributions(function(err, results){ 
    if(err) console.log("There was an issue with the GET request")
    res.send(results)
  })
};

exports.getFinancialData = getFinancialData;