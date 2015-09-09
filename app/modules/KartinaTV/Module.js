/**
 * @date 8/3/15 10:46 AM
 */
App.module("KartinaTV", function (Mod, App, Backbone, Marionette, $, _) {

    function isAuthData() {
        var login = settings.get('auth.login');
        var password = settings.get('auth.password');
        return (login && password);
    }

    function loginRequest(login, password) {
        return new Promise(function (resolve, reject) {
            var p = Provider.createKartinaTV();
            p.login(login, password).then(resolve, reject);
        });
    }

    ////////////////////////////////////////////////////////////////////////////

    Mod.form = function(login, password) {
        login = login || '';
        password = password || '';

        App.UI.AuthDialog({
            login: login,
            password: password,
            onOk: function () {
                var auth = this;
                var login = this.getLogin();
                var password = this.getPassword();
                (function doLogin() {
                    loginRequest(login, password).then(
                        function success() {
                            auth.close();
                            settings.set('auth.login', login);
                            settings.set('auth.password', password);
                            App.navigate('wizard/completed');
                        },
                        function error(message, code) {

                            if (message == 'Network error')
                                return App.UI.MessageBox({caption: __('Error'),message: __(message),onOK: function () {
                                    this.close();
                                    Mod.form(login, password);
                                }});

                            App.UI.OptionDialog({
                                caption: __('Error'),
                                message: __(message),
                                buttons: [
                                    {caption: __('Edit'),onEnter: function () {
                                        Mod.form(login, password);
                                    }},
                                    {caption: __('Skip'),onEnter: function () {
                                        this.close();
                                        App.navigate('wizard/completed');
                                    }},
                                    {caption: __('Repeat'),onEnter: function () {
                                        this.close();
                                        doLogin();
                                    }}
                                ]
                            });
                        }
                    );
                })();
            },
            onCancel: function () {
                this.close();
                App.navigate('wizard/completed');
            },
            onError: function (message) {
                App.UI.MessageBox({caption: __('Error'),message: __(message),onOK: App.back});
            }
        });
    };

    Mod.auth = function (networkErrorCallback) {
        if (!isAuthData())
            return App.navigate('auth/form');

        var login = settings.get('auth.login');
        var password = settings.get('auth.password');

        (function doLogin() {
            loginRequest(login, password).then(
                function success() {
                    App.navigate('wizard/completed');
                },
                function error(message, code) {
                    if (message == 'Network error')
                        return App.UI.MessageBox({caption: __('Error'),message: __(message),onOK: function () {
                            this.close();
                            if (_.isFunction(networkErrorCallback()))
                                networkErrorCallback();
                        }});

                    App.UI.OptionDialog({
                        caption: __('Error'),
                        message: __(message),
                        buttons: [
                            {caption: __('Edit'), onEnter: function () {
                                Mod.form(login, password);
                            }},
                            {caption: __('Skip'), onEnter: function () {
                                this.close();
                                App.navigate('wizard/completed');
                            }},
                            {caption: __('Repeat'), onEnter: function () {
                                this.close();
                                doLogin();
                            }}
                        ]
                    });
                }
            );
        })();
    };


    Mod.on('start', function () {
        console.log('KartinaTV::onstart');
    })
});