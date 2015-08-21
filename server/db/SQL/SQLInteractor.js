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
  var queryString = "select contributionHelper.cycle, \
                            contributionHelper.cmte_id, \
                            contributionHelper.sum $total, \
                            contributors.name, \
                            contributors.state, \
                            contributors.type industry \
                      from contributionHelper, contributors \
                      where contributionHelper.cmte_id = contributors.id and contributionHelper.cand_id='" +candId+"' \
                      group by contributionHelper.cycle, contributionHelper.cmte_id;";

  connection.query(queryString, function(err, results){
    if(err) console.log(err);
    callback(JSON.stringify(results));
  });
};

// get contributor information
var getContributors = function(callback) {
  var queryString = "select * from contributorInfo order by total$ desc";

  connection.query(queryString, function(err, results){
    if(err) console.log(err);
    callback(JSON.stringify(results));
  });
};

// get individual contributor information
var getContributorById = function(contribId, callback) {
  var queryString = "select ch.cycle, \
                          ch.sum $total, \
                          c.name, \
                          c.state, \
                          c.party, \
                          c.office position \
                    from contributionHelper ch, candidates c \
                    where ch.cand_id = c.id and ch.cmte_id='" +contribId+"' \
                    group by ch.cycle, ch.cand_id;";

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


