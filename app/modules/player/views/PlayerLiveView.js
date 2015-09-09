/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/9/15 10:29 AM
 *
 * History  :
 */
var PlayerLiveView = Backbone.View.extend({
    className: 'channelInfo showed',
    template: Backbone.Marionette.TemplateCache.get('app/templates/player/live.htt'),
    initialize: function () {
        this.model.on('change:visible', this.changeVisible, this);
        this.model.on('playback:process', this.process, this);
        this.model.on('change:open', this.changeOpen, this);
        this.model.on('update', this.update, this);
        this.render();
    },

    changeVisible: function (model, value) {
        console.log('PlayerLiveView - change:visible - ' + (value ? 'true' : 'false'));
        value ? this.$el.show() : this.$el.hide();
    },

    changeOpen: function (model, value) {
        if(!value)
            this.destroy();
    },

    process: function () {
        this.$el.find('.bar').css({width: this.model.getPercentPosition() + '%'});
    },

    render: function () {
        this.$el.html(this.template(this.model));
        config.rootEl.appendChild(this.el);
    },
    destroy: function () {
        this.model.off(null, null, this);
        this.$el.remove();
    },

    update: function() {
        this.$el.html(this.template(this.model));
        this.process();
    }
});