#!/usr/bin/env node

'use strict';

var Provider = require('../src/index.js');

var provider = new Provider();

provider.on('error', function (error) {
    console.log('Error:', error);
});

provider.on('temperature', function (temperature) {
    console.log('Temperature:', temperature);
});

provider.start();

setTimeout(function () {
    provider.stop();
}, 5000);