/**
 * @class AggregatorDataSourceDriver
 * @extends AbstractDataSourceDriver
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/22/15 1:18 PM
 */
var AggregatorDataSourceDriver = AbstractDataSourceDriver.extend({
    _host: 'http://fp.dune-hd.com:5533',

    /**
     * Initialize
     * @memberof AggregatorDataSourceDriver#
     */
    initialize: function () {

    },

    /**
     * Get api genres url
     * @returns {string}
     * @private
     * @memberof AggregatorDataSourceDriver#
     */
    _getApiGenresUrl: function () {
        return this._host + '/genres';
    },

    /**
     * Get api movies by genre url
     * @param genre
     * @param page
     * @param limit
     * @private
     */
    _getApiMoviesByGenreUrl: function (genre, offset, limit) {
        var params = [
            'offset='+(offset ? offset : 0),
            'perPage='+(limit ? limit : 24)
        ];
        return this._host + '/moviesByGenre/'+genre.getId()+'?' + params.join('&');
    },

    /**
     * Get api movie url
     * @param genre
     * @param offset
     * @param limit
     * @returns {string}
     * @private
     */
    _getApiMovieUrl: function (movie) {
        return this._host + '/movie/'+movie.getId();
    },

    /**
     * Get api movie relations url
     * @param {VODMovie} movie
     * @returns {string}
     * @private
     */
    _getApiMovieRelationsUrl: function (movie) {
        return this._host + '/movieRelations/' + movie.getId();
    },
    /**
     * Get api movie relations url
     * @param {Executor} person
     * @returns {string}
     * @private
     */
    _getApiMoviesByPersonUrl: function (person) {
        return this._host + '/moviesByPerson/' + person.getId();
    },

    _getApiPersonUrl: function(person){
        return this._host + '/person/' + person.getId();
    },
    /**
     * Load genres
     * @returns {Promise}
     * @memberof AggregatorDataSourceDriver#
     */
    loadGenres: function () {
        var that = this;
        var promise =  new Promise(function (resolve, reject) {
            console.log('Loading genres... | AggregatorDataSourceDriver');
            $.ajax({
                url: that._getApiGenresUrl(),
                dataType: 'json',
                success: function(response) {
                    if (!response || !_.isArray(response.result)) {
                        console.log('Loading genres... error | AggregatorDataSourceDriver');
                        return reject();
                    }

                    var genres = _.map(response.result, function (v, i, a) {
                        return new VODGenre(v);
                    });

                    genres = _.filter(genres, function (v, i, a) {
                        return v.getTotalMovies() > 24;
                    });

                    var collection = new VODGenres(genres);

                    console.log('Loading genres... success | AggregatorDataSourceDriver');
                    resolve(collection);
                },
                error: function () {
                    console.log('Loading genres... error | AggregatorDataSourceDriver');
                    reject();
                }
            });
        });
        return promise;
    },

    loadMovies: function (offset, limit) {
        throw 'must be implement';
    },

    /**
     * Load movies be genre
     * @param genre
     * @param offset
     * @param limit
     * @returns {Promise}
     * @memberof AggregatorDataSourceDriver#
     */
    loadMoviesByGenre: function (genre, offset, limit) {
        var that = this;
        var promise =  new Promise(function (resolve, reject) {
            console.log('Loading movies in genre '+genre.getName()+'... | AggregatorDataSourceDriver');
            $.ajax({
                url: that._getApiMoviesByGenreUrl(genre, offset, limit),
                dataType: 'json',
                success: function(response) {
                    if (!response || !_.isArray(response.result)) {
                        console.log('Loading movies in genre '+genre.getName()+'... error | AggregatorDataSourceDriver');
                        return reject();
                    }

                    var genres = _.map(response.result, function (v, i, a) {
                        return new VODMovie(v);
                    });

                    var collection = new VODMovies(genres);

                    console.log('Loading movies in genre '+genre.getName()+'... success | AggregatorDataSourceDriver');
                    resolve(collection);
                },
                error: function () {
                    console.log('Loading movies in genre '+genre.getName()+'... error | AggregatorDataSourceDriver');
                    reject();
                }
            });
        });
        return promise;
    },

    /**
     * Load movie
     * @param movie
     * @returns {Promise}
     * @memberof AggregatorDataSourceDriver#
     */
    loadMovie: function (movie) {
        var that = this;
        console.log('Loading movie... | AggregatorDataSourceDriver');
        var promise =  new Promise(function (resolve, reject) {
            $.ajax({
                url: that._getApiMovieUrl(movie),
                dataType: 'json',
                success: function(response) {
                    if (!response || !_.isObject(response.result)) {
                        console.log('Loading movie... error | AggregatorDataSourceDriver');
                        return reject();
                    }
                    console.log('Loading movie... success| AggregatorDataSourceDriver');
                    resolve(new VODMovie(response.result));
                },
                error: function () {
                    console.log('Loading movie... error | AggregatorDataSourceDriver');
                    reject()
                }
            })
        });
        return promise;
    },
    loadPerson: function (person) {
        var that = this;
        console.log('Loading person... | AggregatorDataSourceDriver');
        var promise =  new Promise(function (resolve, reject) {
            $.ajax({
                url: that._getApiPersonUrl(person),
                dataType: 'json',
                success: function(response) {
                    if (!response || !_.isObject(response.result)) {
                        console.log('Loading person... error | AggregatorDataSourceDriver');
                        return reject();
                    }
                    console.log('Loading person... success| AggregatorDataSourceDriver');
                    resolve(new Executor(response.result));
                },
                error: function () {
                    console.log('Loading movie... error | AggregatorDataSourceDriver');
                    reject()
                }
            })
        });
        return promise;
    },

    /**
     * Load movie relations
     * @param {VODMovie} movie
     * @returns {*}
     */
    loadMovieRelations: function (movie) {
        var that = this;
        console.log('Loading movie relations ... | AggregatorDataSourceDriver');
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: that._getApiMovieRelationsUrl(movie),
                success: function (response) {
                    if (!response || !_.isArray(response.result)) {
                        console.log('Loading movies relations... error | AggregatorDataSourceDriver');
                        return reject();
                    }

                    var genres = _.map(response.result, function (v, i, a) {
                        return new VODMovie(v);
                    });

                    var collection = new VODMovies(genres);

                    console.log('Loading movie relations... success | AggregatorDataSourceDriver');
                    resolve(collection);
                },
                error: function () {
                    console.log('Loading movie relations...  error| AggregatorDataSourceDriver');
                    reject();
                }
            })
        });
        return promise;
    },
    /**
     * Load movie relations
     * @param {Executor} person
     * @returns {*}
     */
    loadMoviesByPerson: function (person) {
        var that = this;
        console.log('Loading movies by person movies ... | AggregatorDataSourceDriver');
        var promise = new Promise(function (resolve, reject) {
            $.ajax({
                url: that._getApiMoviesByPersonUrl(person),
                success: function (response) {
                    if (!response || !_.isArray(response.result)) {
                        console.log('Loading movies by person... error | AggregatorDataSourceDriver');
                        return reject();
                    }

                    var genres = _.map(response.result, function (v, i, a) {
                        return new VODMovie(v);
                    });

                    var collection = new VODMovies(genres);

                    console.log('Loading movies by person... success | AggregatorDataSourceDriver');
                    resolve(collection);
                },
                error: function () {
                    console.log('Loading movies by person...  error| AggregatorDataSourceDriver');
                    reject();
                }
            })
        });
        return promise;
    }
});