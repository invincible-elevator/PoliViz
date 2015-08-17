CREATE DATABASE PoliticalData;

USE PoliticalData;

/* Committees contains all data pertaining to traditional PACs and their party 
* affiliations.
*/
CREATE TABLE `committees` (
  `CMTE_ID` varchar(9) NOT NULL,
  `CMTE_NM` varchar(200),
  `TRES_NM` varchar(90),
  `CMTE_ST1` varchar(34), 
  `CMTE_ST2` varchar(34), 
  `CMTE_CITY` varchar(30),
  `CMTE_ST` varchar(2),
  `CMTE_DSNG` varchar(1),
  `CMTE_TP` varchar(1),
  `CMTE_PTY_AFFILIATION` varchar(3),
  `CMTE_FILING_FREQ` varchar(1),
  `ORG_TP` varchar(1),
  `CONNECTED_ORG_NM` varchar(200),
  `CAND_ID` varchar(9), 
  PRIMARY KEY(`CMTE_ID`)
);

/* Contributions to Candidates (cont_to_cand) 
* contains all official contributions from PACs to candidates. These donations
* are restricted by campaign contribution limits. 
*/
CREATE TABLE `cont_to_cand` (
  `CMTE_ID` varchar(9) NOT NULL,
  `AMNDT_IND` varchar(1),
  `RPT_TP` varchar(3),
  `TRANSACTION_PGI` varchar(5),
  `IMAGE_NUM` varchar(18),
  `TRANSACTION_TP` varchar(3),
  `ENTITY_TP` varchar(3),
  `NAME` varchar(200),
  `CITY` varchar(30),
  `STATE` varchar(2),
  `ZIP_CODE` varchar(9),
  `EMPLOYER` varchar(38),
  `OCCUPATION` varchar(38),
  `TRANSACTION_DT` date,
  `TRANSACTION_AMT` DECIMAL(14,2),
  `OTHER_ID` varchar(9),
  `CAND_ID` varchar(9),
  `TRAN_ID` varchar(32),
  `FILE_NUM` INT,
  `MEMO_CD` varchar(1),
  `MEMO_TEXT` varchar(100),
  `SUB_ID` INT
);

/* Candidate contains all data pertaining to 2015-2016 candidates for election
*/

CREATE TABLE `candidate`  (
  `CAND_ID` varchar(9),
  `CAND_NAME` varchar(200),
  `CAND_PTY_AFFILIATION` varchar(3),
  `CAND_ELECTION_YR` int,
  `CAND_OFFICE_ST` varchar(2),
  `CAND_OFFICE`  varchar(1),
  `CAND_OFFICE_DISTRICT` varchar(2),
  `CAND_ICI` varchar(1),
  `CAND_STATUS` varchar(1),
  `CAND_PCC` varchar(9),
  `CAND_ST1` varchar(34),
  `CAND_ST2` varchar(34),
  `CAND_CITY` varchar(30),
  `CAND_ST` varchar(2),
  `CAND_ZIP` varchar(19), 
  PRIMARY KEY(`CAND_ID`)
);

/* JoinedData is a table that is instantiated with committees, candidates, and cont
 * to cand to reduce database retrieval time on client side.
 */
CREATE TABLE `joinedData` (
  `CAND_NAME` varchar(200),
  `CAND_PTY_AFFILIATION` varchar(3),
  `CAND_ELECTION_YR` int,
  `CAND_OFFICE`  varchar(1),
  `CAND_OFFICE_ST` varchar(2),
  `CAND_OFFICE_DISTRICT` varchar(2),
  `CMTE_NM` varchar(200),
  `CMTE_PTY_AFFILIATION` varchar(3),
  `TRANSACTION_AMT` DECIMAL(14,2)
);

/* CandFinance displays financial information for each candidate, including donations from 
super PACs, traditional PACs, and contributions from individuals.
 */
CREATE TABLE `CandFinance` (
  `CAND_ID` varchar(9),
  `CAND_NAME` varchar(200),
  `CAND_ICI` varchar(1),
  `PTY_CD` varchar(1),
  `CAND_PTY_AFFILIATION` varchar(3),
  `TTL_RECEIPTS` DECIMAL(14,2),
  `TRANS_FROM_AUTH` DECIMAL(14,2),
  `TTL_DISB` DECIMAL(14,2),
  `TRANS_TO_AUTH` DECIMAL(14,2),
  `COH_BOP` DECIMAL(14,2),
  `COH_COP` DECIMAL(14,2),
  `CAND_CONTRIB` DECIMAL(14,2),
  `CAND_LOANS` DECIMAL(14,2),
  `OTHER_LOANS` DECIMAL(14,2),
  `CAND_LOAN_REPAY` DECIMAL(14,2),
  `OTHER_LOAN_REPAY` DECIMAL(14,2),
  `DEBTS_OWED_BY` DECIMAL(14,2),
  `TTL_INDIV_CONTRIB` DECIMAL(14,2),
  `CAND_OFFICE_ST` varchar(2),
  `CAND_OFFICE_DISTRICT` varchar(2),
  `SPEC_ELECTION` varchar(1),
  `PRIM_ELECTION` varchar(1),
  `RUN_ELECTION` varchar(1),
  `GEN_ELECTION` varchar(1),
  `GEN_ELECTION_PERCENT` DECIMAL(7,4),
  `OTHER_POL_CMTE_CONTRIB` DECIMAL(14,2),
  `POL_PTY_CONTRIB` DECIMAL(14,2),
  `CVG_END_DT` DATE,
  `INDIV_REFUNDS` DECIMAL(14,2),
  `CMTE_REFUNDS` DECIMAL(14,2),
  PRIMARY KEY(`CAND_ID`)
);



