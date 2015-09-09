/**
 * @class AbstractModel
 * @namespace Grid
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/23/15 4:05 PM
 * 
 * History  : 
 */
Grid.AbstractModel = Backbone.Model.extend({
    defaults: {
        collection: null,
        selectedIndex: null,
        focused: false,
        colsCount: 4,
        rowsCount: 3,
        beginVisibleIndex: 0,
        endVisibleIndex: 0
    },
    initialize: function () {},
    focusIn: function () {
        this.set('focused', true);
    },
    focusOut: function () {
        this.set('focused', false);
    },
    getSelectedIndex: function () {
        return this.attributes.selectedIndex;
    },
    setSelectedIndex: function (index) {
        this.set('selectedIndex', index);
    },
    getCollection: function () {
        return this.attributes.collection;
    },
    getRowsCount: function () {
        return this.attributes.rowsCount;
    },
    getColsCount: function () {
        return this.attributes.colsCount;
    },
    getSelected: function () {
        return this.getCollection().getSelected();
    },
    getTotalRowsCount: function(){
        return Math.ceil(this.attributes.collection.length/this.getColsCount());
    }
});