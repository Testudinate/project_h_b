#import requests
import urllib.request as urllib
from bs4 import BeautifulSoup

searchText='python'

#searchSpeak = 'https://hh.ru/search/resume?area=1438&clusters=true&exp_period=all_time&logic=normal&no_magic=true&order_by=relevance&pos=full_text&text=программист&page=5'

def getSearchingResults(searchText):
    listOfResumesId = []
    namberPage = 0
    countRecord = 0
    #print('01-Start')
    while True:
        #searchSpeak = "https://hh.ru/search/resume?area=1438&clusters=true&text=%s&pos=full_text&logic=normal&exp_period=all_time&order_by=relevance&area=1&clusters=true&page=%i" %(searchText,namberPage)
        #searchSpeak = "https://hh.ru/search/resume?area=1438&clusters=true&text=%s&pos=full_text&logic=normal&exp_period=all_time&order_by=relevance&area=1&clusters=true&page=0"
        #searchSpeak = "https://hh.ru/search/resume?area=53&clusters=true&exp_period=all_time&label=only_with_salary&logic=normal&order_by=relevance&pos=full_text&specialization=1&text=%s&salary_from=65000&salary_to=100000&page=%i" %(searchText,namberPage)
        #searchSpeak  = "https://hh.ru/search/resume?area=53&clusters=true&exp_period=all_time&label=only_with_salary&logic=normal&no_magic=true&order_by=relevance&pos=full_text&salary_from=65000&salary_to=100000&specialization=1&page=%i" %(searchText,namberPage)
        searchSpeak =   "https://hh.ru/search/resume?area=53&clusters=true&exp_period=all_time&label=only_with_salary&logic=normal&order_by=relevance&pos=full_text&salary_from=65000&salary_to=100000&specialization=1&text=%s&skill=1114&from=cluster_skill&page=%i" %(searchText,namberPage)
        connect = urllib.urlopen(searchSpeak)
        print(searchSpeak)
        print('----------------')
        content = connect.read()
        soupTree = BeautifulSoup(content, 'html.parser')
        connect.close()
        #print(soupTree)
        notFound = soupTree.find('div', {'class': 'error-content-wrapper'})
        if(notFound == None):
            formPersons = soupTree.findAll('div',{'itemscope': 'itemscope'})
            for item in formPersons:
                listOfResumesId.append(item.find('a',{'itemprop':'jobTitle'}))##['data-hh-resume-hash'])
                countRecord += 1
                namberPage += 1
            # for debag
            if(countRecord <= debugeSize):
                break
        else:
            break
        #namberPage = 0
        #print(listOfResumesId)
        print('02-Finish')
        connect.close()
    return listOfResumesId

if __name__ == '__main__':
    
    debugeSize = 200
    listId = getSearchingResults(searchText)
    print(listId)
