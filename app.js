var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.use(express.static(__dirname + '/' ));

app.post('/', function( req ,res){
    res.send("Success");
});

app.listen(8080);