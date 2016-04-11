var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var app = express();

mongoose.connect('mongodb://localhost:27017/simple-server');

var visitorSchema = mongoose.Schema({ name: String, age: Number});

app.get('/source', function(req, res) {
    res.download('./index.js');
});

app.get('/', function(req, res) {
    res.end('Welcome to my simple server');
});

// POST is preferable here
app.get('/signup', function(req, res) {
    var _vistor = new Visitor(req.query.name, req.query.age);
    _vistor.save(function(err) {
        if (err) {
            console.debug(JSON.stringify(err));
        }
    });
});

console.log('Listening on localhost:5001');
app.listen(5001);
