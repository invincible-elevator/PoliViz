DROP DATABASE IF EXISTS PoliticalData;

CREATE DATABASE PoliticalData;

USE PoliticalData;

/* Committees contains all data pertaining to traditional PACs and their party 
* affiliations.
*/
CREATE TABLE `contributors` (
  `id` varchar(9) NOT NULL,
  `name` varchar(200),
  `state` varchar(2),
  `type` varchar(1),
  `cycle` int,
  PRIMARY KEY(`id`)
);

/* Contributions to Candidates (cont_to_cand) 
* contains all official contributions from PACs to candidates. These donations
* are restricted by campaign contribution limits. 
*/
CREATE TABLE `contributions` (
  `cmte_id` varchar(9) NOT NULL,
  `amount` DECIMAL(14,2),
  `cand_id` varchar(9), 
  `cycle` int
);

/* Candidate contains all data pertaining to 2015-2016 candidates for election
*/

CREATE TABLE `candidates`  (
  `id` varchar(9),
  `name` varchar(200),
  `party` varchar(3),
  `state` varchar(2),
  `office` varchar(1),
  `cycle` int,
  PRIMARY KEY(`id`)
);


/* CandFinance displays financial information for each candidate, including donations from 
super PACs, traditional PACs, and contributions from individuals.
 */
CREATE TABLE `finances` (
  `id` varchar(9),
  `totalMoney` DECIMAL(14,2),
  `candidateMoney` DECIMAL(14,2),
  `individualMoney` DECIMAL(14,2),
  `pacMoney` DECIMAL(14,2),
  `partyMoney` DECIMAL(14,2),
  `cycle` int,
  PRIMARY KEY(`id`)
);

