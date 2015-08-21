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
  var queryString = "select * from candidateInfo";

  connection.query(queryString, function(err, results){
    if(err) console.log(err);
    callback(JSON.stringify(results));
  });
};

//individual candidate data
var getCandidateById = function(candId, callback){
  // var queryString = "select c.id id, c.name name, c.type industry, c.state state, c.cyle, SUM(contrib.amount) as total$ \
  //                    from contributions contrib inner join contributors c \
  //                    where contrib.cand_id = '" + candId + "' and contrib.cmte_id = c.id and contrib.cycle = c.cycle \
  //                    group by c.name;";
  var queryString = "select * from candidateDetail where cand_id = '" + candId +"'";
  var queryString = "select contributionHelper.*, candidates.name from contributionHelper, candidates \
                      where contributionHelper.cand_id = candidates.id and candidates.id='" +candId+"' \
                      group by contributionHelper.cycle, contributionHelper.cmte_id;";

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


