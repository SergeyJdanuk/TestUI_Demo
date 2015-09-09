/**
 * Created by sergiyjdanuk on 7/28/15.
 */
var TVCategories = TVCollection.extend({
    model: TVCategory,
    fetch: function () {
        return Provider.createKartinaTV()
            .getCategories()
            .then(_.bind(function(data) {
                this.setSelectedIndex(0);
                this.set(this.parse(data));
            }, this));
    },
    /**
     * Parse. Just add an icon keys in data.
     * @param data
     */
    parse: function (data) {
        return _.map(data, _.bind(function (v) {
            v.icon = this.getIconByCategoryId(v.id);
            return v;
        }, this));
    },
    getIconByCategoryId: function (id) {
        var icons = {
            1:  'img/epg/categories/general.png',
            3:  'img/epg/categories/cognitive.png',
            5:  "img/epg/categories/news.png",
            7:  "img/epg/categories/comedy.png",//развлекательные
            9:  "img/epg/categories/kids.png",
            11: "img/epg/categories/music.png",
            13: "img/epg/categories/comedy.png",
            15: "img/epg/categories/international.png",
            17: "img/epg/categories/sport.png",
            19: "img/epg/categories/movies.png",
            21: "img/epg/categories/erotic.png",
            23: 'img/epg/categories/music.png',//radio
            '-1': 'img/epg/categories/general.png' // favorite
        };
        return icons[id];
    }
});
