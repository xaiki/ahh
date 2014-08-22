define (['jquery', 'underscore', 'backbone',
         'models/person',
         'views/map'],
        function($, _, Backbone, Person, MapView) {
            var App = new Backbone.Marionette.Application();

            App.addRegions({
                mapRegion: '#map',
            });

            App.addInitializer(function(options){
                var col = new Person.Collection();
                col.fetch();

                var mapView    = new MapView ({collection: col});
                App.mapRegion.show(mapView);
            });

            return App;
        });
