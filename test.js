"use strict";
var fs = require('fs'),
    jsYaml = require('js-yaml'),
    ANSIBLE_SCHEMA = require('./ansible').ANSIBLE_SCHEMA;

const FILE_IN = "input.yml",
    FILE_OUT = "output.yml";

var res = jsYaml.load(fs.readFileSync(FILE_IN, "utf8"), { schema: ANSIBLE_SCHEMA });

console.log(res);

var vfd = fs.openSync(FILE_OUT, "w");
fs.writeSync(vfd, jsYaml.dump(res, { schema: ANSIBLE_SCHEMA }), null, "utf8");
fs.closeSync(vfd);
