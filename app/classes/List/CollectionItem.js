/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/27/15 2:46 PM
 * 
 * History  : 
 */
List.CollectionItem = Backbone.Model.extend({
    defaults: {
        title: ''
    },
    initialize: function() {
        this._isSelected = false;
    },
    getTitle: function () {
        return this.attributes.title;
    },
    isSelected: function () {
        return this._isSelected;
    },
    select: function () {
        this._isSelected = true;
    },
    unselect: function () {
        this._isSelected = false;
    }
});