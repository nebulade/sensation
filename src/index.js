'use strict';

var exec = require('child_process').exec,
    S = require('string'),
    util = require('util'),
    events = require('events');

module.exports = exports = LMSensorsProvider;

function LMSensorsProvider() {
    events.EventEmitter.call(this);
    this._interval = null;
}
util.inherits(LMSensorsProvider, events.EventEmitter);

LMSensorsProvider.prototype.start = function (interval) {
    var that = this;

    this._interval = setInterval(function () {
        that.fetchData();
    }, interval || 1000);
};

LMSensorsProvider.prototype.stop = function () {
    if (!this._interval) return;

    clearInterval(this._interval);
};

LMSensorsProvider.prototype.fetchData = function () {
    var that = this;

    var child = exec('sensors', function (error, stdout, stderr) {
        if (error) {
            that.emit('error', error);
            return;
        }

        var temperature;

        var lines = S(stdout).lines();
        lines.forEach(function (line) {
            if (line.indexOf('Core') !== 0) return;
            var pattern = new RegExp(/\+[0-9]*\.[0-9]*/);
            var match = line.match(pattern);

            if (!match) return;

            temperature = match[0];
        });

        if (!temperature) {
            that.emit('error', new Error('No temperature data found.'));
            return;
        }

        that.emit('temperature', temperature);
    });
};
