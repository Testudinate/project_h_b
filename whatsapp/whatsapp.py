from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
 
driver = webdriver.Chrome('C:/chromedriver_win32/chromedriver.exe')      # directory to chromedriver
driver.get('https://web.whatsapp.com/')                  # URL to open whatsapp web
#wait = WebDriverWait(driver = driver, timeout = 900)         # inscrease or decrease the timeout according to your net connection
 
name = input('Enter the name of user or group: ')
msg = input('Enter your message: ')
count = int(input('Enter the count'))

input('Enter anything after scanning QR code')
user = driver.find_element_by_xpath('//span[@title = "{}"]'.format(name)) # HTML parse code to identify your reciever
user.click()                           # to open the receiver messages page in the browser
     
# many a times class name or other HTML properties changes so keep a track of current class name for input box by using inspect elements

msg_box = driver.find_element_by_class_name('_2S1VP')

for i in range(count):
    msg_box.send_keys(msg) # send your message followed by an Enter
    button = driver.find_element_by_class_name('_35EW6')
    button.click()
