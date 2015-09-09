/**
 * @class PlayerModel
 * @extends Backbone.Model
 */
var PlayerModel = Backbone.Model.extend({
    defaults: {
        open: false,
        visible: false,
        focusedButton: 'play-pause'
    },
    buttons: ['prev', 'rewind', 'play-pause', 'stop', 'forward', 'next'],
    buttonsCallbacks: ['keyPrev', 'keyRew', 'keyPlay', 'keyStop', 'keyFwd', 'keyNext'],
    buttonIndex: 2,
    slowRewind: 100,
    fastRewind: 500,
    initialize: function () {
        App.Player.on('all', this._playbackEvent, this);
        App.Player.on('create', this.newPlayback, this);

        _.bindAll(this,'hide');
        this.debouncedHide= _.debounce(this.hide,5000);
    },
    _playbackEvent: function (name, args) {
        this.trigger(name, args);
    },

    hide: function () {
        console.log('PlayerModel - hide');
        if (!this.isPlaying()) {
            keyboardObserver.increaseTimeWaitNotUsedKeyboard();
            return;
        }
        this.disableVisible();
    },

    show: function () {
        this.enableVisible();
    },
    getImage: function () {
        return App.Player.getImage();
    },
    getTitle: function () {
        return App.Player.getTitle();
    },
    getDescription: function () {
        return App.Player.getDescription();
    },
    getPercentPosition: function () {
        return App.Player.getPercentPosition();
    },
    disableVisible: function () {
        if (this.isVisible()) {
            this.set('visible', false);
        }
    },
    enableVisible: function () {
        console.log('Player Model - enable visibe');
        this.debouncedHide();
        if (!this.isVisible()) {
            this.set('visible', true);
        }
    },
    open: function () {
        console.log('Player Model - open');
        this.set('open', true);
        this.enableVisible();
        this.unsubscribe();
        this.subscribe();
    },
    close: function () {
        this.set('open', false);
        this.disableVisible();
        this.unsubscribe();
    },
    subscribe: function () {
        this.unsubscribe();
        keyboardObserver.on('keyboardEnter', this.keyEnter, this);
        keyboardObserver.on('return', this.disableVisible, this);
        keyboardObserver.on('V_plus', App.volumeUp, this);
        keyboardObserver.on('V_minus', App.volumeDown, this);
        keyboardObserver.on('P_plus', this.programPlus, this);
        keyboardObserver.on('P_minus', this.programMinus, this);

        if (!App.Player.isLive() && App.Player.hasControls()) {
            keyboardObserver.on('Left', this.keyLeft, this);
            keyboardObserver.on('Right', this.keyRight, this);
            keyboardObserver.on('Up', this.keyUp, this);
            keyboardObserver.on('Down', this.keyDown, this);
            keyboardObserver.on('Fwd', this.keyFwd, this);
            keyboardObserver.on('Rew', this.keyRew, this);
            keyboardObserver.on('Next', this.keyNext, this);
            keyboardObserver.on('Prev', this.keyPrev, this);
            keyboardObserver.on('Play', this.keyPlay, this);
            keyboardObserver.on('Stop', this.keyStop, this);
        }
    },
    unsubscribe: function () {
        keyboardObserver.off(null, null, this);
    },
    isOpen: function () {
        console.log('PlayerModel - isOpen: ' + (this.attributes.open ? 'true' : 'false'));
        return this.attributes.open;
    },
    isVisible: function () {
        console.log('PlayerModel - isVisible: ' + (this.attributes.visible ? 'true' : 'false'));
        return this.attributes.visible;
    },
    keyLeft: function () {
        if (this.isVisible()) {
            this.debouncedHide();
            if (--this.buttonIndex < 0) {
                this.buttonIndex = this.buttons.length - 1;
            }
            this.set('focusedButton', this.buttons[this.buttonIndex]);
        }
    },
    keyRight: function () {
        if(this.isVisible()) {
            this.debouncedHide();
            if (++this.buttonIndex >= this.buttons.length){
                this.buttonIndex = 0;
            }
            this.set('focusedButton', this.buttons[this.buttonIndex]);
        }
    },
    keyUp: function () {
    },
    keyDown: function () {
    },
    keyFwd: function () {
        //App.Player.forward(App.Player.getSecondsPosition() + 1000 * 60 * 5);
        this.enableVisible();
        App.Player.forward(App.Player.getSecondsPosition() + this.slowRewind);
        this.set('focusedButton', 'forward');
        this.buttonIndex = this.buttons.indexOf('forward');
    },
    keyRew: function () {
        this.enableVisible();
        //App.Player.rewind(App.Player.getSecondsPosition() - 1000 * 60 * 5);
        App.Player.rewind(App.Player.getSecondsPosition() - this.slowRewind);
        this.set('focusedButton', 'rewind');
        this.buttonIndex = this.buttons.indexOf('rewind');
    },
    keyNext: function () {
        this.enableVisible();
        App.Player.next(App.Player.getSecondsPosition() + this.fastRewind);
        this.set('focusedButton', 'next');
        this.buttonIndex = this.buttons.indexOf('next');
    },
    keyPrev: function () {
        this.enableVisible();
        App.Player.prev(App.Player.getSecondsPosition() - this.fastRewind);
        this.set('focusedButton', 'prev');
        this.buttonIndex = this.buttons.indexOf('prev');
    },
    keyPlay: function () {
        this.enableVisible();
        if (App.Player.isPlaying())
            App.Player.pause();
        else if (App.Player.isPaused())
            App.Player.resume();
        else
            App.Player.play();

        this.set('focusedButton', 'play-pause');
        this.buttonIndex = this.buttons.indexOf('play-pause');
    },
    keyStop: function () {
        console.log('Player Model - key stop');
        this.enableVisible();
        if (App.Player.isPlaying() || App.Player.isPaused()) {
            App.Player.stop();
            this.set('focusedButton', 'stop');
            this.buttonIndex = this.buttons.indexOf('stop');
        }
    },
    keyEnter: function () {
        console.log('Player Model - key enter');
        if (this.isVisible() && App.Player.hasControls()) {
            var callback = this.buttonsCallbacks[this.buttonIndex];
            this[callback].call(this);
        } else if (!this.isVisible()) {
            $('#preloader').hide();
            //в случае если у нас не поднято контролы плеера по Enter мы показываем интерфейс
            App.MainModule.hidePlayer();
        }
    },
    isPlaying: function () {
        return App.Player.isPlaying();
    },
    isPaused: function () {
        return App.Player.isPaused();
    },
    isStopped: function () {
        return App.Player.isStopped();
    },
    getSelectedButton: function () {
        return this.buttons[this.buttonIndex];
    },
    newPlayback: function () {
        this.trigger('update');
    },
    getDuration: function () {
        return App.Player.getDuration();
    },
    getFormatDuration: function () {
        var duration = App.Player.getDuration();
        var hours = parseInt(duration / 60 / 60, 10);
        var minutes = parseInt(duration / 60 % 60, 10);
        var seconds = duration % 60;

        minutes = minutes == 60 ? 0 : minutes;
        seconds = seconds == 60 ? 0 : seconds;

        var format = [
            (hours < 10) ? '0' + hours : hours,
            (minutes < 10) ? '0' + minutes : minutes,
            (seconds < 10) ? '0' + seconds : seconds
        ];
        return format.join(':');
    },
    getFormatPositionTime: function () {
        var position = App.Player.getPosition();
        var hours = parseInt(position / 60 / 60, 10);
        var minutes = parseInt(position / 60 % 60, 10);
        var seconds = position % 60;

        minutes = minutes == 60 ? 0 : minutes;
        seconds = seconds == 60 ? 0 : seconds;

        var format = [
            (hours < 10) ? '0' + hours : hours,
            (minutes < 10) ? '0' + minutes : minutes,
            (seconds < 10) ? '0' + seconds : seconds
        ];
        return format.join(':');
    },
    programPlus: function () {
        App.TVModule.playNextChannel();
    },
    programMinus: function () {
        App.TVModule.playPrevChannel();
    }
});