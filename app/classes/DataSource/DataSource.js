/**
 * @class DataSource
 * @extends Backbone.Model
 * @pattern Mediator
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/22/15 1:50 PM
 * @example
 * var ds = new DataSource();
 * ds.loadGenres().then(function (result) {
 *      console.log(result);
 * });
 */
var DataSource = AbstractDataSourceDriver.extend({
    initialize: function () {

    },

    /**
     * Create dual serial request. Создает двойной последовательный запрос.
     * 1-й запрос - получает данные с сервера Агрегатора,
     * 2-й запрос - получает данные с Кеша. Выполняется только тогда, когда 1-й вернул ошибку.
     * @param funcName
     * @param arguments
     * @returns {Promise}
     * @private
     */
    _createDualSerialRequest: function (funcName, args) {
        var promise = new Promise(function (resolve, reject) {
            // 1-й запрос - получает данные с сервера Агрегатора,
            var aggregatorDriver = DataSourceFactory.createAggregatorDriver();
            aggregatorDriver[funcName].apply(aggregatorDriver,args).then(
                resolve,
                function error() {
                    // 2-й запрос - получает данные с Кеша,
                    var cacheDriver = DataSourceFactory.createCacheDriver();
                    cacheDriver[funcName].apply(cacheDriver,args).then(resolve, reject);
                }
            );

        });
        return promise;
    },
    loadGenres: function () {
        return this._createDualSerialRequest('loadGenres', arguments);
    },
    loadMovies: function (offset, limit) {
        throw 'must be implement';
    },
    loadMoviesByGenre: function (genre, offset, limit) {
        return this._createDualSerialRequest('loadMoviesByGenre', arguments);
    },
    loadMovie: function (movie) {
        var promise = this._createDualSerialRequest('loadMovie', arguments);
        promise.then(function (info) {
            movie.set(info.toJSON());
        });
        return promise;
    },
    loadMovieRelations: function (movie, offset, limit) {
        var promise = this._createDualSerialRequest('loadMovieRelations', arguments);
        return promise;
    },
    loadPerson: function () {
        var promise = this._createDualSerialRequest('loadPerson', arguments);
        return promise;
    },
    loadMoviesByPerson: function(person){
        var promise = this._createDualSerialRequest('loadMoviesByPerson', arguments);
        return promise;
    }
});