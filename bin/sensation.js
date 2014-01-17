#!/usr/bin/env node

'use strict';

var Provider = require('../src/index.js'),
    request = require('superagent'),
    debug = require('debug'),
    p = require('commander');

p.version('0.1.0')
    .usage('<subcommand> [options]')
    .option('-i --interval <seconds>', 'Define the value gather interval. [1 second]\n')
    .option('print', 'Print the sensor value on the terminal. [default]')
    .option('publish <url>', 'Publish (POST) the sensor value to a server.')
    .parse(process.argv);

var provider = new Provider();

provider.on('error', function (error) {
    console.log('Error:', error);
});

provider.on('temperature', function (temperature) {
    var that = this;

    if (p.publish) {
        request.post(p.publish).send({ temperature: temperature }).end(function (error, result) {
            if (error || !result.ok) {
                console.log('Error publishing sensor value.', error || result);
                return;
            }

            console.log('Temperature %s pushed to %s.', temperature, p.publish);
        });
    } else {
        console.log('Temperature:', temperature);
    }
});

provider.start((1000*p.interval) || 1000);
