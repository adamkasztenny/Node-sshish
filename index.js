var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var app = express();

app.get('/server', function(req, res) {
    res.download('./index.js');
});

console.log('Listening on localhost:5001');
app.listen(5001);
