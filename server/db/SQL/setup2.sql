# 2010 data set
LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/10/cn.txt' INTO TABLE candidates FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2010';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/10/cm.txt' INTO TABLE contributors FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2010';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/10/itpas2.txt' INTO TABLE contributions  FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2010';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/10/webl.txt' INTO TABLE finances FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2010';

# 2012 data set
LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/12/cn.txt' INTO TABLE candidates FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2012';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/12/cm.txt' INTO TABLE contributors FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2012';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/12/itpas2.txt' INTO TABLE contributions  FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2012';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/12/webl.txt' INTO TABLE finances FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2012';

#2014 data set
LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/14/cn.txt' INTO TABLE candidates FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2014';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/14/cm.txt' INTO TABLE contributors FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2014';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/14/itpas2.txt' INTO TABLE contributions  FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2014';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/14/webl.txt' INTO TABLE finances FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2014';

#2016 data set
LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/16/cn.txt' INTO TABLE candidates FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2016';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/16/cm.txt' INTO TABLE contributors FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2016';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/16/itpas2.txt' INTO TABLE contributions  FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2016';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/data/16/webl.txt' INTO TABLE finances FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n' SET cycle = '2016';

#create helper tables
create table candidateInfo as select c.id,c.name, c.party, c.office position, c.state, c.cycle, f.totalMoney total$, f.pacMoney pac$, f.partyMoney party$, f.individualMoney individual$, f.candidateMoney candidate$ from candidates c inner join finances f on c.id = f.id and c.cycle = f.cycle;

-- create table candidateDetail as select contrib.cycle, contrib.cand_id, c.id id, c.name name, c.type industry, c.state state, SUM(contrib.amount) as total$ from contributions contrib inner join contributors c where contrib.cmte_id = c.id and contrib.cycle = c.cycle group by c.name;

create table contributionHelper as select cycle, cmte_id, cand_id, sum(amount) from contributions where cand_id <> '' group by cycle, cmte_id, cand_id;