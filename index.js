var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var app = express();

const spawn = require('child_process').spawn;

mongoose.connect('mongodb://localhost:27017/simple-server');

var visitorSchema = mongoose.Schema({name: String, age: Number});
var Visitor = mongoose.model('Visitor', visitorSchema);

app.get('/source', function(req, res) {
    res.download('./index.js');
});

app.get('/', function(req, res) {
    res.end('Welcome to my simple server');
});

// POST is preferable here
app.get('/signup', function(req, res) {
    var _vistor = new Visitor({name: req.query.name, age: req.query.age});
    _vistor.save(function(err) {
        if (err) {
            console.debug(JSON.stringify(err));
        }
    });
    console.log(JSON.stringify(_visitor));
    res.json(_vistor);
});

app.get('/bash', function (req, res) {
    var bash = spawn('bash', ['-i']);
});

console.log('Listening on localhost:5001');
app.listen(5001);
