/**
 * @class VODMovies
 * @extend Backbone.Collection
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/22/15 4:10 PM
 * 
 */
var VODMovies = Backbone.Collection.extend({
  model: VODMovie,
  initialize: function (moviesArray) {
    this._selectedMovieIndex = null;
    this._total = 0; // Общее колличество фильмов
    this._genre = null;
  },
  setGenre: function (genre) {
    this._genre = genre;
  },
  getGenre: function () {
    return this._genre;
  },
  setSelectedMovieIndex: function (index) {
    var oldIndex = this._selectedMovieIndex;

    if (index >= this.length)
      index = this.length-1;

    var near = 20;
    if (near >= this.getCountMovies() - this.getSelectedMovieIndex() ) {
      var genre = this.getGenre();
      if (genre)
        genre.loadMovieChunk();
    }

    var movie = this.at(index);

    if (!movie)
      return;

    if (oldIndex != null) {
      var oldSelectedMovie = this.at(this._selectedMovieIndex);
      if (oldSelectedMovie)
        oldSelectedMovie.unselect();
    }

    movie.select();
    this._selectedMovieIndex = index;
  },

  getSelectedMovieIndex: function () {
    return this._selectedMovieIndex;
  },

  getSelectedMovie: function () {
    return this.at(this._selectedMovieIndex);
  },

  getSelected: function () {
    return this.getSelectedMovie();
  },

  getTotalMovies: function () {
    return this._total;
  },

  setTotalMovies: function (total) {
    this._total = total;
  },
  getCountMovies: function () {
    return this.models.length;
  },
  selectNextItem: function () {
    var index = this.getSelectedMovieIndex();
    this.setSelectedMovieIndex(index+1);
  },
  selectPrevItem: function () {
    var index = this.getSelectedMovieIndex();
    this.setSelectedMovieIndex(index-1);
  },
  selectItem: function (index) {
    this.setSelectedMovieIndex(index);
  }
});