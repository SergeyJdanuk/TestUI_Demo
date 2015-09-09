/**
 * @class AbstractView
 * @namespace Grid
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/23/15 4:05 PM
 * 
 * History  : 
 */
Grid.AbstractView = Backbone.View.extend({
    initialize: function () {},
    render: function () {},
    focusIn: function () {
        this.model.focusIn();
    },
    focusOut: function () {
        this.model.focusOut();
    }
});