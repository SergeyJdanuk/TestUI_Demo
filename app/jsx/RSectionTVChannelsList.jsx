/**
 * @date 8/18/15 5:52 PM
 */
var RSectionTVChannelsList = React.createClass({
    getInitialState: function () {
        return {
            items: [
                {title: "channel 1", value: 1},
                {title: "channel 2", value: 2},
                {title: "channel 3", value: 3},
                {title: "channel 4", value: 4},
                {title: "channel 5", value: 5}
            ]
        }
    },
    componentDidMount: function () {
    },
    componentWillUnmount: function () {

    },
    focusIn: function () {
        console.log('RSectionTVChannelsList::focusIn');
        return this.refs.list.focusIn();
    },
    focusOut: function () {
        console.log('RSectionTVChannelsList::focusOut');
        return this.refs.list.focusOut();
    },
    onOffsideLeft: function () {
        if (_.isFunction(this.props.onOffsideLeft))
            return this.props.onOffsideLeft();
    },
    render: function () {
        return <div id="channels" className="pos2 list">
                <RList
                    ref="list"
                    style="channels"
                    items={this.state.items}
                    onOffsideLeft={this.onOffsideLeft}
                    />
            </div>
    }
});