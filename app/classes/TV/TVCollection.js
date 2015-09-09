/**
 * Created by sergiyjdanuk on 7/28/15.
 */
var TVCollection = Backbone.Collection.extend({
    initialize: function () {
        this._selectedIndex = -1;
    },
    getSelectedIndex: function () {
        return this._selectedIndex;
    },
    setSelectedIndex: function (index) {
        this._selectedIndex = index;
        this.trigger('select');
    }
});
