requirejs.config({
    baseUrl: 'assets/js',
    paths: {
        jquery: '../vendor/jquery/jquery.min',
        underscore: '../vendor/underscore/underscore',
        preloadjs: '../vendor/PreloadJS/lib/preloadjs-NEXT.min',
        d3: '../vendor/d3/d3.min',
        topojson: '../vendor/topojson/topojson',
        backbone: '../vendor/backbone/backbone-min',
        marionette: '../vendor/backbone.marionette/lib/backbone.marionette.min',
        wreqr: '../vendor/backbone.wreqr/lib/backbone.wreqr.min',

        /*gapi: 'https://apis.google.com/js/auth',
        superagent: 'http://cdnjs.cloudflare.com/ajax/libs/superagent/0.15.7/superagent.min'*/
    },
    shim: {
        preloadjs: { exports: 'createjs' },
        topojson: { exports: 'topojson' },
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        wreqr: {
            deps: ['backbone', 'marionette'],
            exports: 'Backbone.Wreqr'
        },
        marionette : {
            deps : ['jquery', 'underscore'],
            exports : 'Marionette'
        },
        /*gapi: { exports: 'gapi' }*/
    }
});

define([
    'jquery',
], function( $, io ) {

    window.loadCss = function (url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    };

    loadCss('/assets/vendor/font-awesome/css/font-awesome.min.css');

    // Start the main app logic.
    requirejs(['main']);
});


