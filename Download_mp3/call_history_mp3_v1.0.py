import os
import csv
#import urllib2
import requests
import time

lis = []
for top, dirs, files in os.walk('C:\Project\Call_history_download_mp3'):
    for nm in files: 
        text = (os.path.join(top,nm)) 
        t = os.path.split(text) 
        t = os.path.splitext(t[1]) 
        full_name = t[0]+t[1] 
        if t[1]=='.csv': 
            lis.append(full_name)
CNT_LIS = len(lis) 
j = 0
file_r=''
for j in range(CNT_LIS): 
    text = lis[j] 
    text = text.split('.') 
    load_file = ''+str(text[0])+'.'+str(text[1])+'' 
    tabl = text[0] 
    #print(load_file) 
    with open(load_file,"r") as f: 
        csv_data = csv.reader(f,delimiter=';') # читаем данные из файла и задаем разделитель ';'
        next
        #print(csv_data)
        for row in csv_data:
            if row[17] == 'yes':
                #print(row[13], row[22])
                phone_number = row[13]
                call_record_url = row[22]
                #print('Beginning file download with requests')
                # URL of the image to be downloaded is defined as image_url
                file_r = call_record_url.split('?record')
                r = requests.get(file_r[0]) # create HTTP response object   
                # send a HTTP request to the server and save 
                # the HTTP response in a response object called r
                #print(file_r[0])
                mp3 = file_r[0].split('/')[-1]
                #print(mp3)
                with open(str(phone_number)+'__'+mp3,'wb') as m:                   
                    # Saving received content as a png file in 
                    # binary format 
                  
                    # write the contents of the response (r.content) 
                    # to a new file in binary mode.
                    for chunk in r.iter_content(chunk_size=8024):
                        if chunk: 
                            m.write(chunk)
                    #break              
f.close()

