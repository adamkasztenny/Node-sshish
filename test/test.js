var http = require('http');
var should = require('should');

var server = require('../src/server/index.js');

describe('Server Tests', function() { // thanks to http://stackoverflow.com/questions/12030670/trying-to-test-a-node-js-server-process-using-mocha
	
	it("Should send the index.html page", function(done) {
		http.get("http://localhost:5001/", function(res) {
			res.statusCode.should.equal(200);
			res.headers['content-type'].should.equal('text/html; charset=UTF-8');
			res.headers['content-length'].should.equal('995');
			done();
		});
	});
});
