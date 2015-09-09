/**
 * @class CacheDataSourceDriver
 * @extends AbstractDataSourceDriver
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/22/15 1:18 PM
 */
var CacheDataSourceDriver = AbstractDataSourceDriver.extend({
    initialize: function () {},

    /**
     * Load genres
     * @returns {Promise}
     * @memberof CacheDataSourceDriver#
     */
    loadGenres: function () {
        var promise =  new Promise(function (resolve, reject) {
            console.log('Loading genres... | CacheDataSourceDriver');
            $.ajax({
                url: 'cache/genres.json',
                dataType: 'json',
                success: function(response) {
                    if (!response || !_.isArray(response.result)) {
                        console.log('Loading genres... error | CacheDataSourceDriver');
                        return reject();
                    }

                    var genres = _.map(response.result, function (v, i, a) {
                        return new VODGenre(v);
                    });

                    var collection = new VODGenres(genres);

                    console.log('Loading genres... success | CacheDataSourceDriver');
                    resolve(collection);
                },
                error: function() {
                    console.log('Loading genres... error | CacheDataSourceDriver');
                    reject()
                }
            })
        });
        return promise;
    },
    loadMovies: function (offset, limit) {
        throw 'must be implement';
    },

    /**
     * Load movies by genre
     * @param genre
     * @param offset
     * @param limit
     * @returns {Promise}
     * @memberof CacheDataSourceDriver#
     */
    loadMoviesByGenre: function (genre, offset, limit) {
        console.log('Loading movies in genre '+genre.getName()+'... | CacheDataSourceDriver');
        var promise =  new Promise(function (resolve, reject) {
            if (offset > 0)
                return resolve(new VODMovies());

            $.ajax({
                url: 'cache/genres-movies/'+genre.getId()+'.json',
                dataType: 'json',
                success: function(response) {
                    var genres = _.map(response.result, function (v, i, a) {
                        return new VODMovie(v);
                    });

                    var collection = new VODMovies(genres);

                    console.log('Loading movies in genre '+genre.getName()+'... success| CacheDataSourceDriver');
                    resolve(collection);
                },
                error: function () {
                    console.log('Loading movies in genre '+genre.getName()+'... error | CacheDataSourceDriver');
                    reject()
                }
            })
        });
        return promise;
    },

    /**
     * Load movie
     * @param movie
     * @returns {Promise}
     * @memberof CacheDataSourceDriver#
     */
    loadMovie: function (movie) {
        console.log('Loading movie '+movie.getName()+'... | CacheDataSourceDriver');
        var promise =  new Promise(function (resolve, reject) {
            $.ajax({
                url: 'cache/movies-metadata/'+movie.getId()+'.json',
                dataType: 'json',
                success: function(response) {
                    if (!response || !_.isObject(response.result)) {
                        console.log('Loading movie '+movie.getName()+'... error | CacheDataSourceDriver');
                        return reject();
                    }
                    console.log('Loading movie '+movie.getName()+'... success| CacheDataSourceDriver');
                    resolve(new VODMovie(response.result));
                },
                error: function () {
                    console.log('Loading movie '+movie.getName()+'... error | CacheDataSourceDriver');
                    reject()
                }
            })
        });
        return promise;
    },
    loadMovieRelations: function (movie, offset, limit) {
        var promise = new Promise(function (resolve, reject) {
            reject();
        });
        return promise;
    },
    loadPerson: function () {
        var promise = new Promise(function (resolve, reject) {
            reject();
        });
        return promise;
    }
});