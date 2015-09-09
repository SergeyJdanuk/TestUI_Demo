/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/27/15 2:11 PM
 * 
 * History  :
 *
 */
var List = function (collection) {
	if (!collection)
		collection = new List.Collection();
    var model = new List.Model({collection: collection});
    var controller = new List.Controller({model: model});
    return controller;
};