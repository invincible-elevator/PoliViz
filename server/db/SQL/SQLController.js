var SQLdb = require('./SQLInteractor.js')

var getSummaryData = function(req, res, next){ 
  SQLdb.getCandidateFinanceData(function(results){ 
    res.send(results)
  })
};

var getSummaryDataByName = function(req, res, next){ 
  var candName = req.body.candName;
  SQLdb.getCandidateFinanceDataByName(candName, function(results){ 
    res.send(results)
  })
};

exports.getSummaryData = getSummaryData;
exports.getSummaryDataByName = getSummaryDataByName;