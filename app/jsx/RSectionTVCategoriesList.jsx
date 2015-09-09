/**
 * @date 8/18/15 5:52 PM
 */
var RSectionTVCategoriesList = React.createClass({
    getInitialState: function () {
        return {
            categories: App.TV.getCategories(),
            items: []
        }
    },
    componentDidMount: function () {
        if (!App.TV.isReady())
            return App.TV.ready().then(_.bind(this.updateItems, this));
        this.updateItems();
    },
    componentWillUnmount: function () {

    },
    focusIn: function () {
        var isFocused = this.refs.list.focusIn();
        if (isFocused) {
            this.centerFrame();
        }

        return isFocused;
    },
    focusOut: function () {
        return this.refs.list.focusOut();
    },
    offsideWrapper: function (dir) {
        var dirs = {
            left  : 'onOffsideLeft',
            right : 'onOffsideRight',
            top   : 'onOffsideTop',
            bottom: 'onOffsideBottom'
        };
        return _.bind(function () {
            var func = dirs[dir];
            if (_.isFunction(this.props[func]))
                return this.props[func]();
        }, this);
    },
    updateItems: function () {
        this.setState({ items: this.getCategoriesItems() });
        this.refs.list.setSelectedIndex(App.TV.getCategories().getSelectedIndex());
    },
    getCategoriesItems: function () {
        var categories = this.state.categories.models;
        return _.map(categories, function (v) {
            return {title: v.getName(), value: v.getId(), icon: v.getIcon()};
        });
    },
    centerFrame: function () {

    },
    render: function () {
         return <div id="categories" className="pos1 list list-categories">
                <RList
                    ref="list"
                    itemType="category"
                    count={8}
                    items={this.state.items}
                    onOffsideLeft={this.offsideWrapper('left')}
                    onOffsideRight={this.offsideWrapper('right')}
                    onChangeItem={this.props.onChangeItem}
                    onEnter={this.offsideWrapper('right')}
                    />
            </div>
    }
});