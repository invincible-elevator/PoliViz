var SQLdb = require('./SQLInteractor.js')

var getSummaryData = function(req, res, next){ 
  SQLdb.getCandidateFinanceData(function(results){ 
    res.send(results);
  });
};

var getSummaryDataByName = function(req, res, next){ 
  var candName = req.body.candName;
  SQLdb.getCandidateFinanceDataByName(candName, function(results){ 
    res.send(results);
  });
};

var getContributors = function(req, res, next) {
  SQLdb.getContributors(function(results) { 
    res.send(results);
  });
};

var getContributorData = function(req, res, next) {
  var contributorName = req.params.name;
  SQLdb.getContributorById(contributorName, function(results) { 
    res.send(results);
  });
};

var getCandidates = function(req, res, next) {
  SQLdb.getCandidates(function(results) { 
    res.send(results);
  });
};

var getCandidateData = function(req, res, next) {
  var candidateName = req.params.name;
  SQLdb.getContributionsByName(candidateName, function(results) { 
    res.send(results);
  });
};

module.exports = {
  getSummaryData       : getSummaryData,
  getSummaryDataByName : getSummaryDataByName,
  getContributors      : getContributors,
  getContributorData   : getContributorData,
  getCandidates        : getCandidates,
  getCandidateData     : getCandidateData
};