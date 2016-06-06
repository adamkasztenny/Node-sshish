// thanks to https://docs.nodejitsu.com/articles/intermediate/how-to-log/
// for the heads up about this library. It's great!

var winston = require('winston');

// and thaks to https://github.com/winstonjs/winston#custom-log-format for this
var formatter = function(options) {
    return Date.now() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ?options.message : '');
};

var setup = function() {
    var logger = new (winston.Logger)({
        transports: [
            new winston.transports.Console({formatter: formatter}),
            new winston.transports.File({ filename: 'logs/logfile.log' }, {formatter: formatter}, {prettyPrint: true}, {maxsize: 10000000}),
        ],
        exceptionHandlers: [
            new winston.transports.Console({formatter: formatter}),
            new winston.transports.File({ filename: 'logs/exceptions.log' }, {formatter: formatter}, {prettyPrint: true}, {maxsize: 10000000})
        ]
    });

	module.exports.logger = logger;
};

module.exports.setup = setup;

