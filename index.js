var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var app = express();

const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

mongoose.connect('mongodb://localhost:27017/simple-server');

var visitorSchema = mongoose.Schema({user: {type: String, unique: true}, run: Array});
var Visitor = mongoose.model('Visitor', visitorSchema);

var currentUsers = [];
var users = [];

app.get('/source', function(req, res) {
    res.download('./index.js');
});


var sendFile = function(filename, res) {
    // thanks to http://www.cs.toronto.edu/~mashiyat/csc309/Lectures/ServerSideBasics.pdf, sl. 23
    fs.readFile(__dirname + filename, function(err, data) {
        if (err) {
            console.log(err);
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res. writeHead(200);
        res.end(data);
        console.log("Sent " + filename);
    });
};

app.get('/', function(req, res) {
    sendFile('/index.html', res);
});

app.post('/signup/:user', function(req, res) {
    var _visitor = new Visitor({user: req.params.user, run: []});
    _visitor.save(function(err) {
        if (err) {
            console.log(JSON.stringify(err));
            return;
        }
    });
    console.log(JSON.stringify(_visitor));
    res.json(_visitor);
});

// thanks to https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback
app.post('/bash/:user/:command', function (req, res) {
    var command = req.params.command;
    var user = req.params.user;

    var options = {cwd: '/home'};

    if (users[user]) {
        options = {cwd: users[user]};
    }

    var child = exec(command, options, (error, stdout, stderr) => {
        res.json(stdout);
        
        if (error) {
            console.log(error);
            return;
        }

        console.log(user + " ran " + command);

        var result = {command: command,
            date: new Date(),
            stdout_result: stdout,
            stderr_result: stderr
        };
        
        // thanks to http://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
        Visitor.findOneAndUpdate({user: user}, {$push: {run: result}}, {upsert:true}, function (err, doc) {
            if (err) {
                console.log(err);
                return;
            }
        });
    });
});

app.post('/bash/:user/cd/:dir', function(req, res) {
    var user = req.params.user;
    var directory = req.params.dir.replace(/\s/g, '');

    if (users[user] == undefined) {
        users[user] = '/home';
    }

    if (directory[0] != '/') {
        users[user] = users[user] + '/' + directory;
    }

    else {
        users[user] = directory;
    }

    console.log(user + " changed their working directory to " + users[user]);
    res.json(users[user]);
});

console.log('Listening on localhost:5001');
app.listen(5001);
