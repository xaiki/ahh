var  fs = require ('fs')
,moment = require ('moment')
,     _ = require ('underscore')
, debug = require ('debug')('extract')
;

moment.locale('es');

process.argv.shift();
process.argv.shift();

var outDir = process.argv.shift();

process.argv.forEach (function (arg) {
        fs.readFile(arg, function (err, data) {
                debug ("reading", arg);

                data = data.toString();

                var ficha = '';
                var r = /\{\{Ficha de persona[\s\S]+?\n\}\}/g;

                var facts = {};
                var match = r.exec(data);
                if (match) {
                        match[0].split('\n|').forEach(function (l) {
                                var d = l.split (/\s+=\s+/);
                                if (d[1])
                                        facts[d[0]] = d[1].replace(/\s*$/, '');
                        });
                }

                var meses = '(?:' + moment.months().join ('|') + ')';
                var diames= '[0-9]+ de ' + meses;
                var ano   = '[0-9]+';
                var fecha = diames + ' del? ' + ano;
                var wikifecha = '[[' + diames + ']] del? [[' + ano + ']]';
                var nopto = '[^\.\n]+';

                r = new RegExp (wikifecha, 'gi');
                data = data.replace(r, function (match) {
                        return match.replace (/\[\[|\]\]/gi, '');
                });

                r = new RegExp(nopto + fecha + nopto +'\.', 'gi');
                var ret = {};
                data.match(r).forEach (function (m) {

                        r = new RegExp('([0-9]+) de (' + meses + ') del? ([0-9]+)' , 'gi');
                        var match = r.exec (m);
                        var key = moment(match[3]+'-'+match[2]+'-'+match[1], 'YYYY-MMM-D');
                        ret[key.unix()] = m;
                });

                var nombre = facts.nombre ? facts.nombre.replace (/\s/g, '-'):arg.replace('.txt', '').replace(/.*\//, '');
                var out = outDir + nombre + '.json';
                debug ('writting', out);
                fs.writeFileSync (out, JSON.stringify({facts: facts, dates: ret}));

        });
});
