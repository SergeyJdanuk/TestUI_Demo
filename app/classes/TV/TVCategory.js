/**
 * Created by sergiyjdanuk on 7/28/15.
 */
var TVCategory = Backbone.Model.extend({
    defaults: {
        color: "",
        id: 0,
        name: "",
        channels: null,

        icon: null
    },
    getChannels: function () {
        return this.attributes.channels;
    },
    getName: function () {
        return this.attributes.name;
    },
    getId: function () {
        return this.attributes.id;
    },
    getIcon: function () {
        return this.attributes.icon;
    }
});
