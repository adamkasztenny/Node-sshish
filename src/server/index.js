var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var path = require("path");
var app = express();

var loggingSetup = require('./logging.js');
loggingSetup.setup();
var logger = loggingSetup.logger;

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

app.get('/', function(req, res) {
    // thanks to https://codeforgeek.com/2015/01/render-html-file-expressjs/
    res.sendFile(path.join(__dirname + '/../public/views/index.html'));
});


app.get('/:folder/:file', function(req, res) {
    logger.info('Sending ' + path.join(__dirname + '/../public' + req.url));
    res.sendFile(path.join(__dirname + '/../public' + req.url));
});

app.post('/signup/:user', function(req, res) {
    var _visitor = new Visitor({user: req.params.user, run: []});
    _visitor.save(function(err) {
        if (err) {
            logger.info(JSON.stringify(err));
            return;
        }
    });
    logger.info(JSON.stringify(_visitor));
    res.json(_visitor);
});

// thanks to https://nodejs.org/api/child_process.html#child_process_child_process_execfile_file_args_options_callback
app.post('/bash/:user/:command', function (req, res) {
    var command = req.params.command;
    var user = req.params.user;
    var ip = req.connection.remoteAddress.toString();

    var options = {cwd: '/home'};

    if (users[user]) {
        options = {cwd: users[user]};
    }

    var child = exec(command, options, (error, stdout, stderr) => {
        if (stdout) {
            res.json(stdout);
        }

        else if (stderr) {
            res.json(stderr);
        }
        
        if (error) {
            logger.info(error);
            return;
        }

        logger.info(user + " ran " + command);

        var result = {command: command,
            date: new Date(),
            stdout_result: stdout,
            stderr_result: stderr,
            ip: ip
        };
        
        // thanks to http://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
        Visitor.findOneAndUpdate({user: user}, {$push: {run: result}}, {upsert:true}, function (err, doc) {
            if (err) {
                logger.info(err);
                return;
            }
        });
    });
});

app.post('/bash/:user/cd/:dir', function(req, res) {
    var user = req.params.user;
    var directory = req.params.dir.replace(/\s/g, '');

    if (users[user] === undefined) {
        users[user] = '/home';
    }

    if (directory[0] != '/') {
        users[user] = users[user] + '/' + directory;
    }

    else {
        users[user] = directory;
    }

    logger.info(user + " changed their working directory to " + users[user]);
    res.json(users[user]);
});

logger.info('Listening on localhost:5001');
app.listen(5001);
