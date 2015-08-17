var SQLdb = require('./SQLInteractor.js')

var getFinancialData = function(req, res, next){ 
  SQLdb.getContributions(function(results){ 
    res.send(results)
  })
};

//invidividual candidate data
var getCandidateData = function(req, res, next){ 
  var candName = req.body.candName;
  SQLdb.getContributionsByName(candName, function(results){ 
    res.send(results)
  })
};

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

exports.getFinancialData = getFinancialData;
exports.getCandidateData = getCandidateData;
exports.getSummaryData = getSummaryData;
exports.getSummaryDataByName = getSummaryDataByName;