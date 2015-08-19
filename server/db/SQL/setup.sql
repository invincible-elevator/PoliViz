LOAD DATA LOCAL INFILE 'server/db/dbRaw/CandidateMaster.txt' INTO TABLE candidate FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/CommitteeMaster.txt' INTO TABLE committees FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/ContributionstoCandidates.txt' INTO TABLE cont_to_cand  FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n';

LOAD DATA LOCAL INFILE 'server/db/dbRaw/TotalCandidateFinance.txt' INTO TABLE CandFinance FIELDS TERMINATED BY '|' LINES TERMINATED BY '\n';

insert into joinedData select candidate.CAND_NAME, candidate.CAND_ID, candidate.CAND_PTY_AFFILIATION, candidate.CAND_ELECTION_YR, candidate.CAND_OFFICE, candidate.CAND_OFFICE_ST, candidate.CAND_OFFICE_DISTRICT, committees.CMTE_NM, committees.CMTE_PTY_AFFILIATION, cont_to_cand.TRANSACTION_AMT from candidate inner join cont_to_cand on candidate.CAND_ID = cont_to_cand.CAND_ID inner join committees on cont_to_cand.CMTE_ID = committees.CMTE_ID;
