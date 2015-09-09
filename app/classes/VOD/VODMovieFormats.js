/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/27/15 5:17 PM
 * 
 * History  : 
 */
var VODMovieFormats = List.Collection.extend({
    model: VODMovieFormat,
    initialize: function () {
        this._selectedIndex = 0;
    },
    getSelectedIndex: function () {
        return this._selectedIndex;
    },
    setSelectedIndex: function (index) {
        var oldIndex = this._selectedIndex;

        if (index >= this.length)
          index = this.length-1;

        var item = this.at(index);

        if (!item)
          return;

        if (oldIndex != null) {
          var oldSelectedItem = this.at(this._selectedIndex);
          if (oldSelectedItem)
            oldSelectedItem.unselect();
        }

        item.select();
        this._selectedIndex = index;
    },
    getSelected: function () {
        var i = this.at(this.getSelectedIndex());
        if (i.hasChildren()) {
            var c = i.getChildren();
            return c.getSelected();
        }
        return i;
    }
});