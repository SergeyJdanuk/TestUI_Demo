/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 4/2/15 4:20 PM
 * 
 * History  : 
 */
(function () {

    var host = 'http://iptv.kartina.tv';
    var api = '/api/json';

    function getApiUrl(url) {
        return '/cgi-bin/proxy.sh?url=' + encodeURIComponent(url);
    }

    var Authorization = Backbone.Model.extend({
        initialize: function () {},

        url: function () {
            var login = settings.get('auth.login');
            var password = settings.get('auth.password');

            return getApiUrl(host
                + api
                + '/login/?login=' + login
                + '&pass=' + password
                + '&device=all&settings=all');
        },

        login: function () {
            this.fetch({ success: this.success, error: this.error });
        },

        parse: function (data, options) {
            return data;
        },

        success: function (theModel, data, options) {
            if (data && data.error) {
                switch (data.error.code) {
                    case 2:
                    case 3:
                    case 4:
                        theModel.trigger('login:error', data, options);
                }
            }
            else
                theModel.trigger('login:success', data, options);
        },

        error: function (theModel, data, options) {
            theModel.trigger('login:error', data, options);
        }
    });

    var Controller = Supplier_IDriver.extend({
        initialize: function () {
            this.authorization = new Authorization();

            this.authorization.on('login:success', this.loginSuccess, this);
            this.authorization.on('login:error', this.loginError, this);
        },

        getAGID: function () {
            return 0;
        },

        login: function (login, password) {
            if (login && password) {
                settings.set('auth.login', login);
                settings.set('auth.password', password);
            }
            this.authorization.login();
        },

        loginSuccess: function (data, options) {
            this.trigger('auth:success', data, options);
        },

        loginError: function (data, options) {
            this.trigger('auth:error', data, options);
        },

        getAuthorizationModel: function () {
            return this.authorization;
        },

        getMediaData: function(movie_id){
            console.log('kartinatv: getting media data');
            var params = [
                'id=' + movie_id,
                this.authorization.get('sid_name') + '=' + this.authorization.get('sid')
            ];

            var promise = new Promise(function (resolve, reject) {
                Zepto.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: getApiUrl(host + api + '/vod_info?' + params.join('&')),
                    success: function(result) {
                        if (!result || (result && !result.film)) {
                            console.error('kartinatv: getting media data error - no data');
                            reject();
                            return;
                        }

                        console.log('kartinatv: getting media data success callback');
                        resolve(result);
                    },
                    error: function () {
                        reject();
                    }
                });
            });

            return promise;
        },

        getMovieMediaUrl: function (movie_id, callback) {
            console.log('kartinatv: getting media url');
            var params = [
                    'fileid=' + movie_id,
                    this.authorization.get('sid_name') + '=' + this.authorization.get('sid')
                ];

            return Zepto.ajax({
                type: 'GET',
                dataType: 'json',
                url: getApiUrl(host + api + '/vod_geturl?' + params.join('&')),
                success: function(result) {
                    console.log('kartinatv: getting media url success callback');
                    callback(result.url)
                }
            });
        },

        getChannelMediaUrl: function (channel_id, gmt) {
            console.log('Getting channel media url (channel_id: ' + channel_id + ')');
            var params = [
                'cid=' + channel_id,
                (gmt != 0 ? 'gmt='+gmt: ''),
                this.authorization.get('sid_name') + '=' + this.authorization.get('sid')
            ];
            return Zepto.ajax({
              type: 'GET',
              dataType: 'json',
              url: getApiUrl(host + api + '/get_url?' + params.join('&'))
            });
        },
        getChannelsList: function (callback) {
            console.log('Getting channel list');
            var params = [
                'show=all',
                this.authorization.get('sid_name') + '=' + this.authorization.get('sid')
            ];
            return Zepto.ajax({
                type: 'GET',
                dataType: 'json',
                url: getApiUrl(host + api + '/channel_list?' + params.join('&')),
                success: function(data){
                    console.log('kartinatv: getting channels list success callback');
                    callback(data);
                }
            });
        },

        getEpg: function (channel_id, day) {
            var params = [
                'cid=' + channel_id,
                'day=' + day,
                this.authorization.get('sid_name') + '=' + this.authorization.get('sid')
            ];
            return Zepto.ajax({
              type: 'GET',
              dataType: 'json',
              url: getApiUrl(host + api + '/epg?' + params.join('&'))
            });
        }
    });
   window.Supplier_KartinaTV = Controller;
})();
