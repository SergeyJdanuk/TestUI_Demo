/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/23/15 4:21 PM
 * 
 * History  : 
 */
Grid.Factory = function (name, container, collection) {

    name.toLowerCase()
    // Capitalize the first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);

    var viewClassName = name + 'View';
    var modelClassName = name + 'Model';

    var model = new Grid[modelClassName]({collection: collection});

    var view = new Grid[viewClassName]({el: container, model: model});

    return model;
};