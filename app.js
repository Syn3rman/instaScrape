const express = require('express');

var app = express();
const port = 8000;
app.listen(port, ()=>{
	console.log("Listening on port 8000");
});

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use('/', require('./server/'));
