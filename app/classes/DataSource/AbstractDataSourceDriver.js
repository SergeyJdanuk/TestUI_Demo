/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/22/15 1:19 PM
 * 
 * History  : 
 */
var AbstractDataSourceDriver = Backbone.Model.extend({

    initialize: function () {
        throw 'method must be implement in extended class'
    },
    loadGenres: function () {
        throw 'method must be implement in extended class'
    },
    loadMovies: function (offset, limit) {
        throw 'method must be implement in extended class'
    },
    loadMoviesByGenre: function (genre, offset, limit) {
        throw 'method must be implement in extended class'
    },
    loadMovie: function (movie) {
        throw 'method must be implement in extended class'
    },
    loadMovieRelations: function (movie, offset, limit) {
        throw 'method must be implement in extended class'
    },
    loadPerson: function () {
        throw 'method must be implement in extended class'
    }
});