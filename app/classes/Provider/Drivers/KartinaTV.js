/**
 * @class Provider.KartinaTVSession
 * @global
 */
Provider.KartinaTVSession = new (Backbone.Model.extend({
    defaults: {
        isLogged: false,
        sessionInfo: null
    },
    initialize: function () {},

    isLogged: function () {
        return this.attributes.isLogged;
    },

    setLogged: function (logged) {
        this.set('isLogged', logged);
    },

    getSessionInfo: function () {
        return this.attributes.sessionInfo;
    },

    setSessionInfo: function (info) {
        this.set('sessionInfo', info);
        this.set('isLogged', true);
    }
}));

/**
 * @class Provider.KartinaTV
 * @extend AbstractDriver
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/20/15 2:42 PM
 *
 */
Provider.KartinaTV = AbstractDriver.extend({

    _host: 'http://iptv.kartina.tv',
    _api: '/api/json',
    _maxRelogins: 3,
    _codes: {
        0: "Unknown error",
        1: "Incorrect request",
        2: "Wrong login or password",
        3: "Access denied",
        4: "Login incorrect",
        5: "Your contract is inactive",
        6: "Your contract is paused",
        7: "Channel not found or not allowed",
        8: "Error generate URL. Bad parameters",
        9: "Need DAY parameter <DDMMYY>",
        10: "Need Channel ID",
        11: "Another client with your login was logged",
        12: "Authentication error",
        13: "Your packet was expired",
        14: "Unknown API function",
        15: "Archive is not available",
        16: "Need place to set",
        17: "Need name of settings variable",
        18: "Incorrect confirmation code",
        19: "Current password is wrong",
        20: "New password is wrong",
        21: "Need value (val) parameter",
        22: "This value is not allowed",
        23: "Need parameter",
        24: "Need parameter <id>",
        25: "Need parameter <fileid>",
        26: "Need parameter <type>",
        27: "Need parameter <query>",
        29: "Need parameter <bitrate>",
        30: "Service is not available",
        31: "Query limit exceeded",
        32: "Rule already exist",
        33: "Need param ?cmd = hide_channel | show_channel | get_list",
        34: "Need param ?cmd = get_user_rates | set_user_rates",
        35: "Bad rate value. Allow <show|hide|pass>",
        36: "Can’t find film",
        37: "This film already added to favorite list",
        99: "System error"
    },

    /**
     * Initialize
     * @memberof Provider.KartinaTV#
     */
    initialize: function () {
        if (Provider.KartinaTVSession.isLogged()) {
            var session = Provider.KartinaTVSession.getSessionInfo();
            this._account = new Provider.KartinaTV.Account(session.account);
            this._settings = new Provider.KartinaTV.Settings(session.settings);
        }
        else {
            this._account = new Provider.KartinaTV.Account();
            this._settings = new Provider.KartinaTV.Settings();
        }
    },

    /**
     * Get api url
     * @param url
     * @returns {string}
     * @private
     * @memberof Provider.KartinaTV#
     */
    _getApiUrl: function (url) {
        var baseUrl = this._host + this._api;
        return '/cgi-bin/proxy.sh?url=' + encodeURIComponent(baseUrl + url);
    },

    /**
     * Get api login url
     * @param login
     * @param password
     * @returns {*|string}
     * @private
     * @memberof Provider.KartinaTV#
     */
    _getApiLoginUrl: function (login, password) {
        return this._getApiUrl('/login/?login=' + login + '&pass=' + password + '&device=all&settings=all');
    },

    /**
     * Get api media url
     * @param movie
     * @returns {*|string}
     * @private
     * @memberof Provider.KartinaTV#
     */
    _getApiMediaUrl: function (movie) {
        var session = Provider.KartinaTVSession.getSessionInfo();
        var formats = movie.getFormats();
        var format = formats.getSelected();

        var params = [
            'fileid=' + format.getId(),
            session.sid_name + '=' + session.sid
        ];
        return this._getApiUrl('/vod_geturl?' + params.join('&'))
    },

    /**
     * Get api channel url
     * @param channel
     * @param gmt
     * @returns {string}
     * @private
     * @memberof Provider.KartinaTV#
     */
    _getApiChannelUrl: function (channel, gmt) {
        var session = Provider.KartinaTVSession.getSessionInfo();
        var params = [
            'cid=' + channel.getId(),
            (gmt != 0 ? 'gmt='+gmt: ''),
            session.sid_name + '=' + session.sid
        ];
        var url = this._getApiUrl('/get_url?' + params.join('&'))
        console.log(url);
        return url;
    },

    _getApiChannelsUrl: function (protect_code) {
        var session = Provider.KartinaTVSession.getSessionInfo();
        var params = [
            //'show=all',
            //'protect_code=' + (protect_code != undefined ? protect_code : ''),
            session.sid_name + '=' + session.sid
        ];
        return this._getApiUrl('/channel_list?' + params.join('&'))
    },

    /**
     * Get api epg url
     * @param channel
     * @param day
     * @returns {string}
     * @private
     * @memberof Provider.KartinaTV#
     */
    _getApiEpgUrl: function (channel, day) {
        var session = Provider.KartinaTVSession.getSessionInfo();
        var params = [
            'cid=' + channel.getId(),
            'day=' + day,
            session.sid_name + '=' + session.sid
        ];
        return this._getApiUrl('/epg?' + params.join('&'));
    },

    /**
     * Get api media data url
     * @param movie
     * @returns {*|string}
     * @private
     * @memberof Provider.KartinaTV#
     */
    _getApiMediaDataUrl: function (movie) {
        var session = Provider.KartinaTVSession.getSessionInfo();
        var params = [
            'id=' + this.getMovieId(),
            session.sid_name + '=' + session.sid
        ];
        return this._getApiUrl('/vod_info?' + params.join('&'));
    },

    /**
     *
     * @returns {*|string}
     * @private
     */
    _getApiSettingsUrl: function (key, val) {
        var session = Provider.KartinaTVSession.getSessionInfo();
        var params = [
            session.sid_name + '=' + session.sid,
            'var=' + key,
            'val=' + val
        ];
        return this._getApiUrl('/settings?' + params.join('&'));
    },

    /**
     * Check errors in request
     * @param result
     * @returns {boolean}
     * @memberof Provider.KartinaTV#
     */
    isRequestError: function (result) {
        return (result && result.error !== undefined);
    },

    /**
     * Get request error message
     * @param result
     * @returns {string}
     * @memberof Provider.KartinaTV#
     */
    getRequestErrorMessage: function (result) {
        if (!this.isRequestError(result))
            return '';

        return this._codes[result.error.code];
    },

    /**
     * Check auth error
     * @param result
     * @returns {boolean}
     * @memberof Provider.KartinaTV#
     */
    isAuthError: function (result) {
        if (result.error && (result.error.code == 11 || result.error.code == 12)) {
            Provider.KartinaTVSession.setLogged(false);
            return true;
        }
        return false;
    },

    /**
     * Get movie media url
     * @param {Movie} movie
     * @returns {Promise}
     * @memberof Provider.KartinaTV#
     */
    getMovieMediaUrl: function (movie) {
        console.log('Getting movie url... | KartinaTV');
        var that = this;

        var promise = new Promise(function (resolve, reject) {

            // генерируем ошибку если форматы видео отсутствует
            if (movie.getFormats().length == 0)
                return reject();

            var reloginStep = 0;

            (function doLoginAndMakeRequest() {
                that.login().then(function success() {
                    Zepto.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: that._getApiMediaUrl(movie),
                        success: function (result) {
                            if (that.isAuthError(result)) {
                                console.log('Getting movie url... error. Try relogin #'+reloginStep + ' | KartinaTV');
                                if (++reloginStep < that._maxRelogins)
                                    return doLoginAndMakeRequest();
                                return reject();
                            }

                            if (that.isRequestError(result)) {
                                console.log('Getting movie url... error. ' + that.getRequestErrorMessage(result) + ' | KartinaTV');
                                return reject();
                            }

                            console.log('Getting movie url... success | KartinaTV');
                            resolve(result.url)
                        },
                        error: function () {
                            console.log('Getting movie url... error | KartinaTV');
                            reject();
                        }
                    });
                }, reject);
            })();
        });

        return promise;
    },

    /**
     * Login
     * @returns {Promise}
     * @memberof Provider.KartinaTV#
     */
    login: function (login, password, cache) {
        var login = login || settings.get('auth.login');
        var password = password || settings.get('auth.password');
        var that = this;

        var promise = new Promise(function (resolve, reject) {

            if (!login || !password) {
                console.log('Login... error. No login or password | KartinaTV');
                return reject('No login or password');
            }

            if (cache !== false && Provider.KartinaTVSession.isLogged())
                return resolve(Provider.KartinaTVSession.getSessionInfo());

            console.log('Login... | KartinaTV');

            $.ajax({
                url: that._getApiLoginUrl(login, password),
                dataType: 'json',
                success: function (result) {

                    // если в запросе на авторизацию получили не обьект
                    // считаем что авторизация не прошла
                    if (!_.isObject(result)) {
                        console.log('Login... error | KartinaTV');
                        return reject('Network error');
                    }

                    if (that.isRequestError(result)) {
                        console.log('Login... error. ' + that.getRequestErrorMessage(result) + ' | KartinaTV');
                        return reject(that.getRequestErrorMessage(result), result.error.code);
                    }

                    console.log('Login... success | KartinaTV');

                    var sessionInfo = _.clone(result);

                    that._account = new Provider.KartinaTV.Account(sessionInfo.account);
                    that._settings = new Provider.KartinaTV.Settings(sessionInfo.settings);

                    Provider.KartinaTVSession.setSessionInfo(sessionInfo);

                    resolve(sessionInfo);
                },
                error: function () {
                    console.log('Login... error | KartinaTV');
                    reject('Network error');
                }
            });
        });

        return promise;
    },

    /**
     * Get channel media url
     * @param {Channel} channel
     * @param {integer} gmt
     * @returns {Promise}
     * @memberof Provider.KartinaTV#
     */
    getChannelMediaUrl: function (channel, gmt) {
        console.log('Getting channel url... | KartinaTV');

        var that = this;
        var promise = new Promise(function (resolve, reject) {

            var reloginStep = 0;

            (function doLoginAndMakeRequest() {
                that.login().then(function success() {
                    Zepto.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: that._getApiChannelUrl(channel, gmt),
                        success: function (result) {
                            if (that.isAuthError(result)) {
                                console.log('Getting channel url... error. Try relogin #'+reloginStep+' | KartinaTV');
                                if (++reloginStep < that._maxRelogins)
                                    return doLoginAndMakeRequest();
                                return reject();
                            }

                            if (that.isRequestError(result)) {
                                console.log('Getting channel url... error. ' + that.getRequestErrorMessage(result)+' | KartinaTV');
                                return reject();
                            }

                            console.log('Getting channel url... success | KartinaTV');
                            resolve(result.url.replace('/ts', ''))
                        },
                        error: function () {
                            console.log('Getting channel url... error | KartinaTV');
                            reject()
                        }
                    });
                }, reject);
            })();
        });

        return promise;
    },

    /**
     * Get EPG
     * @param {Channel} channel
     * @param {string} date
     * @memberof Provider.KartinaTV#
     */
    getEpg: function (channel, date) {
        console.log('Getting epg (date:'+date+')... | KartinaTV');
        var that = this;

        var promise = new Promise(function (resolve, reject) {

            var reloginStep = 0;

            (function doLoginAndMakeRequest() {
                that.login().then(function success() {
                    Zepto.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: that._getApiEpgUrl(channel, date),
                        success: function (result) {
                            if (that.isAuthError(result)) {
                                console.log('Getting epg (date:' + date + ')... error. Try relogin #'+reloginStep+' | KartinaTV');
                                if (++reloginStep < that._maxRelogins)
                                    return doLoginAndMakeRequest();
                                return reject();
                            }

                            if (that.isRequestError(result)) {
                                console.log('Getting epg (date:' + date + ')... error. ' + that.getRequestErrorMessage(result)+' | KartinaTV');
                                return reject();
                            }

                            console.log('Getting epg (date:' + date + ')... success | KartinaTV');
                            resolve(result);
                        },
                        error: function () {
                            console.log('Getting epg (date:' + date + ')... error | KartinaTV');
                            reject();
                        }
                    });
                }, reject);
            })();
        });

        return promise;
    },

    /**
     * Get media data
     * @param {Movie} movie
     * @returns {Promise}
     * @memberof Provider.KartinaTV#
     */
    getMediaData: function (movie) {
        console.log('Getting media data... | KartinaTV');
        var that = this;
        var promise = new Promise(function (resolve, reject) {

            var reloginStep = 0;

            (function doLoginAndMakeRequest() {
                that.login().then(function success() {
                    Zepto.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: that._getApiMediaDataUrl(movie),
                        success: function (result) {
                            if (that.isAuthError(result)) {
                                console.log('Getting media data... error. Try relogin #'+reloginStep + ' | KartinaTV');
                                if (++reloginStep < that._maxRelogins)
                                    return doLoginAndMakeRequest();
                                return reject();
                            }

                            if (that.isRequestError(result)) {
                                console.log('Getting media data... error. ' + that.getRequestErrorMessage(result) + ' | KartinaTV');
                                return reject();
                            }

                            console.log('Getting media data... success | KartinaTV');
                            resolve(result);
                        },
                        error: function () {
                            console.log('Getting  media data... error | KartinaTV');
                            reject();
                        }
                    });
                }, function () {
                    console.log('Getting  media data... error | KartinaTV');
                    reject()
                });
            })();
        });

        return promise;
    },

    /**
     * Get formats
     * @param {Movie} movie
     * @returns {Promise}
     * @memberof Provider.KartinaTV#
     */
    getFormats: function (movie) {
        var that = this;
        var promise = new Promise(function (resolve, reject) {

            that.getMediaData(movie).then(function (result) {
                if (!_.isObject(result) || (_.isObject(result.film) && !_.isArray(result.film.videos)))
                    return reject();

                //Сортируем по качеству от большего к меньшему
                var sortedFormats = {'fullhd':0,'hd':1,'dvd':2,'tv':3};
                var videos = _.sortBy(result.film.videos, function(obj){return sortedFormats[obj.format];});
                var translates = {'fullhd': __('Full HD'), 'hd': __('HD'),'dvd': __('DVD'),'tv':__('TV')};
                var formats = new VODMovieFormats();

                _.each(videos, function (v, i, a) {
                    v.num = +v.num;
                    var hasChildren = (v.num != 0);
                    var model = formats.findWhere({
                        format: v.format
                    });

                    if (model)
                        return;

                    formats.add(new VODMovieFormat({
                        format: v.format,
                        title: hasChildren ? translates[v.format] : v.title,
                        hasChildren: hasChildren,
                        children: [],
                        id: v.id,
                        id_content: v.id_content
                    }));
                });

                formats.map(function (val, key) {
                    var format = val.getFormat();
                    if (!val.hasChildren())
                        return;

                    var children = _.filter(videos, function (v, i, a) {
                        return v.format == format;
                    });

                    var f = new VODMovieFormats(children)
                    if (f.length > 0)
                        f.setSelectedIndex(0);
                    val.setChildren(f);
                });

                if (formats.length > 0)
                    formats.setSelectedIndex(0);
                resolve(formats);
            }, reject);
        });

        return promise;
    },

    getChannels: function () {
        console.log('Getting channels... | KartinaTV');

        var that = this;
        var promise = new Promise(function (resolve, reject) {

            var reloginStep = 0;

            (function doLoginAndMakeRequest() {
                that.login().then(function success() {
                    Zepto.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: that._getApiChannelsUrl(),
                        success: function (result) {
                            if (that.isAuthError(result)) {
                                console.log('Getting channels... error. Try relogin #'+reloginStep+' | KartinaTV');
                                if (++reloginStep < that._maxRelogins)
                                    return doLoginAndMakeRequest();
                                return reject();
                            }

                            if (that.isRequestError(result)) {
                                console.log('Getting channels... error. ' + that.getRequestErrorMessage(result)+' | KartinaTV');
                                return reject();
                            }

                            //var categories = new TVCategories();
                            //var channelNum = 0;
                            //
                            //_.each(result.groups, function (v) {
                            //    var channels = new TVChannels();
                            //    _.each(v.channels, function (c) {
                            //        c.number = ++channelNum;
                            //        channels.add(new TVChannel(c));
                            //    });
                            //    v.channels = channels;
                            //    categories.add(new TVCategory(v));
                            //});
                            //
                            //if (categories.length > 0)
                            //    categories.setSelectedIndex(0);

                            console.log('Getting categories... success | KartinaTV');
                            resolve(result.groups);
                        },
                        error: function () {
                            console.log('Getting categories... error | KartinaTV');
                            reject()
                        }
                    });
                }, function () {
                    console.log('Getting categories... error | KartinaTV');
                    reject();
                });
            })();
        });

        return promise;
    },
    getCategories: function () {
        console.log('Getting categories... | KartinaTV');

        var that = this;
        var promise = new Promise(function (resolve, reject) {

            var reloginStep = 0;

            (function doLoginAndMakeRequest() {
                that.login().then(function success() {
                    Zepto.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: that._getApiChannelsUrl(),
                        success: function (result) {
                            if (that.isAuthError(result)) {
                                console.log('Getting categories... error. Try relogin #'+reloginStep+' | KartinaTV');
                                if (++reloginStep < that._maxRelogins)
                                    return doLoginAndMakeRequest();
                                return reject();
                            }

                            if (that.isRequestError(result)) {
                                console.log('Getting categories... error. ' + that.getRequestErrorMessage(result)+' | KartinaTV');
                                return reject();
                            }

                            if (!_.isArray(result.groups)) {
                                console.log('Getting categories... error. "groups" field is not array | KartinaTV');
                                return reject();
                            }

                            //var categories = new TVCategories();
                            //var channelNum = 0;
                            //
                            //_.each(result.groups, function (v) {
                            //    var channels = new TVChannels();
                            //    _.each(v.channels, function (c) {
                            //        c.number = ++channelNum;
                            //        channels.add(new TVChannel(c));
                            //    });
                            //    v.channels = channels;
                            //    categories.add(new TVCategory(v));
                            //});
                            //
                            //if (categories.length > 0)
                            //    categories.setSelectedIndex(0);

                            console.log('Getting categories... success | KartinaTV');
                            resolve(result.groups);
                        },
                        error: function () {
                            console.log('Getting categories... error | KartinaTV');
                            reject()
                        }
                    });
                }, function () {
                    console.log('Getting categories... error | KartinaTV');
                    reject();
                });
            })();
        });

        return promise;
    },

    getSettings: function () {
        return this._settings;
    },

    getAccount: function () {
        return this._account;
    },
    saveSetting: function (key, val) {
        console.log('Saving setting... | KartinaTV');
        var that = this;
        var promise = new Promise(function (resolve, reject) {

            var reloginStep = 0;

            (function doLoginAndMakeRequest() {
                that.login().then(function success() {
                    Zepto.ajax({
                        type: 'GET',
                        dataType: 'json',
                        url: that._getApiSettingsUrl(key, val),
                        success: function (result) {
                            if (that.isAuthError(result)) {
                                console.log('Saving setting... error. Try relogin #'+reloginStep + ' | KartinaTV');
                                if (++reloginStep < that._maxRelogins)
                                    return doLoginAndMakeRequest();
                                return reject();
                            }

                            if (that.isRequestError(result)) {
                                console.log('Saving setting... error. ' + that.getRequestErrorMessage(result) + ' | KartinaTV');
                                return reject();
                            }

                            console.log('Saving setting... success | KartinaTV');
                            resolve(result);
                        },
                        error: function () {
                            console.log('Saving setting... error | KartinaTV');
                            reject();
                        }
                    });
                }, function (message) {
                    console.log('Saving setting... error | KartinaTV');
                    reject(message)
                });
            })();
        });

        return promise;
    }
});

