/**
 * @class VODMovie
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/22/15 4:09 PM
 *
 * History  :
 */
var VODMovie = Backbone.Model.extend({
  defaults: {
    rating: {
        imdb: 0,
        kp: ''
    },
    description: {
      ru: '',
      en: ''
    },
    title: '',
    nativeTitle: '',
    img_thumbnail: '',
    img_poster: '',
    people: [],
    genres: [],
    duration: 0,
    hasRelations: false,
    imgThumbnail: '',
    imgPoster: '',



    country: "",
    dt_modify: "1900-01-01 00:00:00",
    genre_str: "",
    name: "",
    name_orig: "",
    pass_protect: false,
    poster: "",
    rate_mpaa: "",
    video_data: [],
    vis: "",
    year: "",
    film_id: "",
    title_ru: "",
    formats: new VODMovieFormats()

  },
  //@TODO перенестиэто в персоны
  CAREER_ACTOR: 0,
  CAREER_DIRECTOR: 1,
  CAREER_WRITER: 2,
  CAREER_PRODUCER: 3,
  CAREER_OPERATOR: 4,
  CAREER_EDITOR: 5,
  CAREER_DESIGN: 6,
  CAREER_COMPOSER: 7,

  initialize: function() {
    this._selectedProviderIndex = -1;
    this._isSelected = false;
    this._selectedFormatIndex = -1;
  },

  /**
   * Parse data
   * @param data
   * @returns {*}
   * @memberof Movie#
   */
  parse: function(data) {
    if (data.result)
      return data.result;
    return data;
  },

  /**
   * get id
   * @returns {*}
   * @memberof Movie#
   */
  getId: function() {
    return this.attributes.id;
  },

  /**
   * Get title
   * @returns {string}
   * @memberof Movie#
   */
  getTitle: function () {
    return this.attributes.title;
  },

  /**
   * Get original title
   * @returns {string}
   * @memberof Movie#
   */
  getOriginalTitle: function () {
    return this.attributes.nativeTitle;
  },

  /**
   * Get name
   * @returns {string}
   * @memberof Movie#
   */
  getName: function() {
    return this.attributes.title;
  },

  /**
   * Get original name
   * @returns {string}
   * @memberof Movie#
   */
  getOriginalName: function () {
    return this.attributes.nativeTitle;
  },

  /**
   * Check description
   * @returns {boolean}
   * @memberof Movie#
   */
  isDescription: function() {
    var description = this.attributes.description;
    var is_description = false;
    var keys = _.keys(description);

    _.each(keys, function (v, i) {
      if (!is_description && description[v] != '')
        is_description = true;
    });

    return is_description;
  },

  /**
   * Get all descriptions
   * @returns {Array}
   * @memberof Movie#
   */
  getDescriptions: function() {
    var description = this.attributes.description;
    var keys = _.keys(description);
    var descriptions = [];
    _.each(keys, function (v, i) {
      descriptions.push({
        description: description[v],
        language: v
      });
    });
    return descriptions;
  },

  /**
   * Get locale description
   * @returns {string}
   * @memberof Movie#
   */
  getDescription: function () {
    var d = this.attributes.description[App.I18n.code()];
    if (!d)
      return this.attributes.description['ru'];
    return d;
  },

  /**
   * Get imdb rating
   * @returns {string}
   * @memberof Movie#
   */
  getIMDBRating: function () {
    if (!this.attributes.rating.imdb)
      return 0;
    return this.attributes.rating.imdb;
  },

  /**
   * Get kinopoisk rating
   * @return {string}
   * @memberof Movie#
   */
  getKinopoiskRating: function() {
    return this.attributes.rating.kp;
  },

  /**
   * Check thumbnail
   * @returns {boolean}
   * @memberof Movie#
   */
  isThumbnail: function () {
    // Нужно всегда возвращать true, чтобы отображалась картинка-заглушка
    return true;
    // return this.attributes.imgThumbnail != '';
  },

  /**
   * Get thumbnail
   * @returns {string}
   * @memberof Movie#
   */
  getThumbnail: function () {
    if (!this.attributes.imgThumbnail)
      return this.getDummyThumbnail();
    return this.attributes.imgThumbnail;
  },

  /**
   * Get dummy thumbnail
   * @returns {string}
   * @memberof Movie#
   */
  getDummyThumbnail: function () {
    return 'img/common/no_thumbnail.jpg';
  },

  /**
   * Check poster
   * @returns {boolean}
   * @memberof Movie#
   */
  isPoster: function () {
    // Нужно всегда возвращать true, чтобы отображалась картинка-заглушка
    return true;
    // return this.attributes.imgPoster != '';
  },

  /**
   * Get poster
   * @returns {string}
   * @memberof Movie#
   */
  getPoster: function () {
    if (!this.attributes.imgPoster)
      return this.getDummyPoster();
    return this.attributes.imgPoster;
  },

  /**
   * Get dummy poster
   * @returns {string}
   * @memberof Movie#
   */
  getDummyPoster: function () {
    return 'img/common/no_poster.jpg';
  },

  /**
   * Get executors
   * @returns {Array}
   * @memberof Movie#
   */
  getExecutors: function () {
    return this.attributes.people;
  },

  /**
   * Get suppliers
   * @returns {Array}
   * @memberof Movie#
   */
  getSuppliers: function () {
    return this.attributes.suppliers;
  },

  /**
   * Check actors
   * @returns {boolean}
   * @memberof Movie#
   */
  isActors: function () {
    return this.getActors().length > 0;
  },

  /**
   * Get actors
   * @return {Array}
   * @memberof Movie#
   */
  getActors: function () {
    var self = this;
    return _.filter(this.attributes.people, function (v, i) {
      return v.type.indexOf(self.CAREER_ACTOR) != -1;
    });
  },

  /**
   * Get actors as as string
   * @returns {string}
   * @memberof Movie#
   */
  getActorsAsString: function () {
    var str = [];

    _.each(this.getActors(), function (v, i) {
      if (str.length > 4)
        return;
      str.push(v.name);
    });

    return str.join(', ');
  },
  getAllPeople: function(exclude){
    if(exclude === undefined){
      return this.attributes.people;
    }
    if(!_.isArray(exclude)){
      exclude = [exclude];
    }

    return _.filter(this.attributes.people, function (v, i) {
      return _.difference(v.type, exclude).length > 0;
    });
  },
  /**
   * Check producers
   * @returns {boolean}
   * @memberof Movie#
   */
  isProducers: function () {
    return this.getProducers().length > 0;
  },

  /**
   * Get producers
   * @return {Array}
   * @memberof Movie#
   */
  getProducers: function (count) {
    var self = this;
    var items = _.filter(this.attributes.people, function (v, i) {
      return v.type.indexOf(self.CAREER_PRODUCER) != -1;
    });
    if (_.isNumber(count)){
      items = _.first(items,count);
    }
    return items;
  },

  /**
   * Get producers as a string
   * @returns {string}
   * @memberof Movie#
   */
  getProducersAsString: function () {
    var str = [];

    _.each(this.getProducers(5), function (v, i) {
      str.push(v.name);
    });

    return str.join(', ');
  },

  /**
   * Check available writers
   * @returns {boolean}
   * @memberof Movie#
   */
  isWriters: function () {
    return this.getWriters().length > 0;
  },

  /**
   * Get writers
   * @return {Array}
   * @memberof Movie#
   */
  getWriters: function () {
    var self = this;
    return _.filter(this.attributes.people, function (v, i) {
      return v.type.indexOf(self.CAREER_WRITER) != -1;
    });
  },

  /**
   * Get writers as a string
   * @returns {string}
   * @memberof Movie#
   */
  getWritersAsString: function () {
    var str = [];

    _.each(this.getWriters(), function (v, i) {
      str.push(v.name);
    });

    return str.join(', ');
  },

  /**
   * Chech genres if exists
   * @returns {boolean}
   * @memberof Movie#
   */
  isGenres: function () {
    return this.getGenres().length > 0;
  },

  /**
   * Get genres
   * @returns {Array}
   * @memberof Movie#
   */
  getGenres: function () {
    return this.attributes.genres;
  },

  /**
   * Get genres as a string
   * @returns {string}
   * @memberof Movie#
   */
  getGenresAsString: function () {
    var str = [];

    _.each(this.getGenres(), function (v, i) {
      if (str.length > 4)
        return;
      str.push(v.name);
    });

    return str.join(', ');
  },

  /**
   * Get fotmat duration
   * @returns {string}
   * @memberof Movie#
   */
  getDurationFormat: function() {
    var duration = this.attributes.duration;

    if (duration <= 0)
      return '';

    var hours = parseInt(duration / 60);
    var minutes = duration % 60;

    if (hours == 0)
      return __(':minutes m', {minutes: minutes});

    minutes = (minutes < 10) ? '0' + minutes : minutes;

    return __(':hours h :minutes m', {hours: hours, minutes: minutes});
  },

  /**
   * Check exists relations
   * @returns {boolean|Movie.hasRelations|Function}
   * @memberof Movie#
   */
  hasRelations: function () {
    return this.attributes.hasRelations;
  },

  /**
   * Get relations
   * @returns {Promise}
   * @memberof Movie#
   */
  getRelations: function() {
    var ds = new DataSource();
    return ds.loadMovieRelations(this);
  },

  loadFormatsList: function () {
    var that = this;
    var promise = new Promise(function (resolve, reject) {

      if (that.attributes.formats.length) {
        resolve(that.attributes.formats);
        setTimeout(function () {
          that.trigger('load:end', 'formats');
        }, 0);
        return;
      }

      // TODO в будущем нужно удалить принудительную установку провайдера
      that.setSelectedProviderIndex(0);

      var provider = Provider(that.getSelectedProvider());

      that.trigger('load:begin', 'formats');
      provider.getFormats(that)
            .then(function success(result) {
                that.setFormats(result);
                that.trigger('load:end', 'formats');
                resolve(result);
              },function error() {
                that.trigger('load:error', 'formats');
                reject()
              });
    });

    promise.catch(function () { that.trigger('load:error', 'formats') });

    return promise;
  },


  /**
   * Get list of formats (Standard, Eco or Full HD)
   * @returns {Array}
   * @memberof Movie#
   */
  getFormats: function () {
    return this.get('formats');
  },

  /**
   * Set formats list
   * @param formats
   * @memberof Movie#
   */
  setFormats: function (formats) {
    this.set('formats', formats);
  },

  /**
   * Set selected provider index
   * @param index
   * @memberof Movie#
   */
  setSelectedProviderIndex: function (index) {
    this._selectedProviderIndex = index;
  },

  /**
   * Get selected provider index
   * @returns {*}
   * @memberof Movie#
   */
  getSelectedProviderIndex: function () {
    return this._selectedProviderIndex;
  },

  /**
   * Get selected provider
   * @returns {*}
   * @memberof Movie#
   */
  getSelectedProvider: function () {
    return this.attributes.suppliers[this.getSelectedProviderIndex()];
  },

  /**
   * Get media url
   * @returns {Promise}
   * @memberof Movie#
   */
  getMediaUrl: function () {
    var theMovie = this;
    var provider = Provider(this.getSelectedProvider());

    return new Promise(function (resolve, reject) {

      provider.getMovieMediaUrl(theMovie)
          .then(function success(result) {
            resolve(result);
          }, reject);

    });
  },

  /**
   * Play the movie
   * @returns {Promise}
   * @memberof Movie#
   */
  play: function () {
    // TODO в будущем нужно удалить принудительную установку провайдера
    this.setSelectedProviderIndex(0);

    var that = this;

    return new Promise(function (resolve, reject) {

      // Перед проигрываем видео, нужно проверить не пытаемся ли проиграть один и тот же фильм.
      // Поскольку в фильм может содержать несколько форматов (dvd, fullhd, hd)
      // поэтому необходимо сравнивать еще и конкретный формат видео

      // Получаем данные о фильме который сейчас проигрывается
      var playbackInfo = App.Player.getPlaybackInfo();

      if (playbackInfo) {
        if (playbackInfo.getType() == 'movie') {
          // получаем модель данных фильма что проигрывается
          var model = playbackInfo.getModel();

          // временный объект фильма для доступа методов к модели данных
          var movie = new VODMovie(model);

          // проверяем идентичность фильма
          var isThisMovie = (movie.getId() == that.getId());

          // проверяем идентичность формата видео
          var isSelectedFormatIndexIdentical = false;//(movie.getSelectedFormatIndex() == that.getSelectedFormatIndex());

          // выходим если пытаем проигрыть этот же фильм и такой же формат видео
          if (isThisMovie && isSelectedFormatIndexIdentical) {
            return resolve('current');
          }
        }
      }

      that.getMediaUrl()
          .then(
          function success(url) {

            App.createPlayback({
              url: url,
              title: that.getTitle(),
              description: that.getDescription(),
              image: that.getPoster(),
              hasControls: true,
              isLive: false && false,
              type: 'movie'
            }, that.toJSON());

            resolve();

          }, reject);
    });
  },

  getMovieInfo: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      var ds = new DataSource();
      ds.loadMovie(that).then(resolve, reject);
    });
  },

  select: function () {
    this._isSelected = true;
  },
  unselect: function () {
    this._isSelected = false;
  },
  isSelected: function () {
    return this._isSelected;
  }
});