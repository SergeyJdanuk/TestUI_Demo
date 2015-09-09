/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/27/15 2:44 PM
 * 
 * History  : 
 */
List.Collection = Backbone.Collection.extend({
    model: List.CollectionItem,
    initialize: function (itemsArray) {
        this._selectedIndex = -1;
    },
    getCount: function () {
        return this.length;
    },
    getSelectedIndex: function () {
        return this._selectedIndex;
    },
    setSelectedIndex: function (index) {
        return this.selectItem(index);
    },
    selectItem: function (index) {
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
    getSelectedItem: function () {
        return this.at(this.getSelectedIndex());
    }
});