import multiprocessing
import requests
import math, os
import time

def save_images(urls, handle):
    for url in urls:
        res = requests.get(url)
        filename = url.split("/")[-1].split("?")[0]
        fname = "{}/{}/{}.png".format(os.getcwd(),handle, filename)
        directory = "{}/{}".format(os.getcwd(),handle)
        if not os.path.exists(directory):
            os.makedirs(directory)
        with open(fname, 'wb') as f:
            f.write(res.content)

def imgDownload(handle):
    nprocs = 8
    with open("urls.txt", "r") as f:
        l = f.read().split("\n")[:-1]
    chunksize = math.ceil(len(l)/nprocs)
    for i in range(nprocs):
        p = multiprocessing.Process(target=save_images, args=(
                                        l[chunksize*i:chunksize*(i+1)], handle,
                                    ))
        all_processes.append(p)
        p.start()
    return

all_processes = []
start_time = time.time()
imgDownload("9gag")

for p in all_processes:
  p.join()
print("--- %s seconds ---" % (time.time() - start_time))
