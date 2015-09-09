/**
 * @class VODGenre
 * @extends Backbone.Model
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/22/15 2:23 PM
 */
var VODGenre = Backbone.Model.extend({
  defaults: {
    id: '',
    name: '',
    movieCount: 0,
    ////////////////////////////////////////////////////////////////////////////
    movies: null,
    limit: 24
  },
  initialize: function () {

  },
  ICONS: {
    '55801023f26099b84dfc3d17': 'multfilm',
    '55801023f26099b84dfc3d1d': 'multfilm',
    '55801023f26099b84dfc3d1e': 'criminal',
    '55801023f26099b84dfc3d21': 'multfilm',
    '55801023f26099b84dfc3d24': 'videoclipy',
    '55801023f26099b84dfc3d2b': 'documental',
    '55801023f26099b84dfc3d2d': 'korotkometragka',
    '55801023f26099b84dfc3d30': 'videoclipy',
    '55801023f26099b84dfc3d34': 'documental',
    '55801023f26099b84dfc3d18': 'biographic',
    '55801023f26099b84dfc3d19': 'boevik',
    '55801023f26099b84dfc3d1a': 'vestern',
    '55801023f26099b84dfc3d1b': 'voennyj',
    '55801023f26099b84dfc3d1c': 'detektiv',
    '55801023f26099b84dfc3d1f': 'documental',
    '55801023f26099b84dfc3d20': 'drama',
    '55801023f26099b84dfc3d22': 'historycal',
    '55801023f26099b84dfc3d23': 'comedy',
    '55801023f26099b84dfc3d2a': 'musicalny',
    '55801023f26099b84dfc3d25': 'korotkometragka',
    '55801023f26099b84dfc3d26': 'criminal',
    '55801023f26099b84dfc3d27': 'melodrama',
    14: 'videoclipy',
    '55801023f26099b84dfc3d28': 'musicalny',
    '55801023f26099b84dfc3d29': 'multfilm',
    '55801023f26099b84dfc3d2c': 'prikluchenia',
    '55801023f26099b84dfc3d2e': 'semejnyj',
    19: 'serial',
    '55801023f26099b84dfc3d2f': 'sport',
    '55801023f26099b84dfc3d31': 'triller',
    '55801023f26099b84dfc3d32': 'uzhasy',
    '55801023f26099b84dfc3d33': 'fantastica',
    '55801024f26099b84dfc3d35': 'fantasy',
    25: 'kartina_TV'
  },
  get: function(attr) {
    if(attr === 'ico'){
      return this.ICONS[this.getId()];
    }else{
      return Backbone.Model.prototype.get.apply(this,arguments);
    }
  },
  parse: function(data) {
    return data;
  },
  getId: function() { return this.attributes.id; },
  getTitle: function() { return this.attributes.name; },
  getFilmsCount: function () {
    return this.attributes.movieCount;
  },

  /**
   * Get id
   * @returns {string}
   * @memberof VODGenre#
   */
  getId: function () {
      return this.attributes.id;
  },

  /**
   * Get name
   * @returns {string}
   * @memberof VODGenre#
   */
  getName: function () {
      return this.attributes.name;
  },

  /**
   * Get total movies
   * @returns {number}
   * @memberof VODGenre#
   */
  getTotalMovies: function () {
      return this.attributes.movieCount;
  },

  /**
   * Get movies
   * @param offset
   * @param limit
   * @returns {Promise}
   * @memberof VODGenre#
   */
  getMovies: function (offset, limit) {
      var that = this;
      var promise = new Promise(function (resolve, reject) {
          var ds = new DataSource();
          ds.loadMoviesByGenre(that, offset, limit).then(
              function success(movies) {
                  that.setMovies(movies);
                  resolve(movies);
              },reject);
      });
      return promise;
  },

  /**
   * Set movies
   * @param movies
   * @returns {*}
   * @memberof VODGenre#
   */
  setMovies: function (movies) {
      movies.setTotalMovies(this.getTotalMovies());
      movies.setGenre(this);
      return this.set('movies', movies);
  },
  appendMovies: function (movies) {
    this.attributes.movies.add(movies);
  },
  loadMovieChunk: function () {
    var that = this;
    var limit = this.attributes.limit;
    var offset = this.attributes.movies.length;
    var promise = new Promise(function (resolve, reject) {
        var ds = new DataSource();
        ds.loadMoviesByGenre(that, offset, limit).then(
            function success(movies) {
                that.appendMovies(movies.models);
                resolve(movies);
            },reject);
    });
    return promise;
  }
});