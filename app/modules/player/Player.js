/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/8/15 6:02 PM
 * 
 * History  : 
 */

/**
 * @class PlayerModule
 * @desc A player module
 * @extends Backbone.Events
 */
App.module("Player", function (Player, App, Backbone, Marionette, Zepto, _) {
    _.extend(this, Backbone.Events);

    // Playback driver
    var playback = null;

    var playbackInfo = null;

    /**
     * Callback calls when module has started
     * @memberof PlayerModule#
     */
    this.onStart = function () {
        if (playback)
            playback.off();

        playback = this.createPlayback(null, false);

        playback.on('all', this._playbackEvent, this);
    };

    /**
     * Register function
     * @param obj
     * @param playback
     * @param func_name
     * @memberof PlayerModule#
     * @private
     */
    function registerFunction(obj, playback, func_name) {
        obj[func_name] = function() {
            return playback[func_name].apply(playback, arguments);
        }
    }

    /**
     * Playback event callback
     * @param name
     * @param args
     * @returns {*}
     * @private
     * @memberof PlayerModule#
     */
    this._playbackEvent = function (name, args) {
        //console.log('[PlaybackEvent] '+name, args);
        return this.trigger(name, args);
    };

    /**
     * Create playback
     * @param {object} params - {url,title,description,image,hasControls,isLive}
     * @returns {FakePlayback|DunePlayback}
     * @memberof PlayerModule#
     */
    this.createPlayback = function (params, information) {

        if (params && params.action == 'update') {
            return playback.setUrl(params.url);

        }

        if (playback) {
            playback.destroy();
            playback.off('all', this._playbackEvent, this);
        }

        playback = new DunePlayback(params);

        registerFunction(this, playback, 'play');
        registerFunction(this, playback, 'stop');
        registerFunction(this, playback, 'pause');
        registerFunction(this, playback, 'resume');
        registerFunction(this, playback, 'forward');
        registerFunction(this, playback, 'rewind');
        registerFunction(this, playback, 'next');
        registerFunction(this, playback, 'prev');

        registerFunction(this, playback, 'isPlaying');
        registerFunction(this, playback, 'isStopped');
        registerFunction(this, playback, 'isPaused');

        registerFunction(this, playback, 'getSecondsPosition');
        registerFunction(this, playback, 'getPercentPosition');

        registerFunction(this, playback, 'getTitle');
        registerFunction(this, playback, 'getImage');
        registerFunction(this, playback, 'getDescription');
        registerFunction(this, playback, 'getDuration');
        registerFunction(this, playback, 'getBeginTime');
        registerFunction(this, playback, 'getEndTime');
        registerFunction(this, playback, 'hasControls');
        registerFunction(this, playback, 'isLive');
        registerFunction(this, playback, 'getPlaybackBeginTime');
        registerFunction(this, playback, 'getPosition');
        registerFunction(this, playback, 'setUrl');

        playback.on('all', this._playbackEvent, this);

        this.setPlaybackInfo (information, playback.getType());

        playback.create();

        setTimeout( function() {
            if (information !== false)
                playback.play();
        }, 1);

        return playback;
    };

    this.setPlaybackInfo = function (info, type) {
        playbackInfo = new PlaybackInfo({model: info, type: type});
    };

    this.getPlaybackInfo = function () {
        return playbackInfo;
    };
});