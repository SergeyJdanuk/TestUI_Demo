/**
 * @class AbstractDriver
 * @extend Backbone.Model
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/20/15 2:39 PM
 * 
 * History  :
 *
 */
var AbstractDriver = Backbone.Model.extend({

    defaults: {
        name: '',
        movieId: '',
        id: ''
    },

    /**
     * Initialize
     * @memberof AbstractDriver#
     */
    initialize: function () {

    },

    /**
     * Get provider name
     * @memberof AbstractDriver#
     */
    getName: function () { return this.attributes.name },
    getId: function () { return this.attributes.id },
    getMovieId: function () { return this.attributes.movieId },

    getMovieMediaUrl: function () { throw 'must be implemented in extend class' },
    getChannels: function () { throw 'must be implemented in extend class' }
});