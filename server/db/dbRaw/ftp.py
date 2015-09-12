import os
import simplify
from zipfile import ZipFile
from ftplib import FTP


dataPath = 'server/db/dbRaw/data'
years = ['00','02', '04', '06', '08', '10', '12', '14', '16']
files = ['cn','cm','webl','pas2'] # types of files we need


# connect to ftp
# example url: ftp://ftp.fec.gov/FEC/2014/cm14.zip
ftp = FTP('ftp.fec.gov')    
ftp.login()
ftp.cwd('FEC')


# make the directories that the files will be written to
if os.path.exists(dataPath):
  print 'data folder already exists'
else:
  os.mkdir(dataPath)
  newdirs = [dataPath+'/' + year for year in years]
  for newdir in newdirs:
    os.mkdir(newdir)

# get files from FTP and write to files
for year in years:
  ftp.cwd('20'+year)            
  fileList = ftp.nlst()
  currentFiles = [fileName + year + '.zip' for fileName in files]
  for fileInfo in fileList:
    if fileInfo in currentFiles:
      print 'saving '+fileInfo
      newFileName = dataPath+'/'+year+'/'+fileInfo
      # read file from FTP, write to file
      f = open(newFileName, 'wb')
      ftp.retrbinary('RETR %s' % fileInfo, f.write)
      f.close()

      # unzip file
      print 'extracting ' + fileInfo
      zippedFile = ZipFile(newFileName)
      zippedFile.extractall(dataPath+'/'+year)

      # delete zip file
      os.remove(newFileName)

      # simplify file 
      print 'simplifying ' + newFileName
      fileType = fileInfo[:-6]
      if fileType == 'pas2':
        fileType = 'itpas2'
      simplify.simplifyFile(year, fileType)
  ftp.cwd('..')

ftp.quit()
print 'finished importing'

#create SQL statements for inserting into db
sqlpath = 'server/db/SQL/insert.sql'
f = open(sqlpath,'wb')


for year in years:
  sqlFiles = [["'server/db/dbRaw/data/"+year+"/cn.txt'", 'candidates'],
              ["'server/db/dbRaw/data/"+year+"/cm.txt'", 'contributors'],
              ["'server/db/dbRaw/data/"+year+"/itpas2.txt'", 'contributions'],
              ["'server/db/dbRaw/data/"+year+"/webl.txt'", 'finances']]
  sqlYear = "'20" + year + "'"
  for sqlFile in sqlFiles: 
    f.write("LOAD DATA LOCAL INFILE " + sqlFile[0] + " INTO TABLE " + sqlFile[1] + " FIELDS TERMINATED BY '|' LINES TERMINATED BY '\\n' SET cycle = " + sqlYear + ";")
    f.write('\n')

f.close()
