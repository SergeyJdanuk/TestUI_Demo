/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 6/25/15 8:46 AM
 * 
 * History  : 
 */
App.module("Config", function(Config, App, Backbone, Marionette, Zepto, _) {

    var deep_value = function(obj, path){
        for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
            if (!obj[path[i]]) {
                console.error('Can not find config path "' + path.join('.') + '"');
                return undefined;
            }
            obj = obj[path[i]];
        };
        return obj;
    };

    this.get = function(path) {
        return deep_value(config, path);
    }

});