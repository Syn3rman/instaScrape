## To-do's
- Error handling
- Improve flask responses :P
- Terminate while loop in scraping when no more elements are being added for 5-6 consecutive iterations
- Add (and link existing) code for login for private accounts

## Demo vid:

<div align = "center">
<img src="./assets/scrapingWithDownload.gif" width=600px/>
<br>
<br>
<img src="./assets/instaScrape.png" width=600px/>
</div>

To run:

```
git clone https://github.com/Syn3rman/instaScrape.git && cd instaScrape
npm install
```

Start the flask server and run the driver script with 

```
flask run
node run.js
```

Or using docker: 
```
docker pull syn3rman/instascrape:latest
```

Run it using:
```
docker run --rm -it syn3rman/instascrape
```

Navigate to [localhost](http://localhost:8001/public?handle=9gag&limit=20) and change the get request parameters as required.
