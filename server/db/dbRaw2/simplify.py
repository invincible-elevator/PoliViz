import os

fileTypes = ['contrib','committee','cand','finance']
dates = ['14']

for fileType in fileTypes:
  for date in dates: 
    f = open(date + '/' + fileType + date + '.txt', 'r')
    n = open(date + '/' + 'new' + fileType + date + '.txt', 'w')

    for line in f:
      data = line.split('|')

      # CONTRIBUTIONS TO CANDIDATES file 
        # 0 is committee ID
        # 5 is transaction type
        # 14 is transaction amount 
        # 16 is candidate ID
      if fileType == 'contrib':
        if data[5] == '24K':
          n.write(data[0] + '|' + data[14] + '|' + data[16] + '\n')

      # COMMITTEE information file 
        # 0 is committee ID
        # 1 is name
        # 6 is state
        # 12 is interest group
      if fileType == 'committee':
        n.write(data[0] + '|' + data[1] + '|' + data[6] + '|' + data[12] + '\n')

      # CANDIDATE information file
        # 0 is candidate id
        # 1 is candidate name
        # 2 is party 
        # 4 is candidate state
        # 5 is office (position)
      if fileType == 'cand':
        n.write(data[0] + '|' + data[1] + '|' + data[2] + '|' + data[4] + '|' + data[5] + '\n')

      # CANDIDATE finance information file 
        # 0 is candidate ID
        # 11 is candidate contributions 
        # 17 is individual contributions 
        # 25 is PAC contributions 
        # 26 is party contributions 
      if fileType == 'finance':
        n.write(data[0] + '|' + data[11] + '|' + data[17] + '|' + data[25] + '|' + data[26] + '\n')

  f.close()
  os.remove(date + '/' + fileType + date + '.txt')
  os.rename(date + '/' + 'new' + fileType + date + '.txt', date + '/' + fileType + date + '.txt')