/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/9/15 10:29 AM
 *
 * History  :
 */
var PlayerVodView = Backbone.View.extend({
    id:'player',
    template: Backbone.Marionette.TemplateCache.get('app/templates/player/vod.htt'),
    initialize: function () {
        this.model.on('change:visible', this.changeVisible, this);
        this.model.on('playback:process', this.process, this);
        this.model.on('playback:begin', this.playbackBegin, this);
        this.model.on('playback:end', this.playbackEnd, this);
        this.model.on('playback:pause', this.playbackEnd, this);
        this.model.on('playback:resume', this.playbackBegin, this);
        this.model.on('change:open', this.changeOpen, this);
        this.model.on('change:focusedButton', this.changeFocusedButton, this);
        this.model.on('update', this.update, this);
        this.render();
    },

    changeVisible: function (model, value) {
        console.log('PlayerVodView - change:visible - ' + (value ? 'true' : 'false'));
        value ? this.$el.show() : this.$el.hide();
    },

    changeOpen: function (model, value) {
        if(!value)
            this.destroy();
        else
            this.$el.show()
    },

    changeFocusedButton: function (model, value) {
        var prev = model.previous('focusedButton');
        this.$el.find('.'+prev).removeClass('selected');
        this.$el.find('.'+value).addClass('selected');
    },

    process: function () {
        this.$el.find('.bar div').css({width: this.model.getPercentPosition() + '%'});
        this.$el.find('.FormatPositionTime').html(this.model.getFormatPositionTime());
        this.$el.find('.FormatDuration').html(this.model.getFormatDuration());
    },

    render: function () {
        this.$el.html(this.template(this.model));
        config.rootEl.appendChild(this.el);
        this.updateSelectedButton();
    },
    destroy: function () {
        this.model.off(null, null, this);
        this.$el.remove();
    },

    playbackBegin: function () {
        this.$el.find('.play-pause').removeClass('play');
        this.$el.find('.play-pause').addClass('pause');
    },

    playbackEnd: function () {
        this.$el.find('.play-pause').removeClass('pause');
        this.$el.find('.play-pause').addClass('play');
    },

    update: function() {
        this.$el.html(this.template(this.model));
        this.process();
        this.updateSelectedButton();
    },

    updateSelectedButton: function () {
        this.$el.find('.'+this.model.getSelectedButton()).addClass('selected');
    }
});