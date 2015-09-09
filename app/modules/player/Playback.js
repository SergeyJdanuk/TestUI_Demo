/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/8/15 5:56 PM
 * 
 * History  : 
 */

/**
 * @class Playback
 * @extends Backbone.Model
 * @desc Abstract playback class
 */
var Playback = Backbone.Model.extend({
    defaults: {
        image: '',
        title: '',
        description: '',
        duration: 0,
        begin_time: 0,
        end_time: 0,
        hasControls: false,
        isLive: false,
        type: '',
        url: '',
        onNext: false,
        onPrev: false,
        onSeek: false,
        onEnd: false,
        action: undefined
    },

    seconds: 0,
    _state: '',
    _playback_begin_time: 0,

    /**
     * Initialize
     * @constructor
     * @memberof Player#
     */
    initialize: function () {
        throw 'You must implement the function in extend class';
    },

    _validateDuration: function() {
        if (this.getDuration() > 0)
            return true;

        if (this.getDuration() == 0)
        {
            var begin = this.getBeginTime();
            var end = this.getEndTime();
            var duration = end - begin;

            if (begin == 0 || end == 0)
                return false;

            if (begin > 0 && end > 0)
                this.setDuration(duration);
        }
        return true;
    },

    create: function() {
        this.trigger('create');
    },

    /**
     * Destroy
     */
    destroy: function() {
        throw 'You must implement the function in extend class';
    },

    play: function () {
        throw 'You must implement the function in extend class'
    },
    stop: function () {
        throw 'You must implement the function in extend class'
    },
    pause: function () {
        throw 'You must implement the function in extend class'
    },
    resume: function () {
        throw 'You must implement the function in extend class'
    },
    forward: function () {
        throw 'You must implement the function in extend class'
    },
    rewind: function () {
        throw 'You must implement the function in extend class'
    },
    next: function () {
        throw 'You must implement the function in extend class'
    },
    prev: function () {
        throw 'You must implement the function in extend class'
    },
    isPlaying: function() {
        return this._state == 'playing';
    },
    isStopped: function() {
        return this._state == 'stopped';
    },
    isPaused: function() {
        return this._state == 'paused';
    },
    getSecondsPosition: function() {
        return this.seconds;
    },
    getPercentPosition: function() {
        return parseInt(this.seconds * 100 / (this.getDuration()), 10);
    },
    getTitle: function () {
        return this.attributes.title;
    },
    getImage: function () {
        return this.attributes.image;
    },
    getDescription: function () {
        return this.attributes.description;
    },
    getDuration: function () {
        return this.attributes.duration;
    },
    setDuration: function (duration) {
        if (!duration)
            return;
        return this.set('duration', duration);
    },
    getBeginTime: function () {
        return this.attributes.begin_time;
    },
    getEndTime: function () {
        return this.attributes.end_time;
    },
    hasControls: function () {
        return this.attributes.hasControls;
    },
    isLive: function () {
        return this.attributes.isLive;
    },
    getMediaUrl: function () {
        return this.attributes.url;
    },
    getPlaybackBeginTime: function() {
        var now = (+new Date());
        return  now - this._playback_begin_time;
    },
    setPlaybackBeginTime: function(time) {
        this._playback_begin_time = time ? time : +new Date();
    },
    getPosition: function () {
        return this.seconds;
    },
    getType: function () {
        return this.attributes.type;
    },
    setUrl: function (url) {
        this.set('url', url);
        this.silentPlayUrl(url);
    },
    silentPlayUrl: function() {}
});