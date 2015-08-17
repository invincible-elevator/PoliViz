var mysql = require('mysql');

//connects to SQL database
var connection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'PoliticalData'
});

connection.connect();


//All candidate finance data
var getCandidateFinanceData = function(callback){ 
  var queryString = "select CandFinance.CAND_NAME, CandFinance.CAND_PTY_AFFILIATION, CandFinance.TTL_RECEIPTS, \
  CandFinance.TRANS_FROM_AUTH, CandFinance.TTL_DISB, CandFinance.CAND_CONTRIB, CandFinance.TTL_INDIV_CONTRIB, \
  CandFinance.CAND_OFFICE_ST, CandFinance.OTHER_POL_CMTE_CONTRIB, CandFinance.POL_PTY_CONTRIB, candidate.CAND_OFFICE \
  from CandFinance inner join candidate on CandFinance.CAND_ID = candidate.CAND_ID order by CAND_NAME;";

  connection.query(queryString, function(err, results){
    if(err) console.log(err);
    callback(JSON.stringify(results));
  });
};

//candidate finance data by name
var getCandidateFinanceDataByName = function(candName, callback){ 
  var queryString = "select CAND_NAME, CAND_PTY_AFFILIATION, TTL_RECEIPTS, TRANS_FROM_AUTH, \
  TTL_DISB, CAND_CONTRIB, TTL_INDIV_CONTRIB, CAND_OFFICE_ST, OTHER_POL_CMTE_CONTRIB, POL_PTY_CONTRIB from CandFinance \
  inner join candidate on CandFinance.CAND_ID = candidate.CAND_ID where CAND_NAME = '" + candName + "'order by CAND_NAME;";

  connection.query(queryString, function(err, results){
    if(err) console.log(err);
    callback(JSON.stringify(results));
  });
};


exports.getCandidateFinanceData = getCandidateFinanceData;
exports.getCandidateFinanceDataByName = getCandidateFinanceDataByName;


