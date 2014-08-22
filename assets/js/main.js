require(['loading', 'app', 'vent',
         'jquery', 'underscore', 'backbone',
         'views/map'],
        function(loadQueue, App, Vent,
                 $, _, Backbone,
                 MapView) {

            loadQueue.on('complete', function () {
                    var $loading = $('.loading'),
	                $cover = $('.coverall');
                    $loading.fadeOut();
		    $cover.fadeOut();
                    App.start();
            });
})
