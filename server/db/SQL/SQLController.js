var SQLdb = require('./SQLInteractor.js')

var getFinancialData = function(req, res, next){ 
  SQLdb.getContributions(function(results){ 
    res.send(results)
  })
};

exports.getFinancialData = getFinancialData;