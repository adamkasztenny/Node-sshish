var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var app = express();

const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

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
            console.log(JSON.stringify(err));
        }
    });
    console.log(JSON.stringify(_visitor));
    res.json(_vistor);
});

// thanks to https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback
app.get('/bash/:command', function (req, res) {
    var command = req.params.command;
    var child = exec(command, (error, stdout, stderr) => {
        res.json(stdout);
        
        if (error) {
            console.log(error);
        }
    });
});

console.log('Listening on localhost:5001');
app.listen(5001);
