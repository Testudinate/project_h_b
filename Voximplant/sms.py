import os
import csv
#import urllib2
import requests
import time
lis = []
for top, dirs, files in os.walk('C:\Project\SMS'):
    for nm in files: 
        text = (os.path.join(top,nm)) 
        t = os.path.split(text) 
        t = os.path.splitext(t[1]) 
        full_name = t[0]+t[1] 
        if t[1]=='.csv': 
            lis.append(full_name)
CNT_LIS = len(lis) 
j = 0 
for j in range(CNT_LIS): 
    text = lis[j] 
    text = text.split('.') 
    load_file = ''+str(text[0])+'.'+str(text[1])+'' 
    tabl = text[0] 
    print(load_file) 
    with open(load_file,"r") as f: 
        csv_data = csv.reader(f,delimiter=';') # читаем данные из файла и задаем разделитель ';'
        next
        print(csv_data)
        for row in csv_data:
            if row[17] == 'no':
                print(row[13])
                phone_number = row[13]
        
                gh_url = "https://sms.ru/sms/send?api_id=<api_key>&to=+"+str(phone_number)+"&msg=Ссылка%20на%20http://...&json=1"
                time.sleep(5)
                response = requests.post(gh_url)
                print(response.status_code)
f.close()

