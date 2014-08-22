define([
    'backbone',
], function( Backbone ) {
    var model = Backbone.Model.extend({
    });

    var collection = Backbone.Collection.extend({
            url: 'assets/json/people.json'
    });

    return {
        Model: model,
        Collection: collection
    };
});
