/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/23/15 4:27 PM
 * 
 * History  : 
 */
Grid.MoviesModel = Grid.AbstractModel.extend({
    initialize: function () {
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
        var selectedIndex = collection.getSelectedMovieIndex();
        if ((selectedIndex+1) % this.getColsCount() == 0) {
            this.trigger('outside:right');
            return;
        }
        collection.selectNextItem();
        this.trigger('update');
    },
    _keyLeft: function () {
        var collection = this.attributes.collection;
        var selectedIndex = collection.getSelectedMovieIndex();
        if (selectedIndex % this.getColsCount() == 0) {
            this.trigger('outside:left');
            return;
        }
        collection.selectPrevItem();
        this.trigger('update');
    },
    _keyDown: function () {
        var collection = this.attributes.collection;
        var index = collection.getSelectedMovieIndex() + this.getColsCount();

        collection.selectItem(index);

        if (this.shouldUpdateVisibleIndex(1)){
            this.attributes.beginVisibleIndex += this.getColsCount();
        }

        this.trigger('update');
    },
    _keyUp: function () {
        var collection = this.attributes.collection;
        var index = collection.getSelectedMovieIndex() - this.getColsCount();

        if (index < 0)
            return;

        collection.selectItem(index);

        if (this.shouldUpdateVisibleIndex(-1)) {
            this.attributes.beginVisibleIndex -= this.getColsCount();
            if (this.attributes.beginVisibleIndex < 0)
                this.attributes.beginVisibleIndex = 0;
        }

        this.trigger('update');
    },
    _keyEnter: function () {
        this.trigger('enter');
    },
    getCount: function () {
        return this.attributes.collection.length;
    },
    /**
     * @param {int} direction // -1 or 1
     * @returns {boolean}
     */
    shouldUpdateVisibleIndex: function (direction) {
        var collection = this.attributes.collection;
        var row = Math.ceil((collection.getSelectedMovieIndex() + 1) / this.getColsCount());
        var totalRows = this.getTotalRowsCount();

        return (direction > 0 && row !== totalRows && row !== 2) //down
            || (direction < 0 && row !== 1 && row !== totalRows - 1); //up
    },
    getCollectionItemByIndex: function (index) {
        return this.attributes.collection.at(index);
    },
    getBeginVisibleIndex: function () {
        return this.attributes.beginVisibleIndex;
    },
    getEndVisibleIndex: function () {
        var countItemsOnPage = this.getRowsCount() * this.getColsCount();
        var countMovies = this.attributes.collection.getCountMovies();
        var endVisibleIndex = this.attributes.endVisibleIndex;
        var beginVisibleIndex = this.attributes.beginVisibleIndex;

        if (beginVisibleIndex + countItemsOnPage > countMovies) {
            endVisibleIndex = countMovies;
        }
        else{
            endVisibleIndex = beginVisibleIndex + countItemsOnPage;
        }

        this.attributes.endVisibleIndex = endVisibleIndex;

        return endVisibleIndex;
    },
    getSelectedItem: function () {
        return this.attributes.collection.getSelectedMovie()
    },
    setSelectedIndex: function (index) {
        return this.attributes.collection.setSelectedMovieIndex(index);
    },
    destroy: function () {
        this._unsubscribe();
    },
    isFocused: function () {
        return this.attributes.focused == true;
    }
});