/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 6/25/15 8:43 AM
 * 
 * History  : 
 */
App.module("I18n", function(I18n, App, Backbone, Marionette, Zepto, _) {

    var indexedList = null;
    var list = null;
    var current_language_code = null;
    var self = this;

    this.getCurrentLanguageCode = function () {
        return current_language_code;
    };

    this.code = function () {
        return this.getCurrentLanguageCode();
    };

    this.setDefaultLanguage = function (code) {
        current_language_code = code;
        settings.set('I18n.languages.default', code);
        localization.setCurrentLanguage(code);
    };

    this.getLanguages = function() {
        return list;
    };

    I18n.on('start', function () {
        indexedList = settings.get('I18n.languages.indexedList');
        list = settings.get('I18n.languages.list');
        current_language_code = settings.get('I18n.languages.default');
    });

    window.__ = function(string, params) {
        var lang = I18n_Translations[self.code()];
        var str = lang[string];

        function replace(s, p) {
            if (!p) return s;
            for (var i in params)
                s = s.replace(':' + i, params[i]);
            return s;
        }

        if (!str) {
            if (self.code() != 'en')
                console.warn('No translate for: ' + string);
            return replace(string, params);
        }

        return replace(str, params);
    };
});