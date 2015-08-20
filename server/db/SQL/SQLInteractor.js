var mysql = require('mysql');

//connects to SQL database
var connection = mysql.createConnection({
  user: 'root',
  password: '',
  database: 'PoliticalData'
});

connection.connect();

// gets candidate information
var getCandidates = function(callback){ 
  var queryString = "select candidate.CAND_ID id, \
                            candidate.CAND_NAME name, \
                            candidate.CAND_PTY_AFFILIATION party, \
                            candidate.CAND_OFFICE position, \
                            candidate.CAND_ST state, \
                            CandFinance.TTL_RECEIPTS total$, \
                            CandFinance.OTHER_POL_CMTE_CONTRIB pac$, \
                            CandFinance.POL_PTY_CONTRIB party$, \
                            CandFinance.TTL_INDIV_CONTRIB individual$, \
                            CandFinance.CAND_CONTRIB candidate$ \
                    from candidate \
                    inner join CandFinance \
                    on candidate.CAND_ID = CandFinance.CAND_ID";

  connection.query(queryString, function(err, results){
    if(err) console.log(err);
    callback(JSON.stringify(results));
  });
};

//individual candidate data
var getCandidateById = function(candId, callback){
  var queryString = "select CMTE_ID id, \
                            CMTE_NM name, \
                            ORG_TP industry, \
                            CMTE_st state, \
                            SUM(TRANSACTION_AMT) as total$ \
                     FROM joinedData WHERE CAND_ID = '" + candId + "' group by CMTE_NM;";

  connection.query(queryString, function(err, results){
    if(err) console.log(err);
    callback(JSON.stringify(results));
  });
};

// get contributor information
var getContributors = function(callback) {
  var queryString = "select committees.CMTE_ID id, \
                            committees.CMTE_NM name, \
                            committees.ORG_TP industry, \
                            committees.CMTE_ST state, \
                            SUM(cont_to_cand.TRANSACTION_AMT) total$ \
                     from committees \
                     inner join cont_to_cand \
                     on committees.CMTE_ID = cont_to_cand.CMTE_ID \
                     group by committees.CMTE_ID \
                     order by total$ desc"

  connection.query(queryString, function(err, results){
    if(err) console.log(err);
    callback(JSON.stringify(results));
  });
};

// get individual contributor information
var getContributorById = function(contribId, callback) {
  var queryString = "select CAND_ID id, \
                            CAND_NAME name, \
                            CAND_PTY_AFFILIATION party, \
                            CAND_OFFICE position, \
                            CMTE_ST state, \
                            sum(TRANSACTION_AMT) total$ \
                     from joinedData \
                     where CMTE_ID = '" + contribId + "' group by CAND_ID;";

  connection.query(queryString, function(err, results){
    if(err) console.log(err);
    callback(JSON.stringify(results));
  });
};

module.exports = {
  getCandidates : getCandidates,
  getCandidateById : getCandidateById,
  getContributors : getContributors,
  getContributorById : getContributorById
};


