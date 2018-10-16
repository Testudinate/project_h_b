import requests

def download_file(url):
    local_filename = 'test'+url.split('/')[-1]
    #print(local_filename)
    # NOTE the stream=True parameter
    r = requests.get(url, stream=True)
    with open(local_filename, 'wb') as f:
        for chunk in r.iter_content(chunk_size=1024): 
            if chunk: # filter out keep-alive new chunks
                f.write(chunk)
                f.flush()
                #print(chunk)
    print(local_filename)
    return local_filename

download_file('http://techslides.com/demos/sample-videos/small.mp4')
