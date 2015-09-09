/**
 * @class Provider
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/20/15 2:39 PM
 * @example
 *
 * var provider = new Provider({name: 'Megogo'});
 * // or
 * var provider = Provider.createKartinaTV();
 * 
 *
 */
function Provider(params) {
    var name = 'Fake';

    if (_.isObject(params))
        name = params.name;

    if (!Provider[name])
        name = 'Fake';

    return new Provider[name](params);
}

Provider.createKartinaTV = function() {
    return Provider({
        name: 'KartinaTV',
        id: 'KartinaTV'
    });
};