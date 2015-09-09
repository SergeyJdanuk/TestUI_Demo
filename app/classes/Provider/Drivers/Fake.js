/**
 * @class Provider.Fake
 * @extend AbstractDriver
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 *
 */
Provider.Fake = AbstractDriver.extend({

    /**
     * Initialize
     * @memberof Provider.Fake#
     */
    initialize: function () {},

    /**
     * Get movie media url
     * @returns {Promise}
     * @memberof Provider.Fake#
     */
    getMovieMediaUrl: function (movie) {
        console.log('[Fake] Getting movie url...');
        var promise = new Promise(function (resolve, reject) {
            console.log('[Fake] Getting movie url... success');
            resolve('http://blablabla.com/file.mp4')
        });
        return promise;
    },

    /**
     * Get channel media url
     * @param channel
     * @param gmt
     * @returns {Promise}
     * @memberof Provider.Fake#
     */
    getChannelMediaUrl: function (channel, gmt) {
        console.log('[Fake] Getting channel url...');
        var promise = new Promise(function (resolve, reject) {
            console.log('[Fake] Getting channel url... success');
            resolve('http://blablabla.com/file.mp4')
        });

        return promise;
    },

    /**
     * Get EPG
     * @param channel_id
     * @param day
     * @memberof Provider.Fake#
     */
    getEpg: function (channel_id, day) {
        console.log('[Fake] Getting epg...');
        var promise = new Promise(function (resolve, reject) {
            console.log('[Fake] Getting epg... success');
            resolve([]);
        });
        return promise;
    }
});