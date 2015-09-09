/**
 * @class PlayerController
 * @extends Marionette.Controller
 */
var PlayerController = Marionette.Controller.extend({
    view: null,
    model: null,

    /**
     * Initialize
     * @param model
     * @memberof PlayerController#
     */
    initialize: function (model) {
        this.model = new PlayerModel();
        this.model.on('return', this.keyReturn, this);
    },

    /**
     * Destroy
     * @memberof PlayerController#
     */
    destroy: function () {
        console.log('PlayerController::destroy');
    },

    /**
     * @memberof PlayerController#
     */
    createView: function () {
        if (this.view)
            this.view.destroy();

        if (App.Player.isLive()) {
            this.view = new PlayerLiveView({model: this.model});
        }
        else if (!App.Player.isLive()) {
            this.view = new PlayerVodView({model: this.model});
        }
    },

    /**
     * @memberof PlayerController#
     */
    open: function () {
        this.createView();
        this.model.open();
    },

    /**
     * @memberof PlayerController#
     */
    close: function () {
        this.model.close();
    },

    /**
     * The callback for key return
     * @memberof PlayerController#
     */
    keyReturn: function () {
        App.MainModule.hidePlayer();
    },

    /**
     * Check open player screen
     * @returns {boolean}
     * @memberof PlayerController#
     */
    isOpen: function () {
        return this.model.isOpen();
    },
    /**
     * Check visible player controls
     * @returns {boolean}
     * @memberof PlayerController#
     */
    isVisible: function () {
        return this.model.isVisible();
    }


});
