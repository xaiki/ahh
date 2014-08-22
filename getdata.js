var request = require('request')
,    fs = require ('fs')
,moment = require ('moment').locale('es')
;

var personas = {};
['Alejandro_Ulla',
 'Alfredo Elías Kohon',
 'Carlos_Alberto_del_Rey',
 'Carlos Heriberto Astudillo',
 'Clarisa_Lea_Place',
 'Eduardo_Capello',
 'Humberto_Su%C3%A1rez',
 'Humberto_Toschi',
 'Jos%C3%A9_Ricardo_Mena',
 'Mar%C3%ADa_Ang%C3%A9lica_Sabelli',
 'Mariano_Pujadas',
 'Mario_Emilio_Delfino',
 'Miguel_%C3%81ngel_Polti',
 'Rub%C3%A9n_Pedro_Bonnet',
 'Susana Graciela Lesgart',
 'Alberto_Miguel_Camps',
 'Mar%C3%ADa_Antonia_Berger',
 'Ricardo_Ren%C3%A9_Haidare'].forEach (function (u) {
         request.get({json:true, url:'http://es.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=' + u}, function (e, r, d) {
//                   console.log(d.query.normalized[0].to);
                   for (var prop in d.query.pages) {
                       try {
                           var v = d.query.pages[prop].revisions
                           if (v) {
                                   var x = v.pop()['*'];

                                   fs.writeFileSync('data/' + u.replace(/\s/g, '-') + '.txt', x);
                               var m = x.match(/#REDIRECCIÓN \[\[(.*)\]\]/);
                               if (m) 
                                   console.log (m[1])
                           }
                       } catch (e) {
                           console.error (e, d);
                       }
                   }
               });
 });
