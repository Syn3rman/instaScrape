import multiprocessing
import requests
import uuid, math, os
from flask import Flask,request,jsonify

app = Flask(__name__)

def save_images(urls, handle):
    for url in urls:
        res = requests.get(url)
        fname = "{}/{}/{}".format(os.getcwd(),handle,uuid.uuid4())
        print(fname)
        directory = "{}/{}".format(os.getcwd(),handle)
        if not os.path.exists(directory):
            os.makedirs(directory)
        with open(fname, 'wb') as f:
            f.write(res.content)

@app.route('/downloadImages', methods=['GET','POST'])
def imgDownload():
    form_data = request.json
    print(form_data)
    nprocs = form_data['nprocs']
    l = form_data['urls']
    print(type(l))
    handle = form_data['handle']
    chunksize = math.ceil(len(l)/nprocs)
    for i in range(nprocs):
        p = multiprocessing.Process(target=save_images, args=(
                                        l[chunksize*i:chunksize*(i+1)], handle,
                                    ))
        p.start()
    return jsonify({
        'success': True
    })

if __name__ == "__main__":
    app.run(debug=True,port=5000)
# save_images(l, "9gag")
