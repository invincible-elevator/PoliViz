import os

# fileTypes = ['pas2','committee','cand','finance']
fileTypes = ['cn','cm','webl','itpas2']
dataPath = 'server/db/dbRaw/data'


# HELPER FUNCTION to simplify files
def simplifyFile(date, fileType):
  if fileType == 'webl':
    oldFileName = dataPath + '/' + date + '/' + fileType + date + '.txt'
  else: 
    oldFileName = dataPath + '/' + date + '/' + fileType + '.txt'

  f = open(oldFileName, 'r')
  n = open(dataPath + '/' + date + '/' + 'new' + fileType + '.txt', 'w')

  for line in f:
    data = line.split('|')

    # CONTRIBUTIONS TO CANDIDATES file 
      # 0 is committee ID
      # 5 is transaction type
      # 14 is transaction amount 
      # 16 is candidate ID
    if fileType == 'itpas2':
      if data[5] == '24K':
        n.write(data[0] + '|' + data[14] + '|' + data[16] + '\n')

    # COMMITTEE information file 
      # 0 is committee ID
      # 1 is name
      # 6 is state
      # 12 is interest group
    if fileType == 'cm':
      n.write(data[0] + '|' + data[1] + '|' + data[6] + '|' + data[12] + '\n')

    # CANDIDATE information file
      # 0 is candidate id
      # 1 is candidate name
      # 2 is party 
      # 4 is candidate state
      # 5 is office (position)
    if fileType == 'cn':
      n.write(data[0] + '|' + data[1] + '|' + data[2] + '|' + data[4] + '|' + data[5] + '\n')

    # CANDIDATE finance information file 
      # 0 is candidate ID
      # 11 is candidate contributions 
      # 17 is individual contributions 
      # 25 is PAC contributions 
      # 26 is party contributions 
    if fileType == 'webl':
      n.write(data[0] + '|' + data[11] + '|' + data[17] + '|' + data[25] + '|' + data[26] + '\n')

  f.close()
  os.remove(oldFileName)
  os.rename(dataPath + '/' + date + '/' + 'new' + fileType + '.txt', dataPath + '/' + date + '/' + fileType + '.txt')
