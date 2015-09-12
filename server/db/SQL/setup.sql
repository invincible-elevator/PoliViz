# create indices on tables 

ALTER TABLE `contributors` ADD INDEX `con_id` (`id`);
ALTER TABLE `candidates` ADD INDEX `cand_id` (`id`);
ALTER TABLE `finances` ADD INDEX `cand_id` (`id`);

#create helper tables
create table candidateInfo as select c.id, c.name, c.party, c.office position, c.state, c.cycle, f.totalMoney total$, f.pacMoney pac$, f.partyMoney party$, f.individualMoney individual$, f.candidateMoney candidate$ from candidates c inner join finances f on c.id = f.id and c.cycle = f.cycle;

create table contributionHelper as select cycle, cmte_id, cand_id, sum(amount) sum from contributions where cand_id <> '' group by cycle, cmte_id, cand_id;
ALTER TABLE `contributionHelper` ADD INDEX `con_id` (`cmte_id`);

create table contributorInfo as select ch.cycle, ch.cmte_id id, c.name, c.state, c.type industry, sum(ch.sum) total$ from contributionHelper ch, contributors c where ch.cmte_id = c.id group by ch.cycle, ch.cmte_id;