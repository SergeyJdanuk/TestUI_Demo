/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/8/15 6:25 PM
 * 
 * History  : 
 */

/////////////////////////////////////////////////////
var enumsPlaybackStateStr = 'PLAYBACK_STATE_STOPPED PLAYBACK_STATE_INITIALIZING PLAYBACK_STATE_PLAYING PLAYBACK_STATE_PAUSED PLAYBACK_STATE_SEEKING PLAYBACK_STATE_FINISHED PLAYBACK_STATE_DEINITIALIZING';
var enumsPlaybackEventStr = 'PLAYBACK_EVENT_NO_EVENT PLAYBACK_EVENT_MEDIA_DESCRIPTION_CHANGED PLAYBACK_EVENT_MEDIA_READ_STALLED PLAYBACK_EVENT_END_OF_MEDIA PLAYBACK_EVENT_ERROR_MEDIA_FORMAT_NOT_SUPPORTED PLAYBACK_EVENT_ERROR_INTERNAL_ERROR PLAYBACK_EVENT_ERROR_MEDIA_READ_FAILED PLAYBACK_EVENT_ERROR_MEDIA_OPEN_FAILED PLAYBACK_EVENT_EXTERNAL_ACTION PLAYBACK_EVENT_ERROR_MEDIA_PROTOCOL_NOT_SUPPORTED PLAYBACK_EVENT_ERROR_MEDIA_PERMISSION_DENIED';
var playbackStateEnums = [];
var playbackEventEnums = [];

function initializeEnums (str) {
    var e = str.split(' ');
    var ret = [];
    for(var i = 0; i< e.length; i++) {
        var name = e[i];
        var value = duneSTB.getInstance()[name];
        ret[name] = value;
        ret[value] = name;
        //console.log(name + ': ' + value);
    }
    return ret;
}
function initializePlaybackStateEnums() {
    playbackStateEnums = initializeEnums(enumsPlaybackStateStr)
}
function initializePlaybackEventEnums() {
    playbackEventEnums = initializeEnums(enumsPlaybackEventStr)
}

function getPlaybackStateName(value) {
    return playbackStateEnums[value];
}
function getPlaybackEventName(value) {
    return playbackEventEnums[value];
}
/////////////////////////////////////////////////////
var DunePlayback = Playback.extend({
    initialize: function (params) {
        this.timer = 0;
        this.set(params);

        this._validateDuration();

        if (duneSTB.isStarted()) {
            initializePlaybackStateEnums();
            initializePlaybackEventEnums();

            var self = this;

            duneSTB.setPlaybackEventCallback(function() {
                self._callbackPlaybackEvent.apply(self, arguments);
            });
        }
        else
            console.log('ERROR: duneSTB::setPlaybackEventCallback init failed');

        this._debouncedRewind= _.debounce(this._rewind,600);
        this._debouncedForward= _.debounce(this._forward,600);
    },

    destroy: function () {
        if (this.isPlaying() || this.isPaused())
            this.stop();
        if (this.timer)
            clearInterval(this.timer);
    },

    play: function () {
        if (this.isPlaying())
            this.stop();
        this._startPlayback(true);
   },
    stop: function () {
        if (!this.isPlaying() && !this.isPaused())
            return;
        this._stopPlayback(true);
        console.log('getPercentPosition ' + this.getPercentPosition());
        duneSTB.stop();
        this._state = 'stopped';

        if (!this.isLive() && this.getPercentPosition() == 100 && this.attributes.onEnd)
            this.attributes.onEnd();
        else {
            this.trigger('playback:end');
        }

        this.setPlaybackBeginTime(0);


    },
    pause: function () {
        if (!this.isPlaying())
            return;
        duneSTB.pause();
        this._state = 'paused';
        this._stopPlayback(false);
        this.trigger('playback:pause');
    },
    resume: function () {
        if (!this.isPaused())
            return;
        duneSTB.resume();
        this._startPlayback(false);
        this._state = 'playing';
        this.trigger('playback:resume');
    },
    forward: function (seconds) {
        var duration = this.getDuration() - 10;
        if (seconds > duration)
            seconds = duration;
        this.seconds = seconds;
        this._playbackProcess();
        this._debouncedForward(seconds);
    },
    rewind: function (seconds) {
        if (seconds < 0)
            seconds = 0;
        this.seconds = seconds;
        this._playbackProcess();
        this._debouncedRewind(seconds);
    },
    next: function (seconds) {
        if (this.attributes.onNext) {
            this.attributes.onNext();
            return;
        }
        this.seconds = seconds;
        this._playbackProcess();
        this._debouncedForward(seconds);
    },
    prev: function (seconds) {
        if (this.attributes.onPrev) {
            this.attributes.onPrev();
            return;
        }
        this.seconds = seconds;
        this._playbackProcess();
        this._debouncedRewind(seconds);
    },

    _startPlayback: function(isBegin) {
        var self = this;

        if (isBegin)
            this.seconds = 0;

        if (this.timer)
            clearInterval(this.timer);

        if (isBegin)
            if (!duneSTB.play(this.getMediaUrl())){
                return this.stop();
            }
        else
            duneSTB.resume();

        this.timer = setInterval(function() {
            var isEnd = self.getDuration() > 0 && ++self.seconds >= self.getDuration();
            console.log('self.seconds ' + self.seconds + ', percents: ' + self.getPercentPosition() + ', duration: ' + self.getDuration());
            var isPlaying = self.isPlaying();
            var isPaused = self.isPaused();
            var isLive = self.isLive();
            if ((isPlaying || isPaused) && isEnd && !isLive )
                self.stop();
            else
                self._playbackProcess();
        }, 1000);

        if (isBegin) {
            //this._state = 'playing';
            //this.trigger('playback:begin');
        }
    },

    _stopPlayback: function(isEnd) {
        clearInterval(this.timer);
    },

    _playbackProcess: function () {
        //this.seconds = duneSTB.getPositionInSeconds();
        this.trigger('playback:process', this.seconds);
    },

    _callbackPlaybackEvent: function (previousState, currentState, lastEvent) {

        console.log( [
            getPlaybackStateName(previousState)+':'+previousState,
            getPlaybackStateName(currentState)+':'+currentState,
            getPlaybackEventName(lastEvent)+':'+lastEvent
        ].join(' | '));

        this.trigger('playback-state', { cur: currentState, prev: previousState });

        var isPlaybackStopped = (currentState === duneSTB.getConst('PLAYBACK_STATE_STOPPED'));
        var isPlaybackPlaying = (currentState === duneSTB.getConst('PLAYBACK_STATE_PLAYING'));

        if (isPlaybackStopped) {
            this._state = 'stopped';
        } else if (isPlaybackPlaying && !this.isPlaying()) {
            this._state = 'playing';
            this.setPlaybackBeginTime();

            try{
                this.setDuration(duneSTB.getLengthInSeconds());
            }catch(e){
                //this.setDuration(0);
            }

            this.trigger('playback:begin');
        }
    },
    silentPlayUrl: function (url) {
        duneSTB.play(url);
    },
    _rewind: function () {
        if (this.attributes.onSeek)
            return this.attributes.onSeek();
        this.resume();
        duneSTB.setPositionInSeconds(this.seconds);
    },
    _forward: function () {
        if (this.attributes.onSeek)
            return this.attributes.onSeek();
        this.resume();
        duneSTB.setPositionInSeconds(this.seconds);
    }
});