Provider.KartinaTV.Account = Backbone.Model.extend({
    defaults: {
        login: 0,
        packet_name: '',
        packet_id: '',
        packet_expire: ''
    },
    getPacketName: function () {
        return this.attributes.packet_name;
    },
    getPacketId: function () {
        return this.attributes.packet_id;
    },
    getPacketExpire: function () {
        return parseInt(this.attributes.packet_expire, 10);
    },
    getPacketExpireFormat: function () {
        var unixtime = parseInt(this.getPacketExpire(), 10);
        var expire = new Date(unixtime * 1000);
        var day = expire.getDay();
        var month = expire.getMonth();
        var year = expire.getFullYear();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;
        return day + '.' + month  + '.' + year;
    }
});

Provider.KartinaTV.Settings = Backbone.Model.extend({
    defaults: {
        timeshift: {
            value: 0,
            list: [
                "0",
                "1",
                "2",
                "3",
                "4",
                "7",
                "8",
                "9",
                "10",
                "11",
                "12"
            ],
            scope: "global"
        },
        timezone: {
            value: "-1",
            scope: "global"
        },
        http_caching: {
            value: 3000,
            list: [
                1500,
                3000,
                5000,
                8000,
                15000
            ],
            scope: "global"
        },
        stream_server: {
            value: "91.224.187.34",
            list: [
                {
                    ip: "91.224.187.34",
                    descr: "Europe South"
                },
                {
                    ip: "185.28.44.2",
                    descr: "Europe East"
                },
                {
                    ip: "91.224.186.2",
                    descr: "Europe North"
                },
                {
                    ip: "103.24.45.2",
                    descr: "USA East Coast"
                },
                {
                    ip: "103.24.44.18",
                    descr: "USA West Coast"
                },
                {
                    ip: "103.24.15.2",
                    descr: "USA North"
                },
                {
                    ip: "78.31.208.2",
                    descr: "Middle East"
                },
                {
                    ip: "103.246.216.34",
                    descr: "Asia"
                }
            ],
            scope: "global"
        },
        bitrate: {
            value: "1500",
            list: [
                "2500",
                "1500",
                "900",
                "320"
            ],
            names: [
                {
                    val: "2500",
                    title: "Premium"
                },
                {
                    val: "1500",
                    title: "Standart"
                },
                {
                    val: "900",
                    title: "Eco"
                },
                {
                    val: "320",
                    title: "Mobile"
                }
            ],
            scope: "global"
        },
        stream_standard: {
            value: "http_h264",
            list: [
                {
                    value: "dash_hevc",
                    title: "DASH / H.265 (HEVC)",
                    description: "Adaptive stream protocol, best quality. The bitrate select automaticaly. Low time of channels switch.",
                    catchup: {
                        delay: 6,
                        length: 1209480
                    }
                },
                {
                    value: "http_h264",
                    title: "HTTP / H.264",
                    description: "Standart streaming. User can select bitrate manualy.",
                    'default': true,
                    catchup: {
                        delay: 1800,
                        length: 1209480
                    }
                },
                {
                    value: "udt_h264",
                    title: "UDT / H.264",
                    description: "The best protocol for unstable and wide Internet connection.",
                    catchup: {
                        delay: 1800,
                        length: 1209480
                    }
                },
                {
                    value: "hls_h264",
                    title: "HLS / H.264",
                    description: "Adaptive stream protocol. The bitrate select automaticaly. Without catch-up function.",
                    catchup: false
                }
            ],
            scope: "global"
        }
    },
    _get: function (path) {

        function index(obj,is, value) {
            if (typeof is == 'string')
                return index(obj,is.split('.'), value);
            else if (is.length==1 && value!==undefined)
                return obj[is[0]] = value;
            else if (is.length==0)
                return obj;
            else
                return index(obj[is[0]],is.slice(1), value);
        }

        return index(this.attributes, path);
    },
    getTimeshiftValue: function () {
        return this._get('timeshift.value');
    },
    getTimeshiftList: function () {
        var list = _.map(this._get('timeshift.list'), function (v) {
            return {title: v, value: parseInt(v, 10)};
        })
        return list;
    },
    getTimeshiftScope: function () {
        return this._get('timeshift.scope');
    },
    getSelectedTimeshiftIndex: function () {
        var list = this.getTimeshiftList();
        var value = this.getTimeshiftValue();

        var res = _.filter(list, function (v, i) {
            v.index = parseInt(i, 10);
            return v.value == value;
        });

        if (!res.length)
            return -1;

        return res[0].index;
    },
    getTimezoneValue: function () {
        return this._get('timezone.value');
    },
    getTimezoneScope: function () {
        return this._get('timezone.scope');
    },
    getHttpCachingValue: function () {
        return this._get('http_caching.value');
    },
    getHttpCachingList: function () {
        return this._get('http_caching.list');
    },
    getStreamServerValue: function () {
        return this._get('stream_server.value');
    },
    getStreamServerList: function () {
        var list = _.map(this._get('stream_server.list'), function (v) {
            return {title: v.descr, value: v.ip};
        })
        return list;
    },
    getStreamServerScope: function () {
        return this._get('stream_server.scope');
    },
    getSelectedStreamServerIndex: function () {
        var list = this.getStreamServerList();
        var value = this.getStreamServerValue();

        var res = _.filter(list, function (v, i) {
            v.index = parseInt(i, 10);
            return v.value == value;
        });

        if (!res.length)
            return -1;

        return res[0].index;
    },
    getBitrateValue: function () {
        return this._get('bitrate.value');
    },
    getBitrateList: function () {
        return this._get('bitrate.list');
    },
    getBitrateNames: function () {
        var list = _.map(this._get('bitrate.names'), function (v) {
            return {title: v.title, value: v.val};
        });
        return list;
    },
    getSelectedBitrateIndex: function () {
        var list = this.getBitrateNames();
        var value = this.getBitrateValue();

        var res = _.filter(list, function (v, i) {
            v.index = parseInt(i, 10);
            return v.value == value;
        });

        if (!res.length)
            return -1;

        return res[0].index;
    },
    getBitrateScope: function () {
        return this._get('bitrate.scope');
    },
    getStreamStandardValue: function () {
        return this._get('stream_standard.value');
    },
    getStreamStandardList: function () {
        return this._get('stream_standard.list');
    },
    getStreamStandardScope: function () {
        return this._get('stream_standard.scope');
    },
    getSelectedStreamStandardIndex: function () {
        var list = this.getStreamStandardList();
        var value = this.getStreamStandardValue();

        var res = _.filter(list, function (v, i) {
            v.index = parseInt(i, 10);
            return v.value == value;
        });

        if (!res.length)
            return -1;

        return res[0].index;
    }
});