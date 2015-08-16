var SQLdb = require('./SQLInteractor.js')

var getFinancialData = function(req, res, next){ 
  SQLdb.getContributions(function(results){ 
    res.send(results)
  })
};

//invidividual candidate data
var getCandidateData = function(req, res, next){ 
  var candName = req.body.candName;
  SQLdb.getCandidateData(candName, function(results){ 
    res.send(results)
  })
};

exports.getFinancialData = getFinancialData;
exports.getCandidateData = getCandidateData;