var fs = require('fs');


process.argv.shift();
process.argv.shift();

var arg = process.argv.shift();
var out = process.argv.shift();

var ret = [];
fs.readdirSync(arg)
        .filter(function(file) {
                return (file.indexOf('.') !== 0) && (file !== 'load.js');
        })
        .forEach(function(file) {
                ret.push(require('./' + arg + '/' + file));
        });
fs.writeFileSync (out, JSON.stringify(ret));

