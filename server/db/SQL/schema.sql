CREATE DATABASE PoliticalData;

USE PoliticalData;

  /* Describe your table here.*/
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
  PRIMARY KEY('CMTE_ID')

);

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
  PRIMARY KEY('CAND_ID')
);

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
