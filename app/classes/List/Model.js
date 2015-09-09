/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/27/15 2:14 PM
 * 
 * History  : 
 */
List.Model = Backbone.Model.extend({
    defaults: {
        collection: null,
        focused: false,
        colsCount: 1,
        rowsCount: 3,
        visibleCount: 3,
        beginVisibleIndex: 0,
        endVisibleIndex: 0
    },
    initialize: function () {},
    getSelectedIndex: function () {
        return this.attributes.collection.getSelectedIndex();
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
    focusIn: function () {
        this.set('focused', true);
        this._subscribe();
        this.trigger('update');
    },
    focusOut: function () {
        this.set('focused', false);
        this._unsubscribe();
        this.trigger('update');
    },
    _subscribe: function () {
        keyboardObserver.on('Right', this._keyRight, this);
        keyboardObserver.on('Left', this._keyLeft, this);
        keyboardObserver.on('Down', this._keyDown, this);
        keyboardObserver.on('Up', this._keyUp, this);
        keyboardObserver.on('keyboardEnter', this._keyEnter, this);
    } ,
    _unsubscribe: function () {
        keyboardObserver.off('Right', this._keyRight, this);
        keyboardObserver.off('Left', this._keyLeft, this);
        keyboardObserver.off('Down', this._keyDown, this);
        keyboardObserver.off('Up', this._keyUp, this);
        keyboardObserver.off('keyboardEnter', this._keyEnter, this);
    },
    _keyRight: function () {
        var collection = this.attributes.collection;
        var selectedIndex = collection.getSelectedIndex();
        if ((selectedIndex+1) % this.getColsCount() == 0) {
            this.trigger('outside:right');
            return;
        }
        collection.selectNextItem();
        this.trigger('update');
    },
    _keyLeft: function () {
        var collection = this.attributes.collection;
        var selectedIndex = collection.getSelectedIndex();
        if (selectedIndex % this.getColsCount() == 0) {
            this.trigger('outside:left');
            return;
        }
        collection.selectPrevItem();
        this.trigger('update');
    },
    _keyDown: function () {
        var collection = this.attributes.collection;
        var beginVisibleIndex = this.attributes.beginVisibleIndex;
        var selectedIndex = collection.getSelectedIndex();
        var index = selectedIndex + this.getColsCount();

        collection.selectItem(index);

        var row = this.getCurrentRowIndex();

        if (row >= this.getRowsCount())
            this.attributes.beginVisibleIndex += this.getColsCount();

        this.trigger('keyDown');
        this.trigger('update');
    },
    _keyUp: function () {
        var collection = this.attributes.collection;
        var beginVisibleIndex = this.attributes.beginVisibleIndex;
        var index = collection.getSelectedIndex() - this.getColsCount();

        if (index < 0)
            return;

        collection.selectItem(index);

        var row = this.getCurrentRowIndex();

        if (row < 0) {
            this.attributes.beginVisibleIndex -= this.getColsCount();
            if (this.attributes.beginVisibleIndex < 0)
                this.attributes.beginVisibleIndex = 0;
        }

        this.trigger('keyUp');
        this.trigger('update');
    },
    _keyEnter: function () {
        this.trigger('enter', this.getSelectedItem());
    },
    getCount: function () {
        return this.attributes.collection.length;
    },
    getCurrentRowIndex: function () {
        var collection = this.attributes.collection;
        var selectedIndex = collection.getSelectedIndex();
        var cols = this.getColsCount();
        var selectedVisibleIndex = selectedIndex - this.getBeginVisibleIndex();
        var row = Math.floor(selectedVisibleIndex / cols);
        return row;
    },
    getCollectionItemByIndex: function (index) {
        return this.attributes.collection.at(index);
    },
    setBeginVisibleIndex: function (index) {
        this.attributes.beginVisibleIndex = index;
    },
    getBeginVisibleIndex: function () {
        return this.attributes.beginVisibleIndex;
    },
    getEndVisibleIndex: function () {
        var collection = this.attributes.collection;
        var countItemsOnPage = this.getRowsCount() * this.getColsCount();
        var countMovies = this.attributes.collection.getCount();
        var endVisibleIndex = this.attributes.endVisibleIndex;
        var beginVisibleIndex = this.attributes.beginVisibleIndex;

        if (beginVisibleIndex + countItemsOnPage > countMovies) {
            endVisibleIndex = countMovies;
        }
        else
            endVisibleIndex = beginVisibleIndex + countItemsOnPage;

        this.attributes.endVisibleIndex = endVisibleIndex;

        return endVisibleIndex;
    },
    getSelectedItem: function () {
        return this.attributes.collection.getSelectedItem()
    },
    setSelectedIndex: function (index) {
        return this.attributes.collection.setSelectedIndex(index);
    },
    destroy: function () {
        this._unsubscribe();
    },
    isFocused: function () {
        return this.attributes.focused == true;
    },
    getVisibleCount: function () {
        return this.attributes.visibleCount;
    },
    setCollection: function (collection) {
        return this.set('collection', collection);
    },
    isEmpty: function () {
        if (!this.attributes.collection)
            return true;
        return this.attributes.collection.length == 0;
    }
});