/**
 * @class DataSourceFactory
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/22/15 1:17 PM
 */
function DataSourceFactory(name) {
    if (!name)
        name = 'Default';

    name = name.toLowerCase();

    // Capitalize the first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);

    var className = name + 'DataSourceDriver';

    if (!window[className]) {
        console.error('Error: no ' + className + ' found. I will create DefaultDataSourceDriver');
        className = 'DefaultDataSourceDriver';
    }

    var driver = new window[className]();
    return driver;
}

/**
 * Create cache driver
 * @returns {CacheDataSourceDriver}
 * @memberof DataSource#
 */
DataSourceFactory.createCacheDriver = function () {
    return DataSourceFactory('cache');
};

/**
 * Create aggregator driver
 * @returns {AggregatorDataSourceDriver}
 * @memberof DataSource#
 */
DataSourceFactory.createAggregatorDriver = function () {
    return DataSourceFactory('aggregator');
};