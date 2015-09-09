/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/27/15 5:17 PM
 * 
 * History  : 
 */
var VODMovieFormat = List.CollectionItem.extend({
    defaults: {
        id: "",
        id_content: "",
        num: null,
        title: "",
        format: "",
        url: "",
        size: "",
        lenght: "",
        codec: "",
        width: "0",
        height: "0",
        track1_codec: "",
        track1_lang: "",
        track2_codec: null,
        track2_lang: null,
        track3_codec: null,
        track3_lang: null,

        hasChildren: false,
        children: []
    },
    initialize: function () {
        this._selected = false;
    },
    getId: function () {
        return this.attributes.id;
    },
    getTitle: function () {
        return this.attributes.title;
    },
    getFormat: function () {
        return this.attributes.format;
    },
    hasChildren: function () {
        return this.attributes.hasChildren;
    },
    addChild: function (format) {
        this.attributes.children.push(format);
    },
    getChildren: function () {
        return this.attributes.children;
    },
    setChildren: function (children) {
        return this.attributes.children = children;
    },
    select: function () {
        this._selected = true;
    },
    unselect: function () {
        this._selected = false;
    },
    isSelected: function () {
        return this._selected;
    }
});