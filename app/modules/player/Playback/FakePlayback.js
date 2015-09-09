/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/8/15 6:24 PM
 * 
 * History  : 
 */

/**
 * @class FakePlayback
 * @extends Playback
 */
var FakePlayback = Playback.extend({

    timer: 0,

    initialize: function (params) {
        this.set(params);

        if (!this._validateDuration())
            this.set('duration', 60);

        this._debouncedRewind= _.debounce(this._rewind,500);
        this._debouncedForward= _.debounce(this._forward,500);
    },

    destroy: function () {
        this.stop();
    },

    play: function () {
        if (this.isPlaying())
            this.stop();
        this._startPlayback(true);
    },
    stop: function () {
        if (this.isPlaying() || this.isPaused())
            this._stopPlayback(true);
    },
    pause: function () {
        if (!this.isPlaying())
            return;
        this._state = 'paused';
        this._stopPlayback(false);
        this.trigger('playback:pause');
    },
    resume: function () {
        if (!this.isPaused())
            return;
        this._startPlayback(false);
        this._state = 'playing';
        this.trigger('playback:resume');
    },
    forward: function (seconds) {
        this.seconds = seconds;
        this._debouncedForward(seconds);
    },
    rewind: function (seconds) {
        this.seconds = seconds;
        this._debouncedRewind(seconds);
    },
    next: function (seconds) {
        if (this.attributes.onNext) {
            this.attributes.onNext();
            return;
        }
        this.seconds = seconds;
    },
    prev: function (seconds) {
        if (this.attributes.onPrev) {
            this.attributes.onPrev();
            return;
        }
        this.seconds = seconds;
    },

    _startPlayback: function(isBegin) {
        var self = this;

        if (isBegin)
            this.seconds = 0;

        if (this.timer)
            clearInterval(this.timer);

        this.timer = setInterval(function() {
            if ( ++self.seconds >= self.getDuration() )
                self.stop();
            else
                self._playbackProcess();
        }, 1000);

        if (isBegin) {
            this._state = 'playing';
            this.setPlaybackBeginTime();
            this.trigger('playback:begin');
        }
    },

    _stopPlayback: function(isEnd) {
        clearInterval(this.timer);
        if (isEnd) {
            this._state = 'stopped';
            this.setPlaybackBeginTime(0);
            this.trigger('playback:end');
        }
    },

    _playbackProcess: function () {
        this.trigger('playback:process', this.seconds);
    },
    _rewind: function () {
        if (this.attributes.onSeek)
            return this.attributes.onSeek();
    },
    _forward: function () {
        if (this.attributes.onSeek)
            return this.attributes.onSeek();
    }
});