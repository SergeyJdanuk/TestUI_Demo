/**
 * @class PlaybackInfo
 * @extends Backbone.Model
 * @desc Current playing movie model.
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/21/15 10:35 AM
 *
 *
 * @example
 *
 * // a selected movie for play
 * var movie = new VODMovie();
 *
 * var info = new PlaybackInfo(movie.toJSON());
 *
 * if (info.isMovie()) {
 *     info.getModel().getName(); // returns name of movie
 * }
 * if (info.isChannel()) {
 *     info.getModel().getName(); // returns name of channel
 * }
 */
var PlaybackInfo = Backbone.Model.extend({
    defaults: {
        type: '',
        model: null
    },

    setType: function (type) {
        return this.set('type', type);
    },

    getType: function () {
        return this.get('type');
    },

    getModel: function () {
        return this.get('model');
    }
});