/**
 * @date 8/18/15 4:03 PM
 */
App.module("TV", function (TV, App, Backbone, Marionette, $, _) {

    var categories = new TVCategories();
    var ready = false;
    var promise = null;

    TV.getCategories = function () {
        return categories;
    };

    TV.isReady = function () {
        return ready;
    };

    TV.ready = function () {
        return !ready
            ? promise
            : Promise.resolve();
    };

    TV.on('start', function () {
        promise = categories.fetch().then(function () {
            ready = true;
        });
    });
});