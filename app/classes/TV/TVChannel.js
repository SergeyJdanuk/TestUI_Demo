/**
 * Created by sergiyjdanuk on 7/28/15.
 */

var TVChannel = Backbone.Model.extend({
    defaults: {
        epg_end: 0,
        epg_progname: "",
        epg_start: 0,
        have_archive: 0,
        hide: 0,
        icon: "",
        id: 0,
        is_video: 0,
        name: "",

        number: -1
    },
    getName: function () {
        return this.attributes.name;
    },
    getId: function () {
        return this.attributes.id;
    },
    getNumber: function () {
        return this.attributes.number;
    }
});