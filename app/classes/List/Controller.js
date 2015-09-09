/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/27/15 2:26 PM
 * 
 * History  : 
 */
List.Controller = Backbone.Model.extend({
    defaults: {
        model: null
    },
    initialize: function () {
        this.attributes.model.on('all', this._forwardEvent, this);
    },
    focusIn: function () {
        this.attributes.model.focusIn();
        this.trigger('change');
    },
    focusOut: function () {
        this.attributes.model.focusOut();
        this.trigger('change');
    },
    setCollection: function () {
        return this.attributes.model.setCollection.apply(this.attributes.model, arguments);
    },
    isEmpty: function () {
        return this.attributes.model.isEmpty();
    },
    getModel: function () {
        return this.attributes.model;
    },
    _forwardEvent: function () {
        return this.trigger.apply(this, arguments);
    }
});