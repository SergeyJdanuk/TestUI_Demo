/**
 * @date 8/7/15 5:54 PM
 */
var RButton = React.createClass({
    componentDidMount: function () {
        if(_.isFunction(this.props.onControlRectCallback)) {
            var boundingRect = React.findDOMNode(this).getBoundingClientRect()
            var rect = {x: boundingRect.left, y:boundingRect.top, width: boundingRect.width, height: boundingRect.height};
            this.props.onControlRectCallback(rect);
        }
    },

    render: function () {
        var params = _.defaults(this.props.params, {x: 0, y: 0, width: 0, height: 0});

        var style = {
            position: 'absolute',
            top: params.x + '%',
            left: params.y + '%',
            width: params.width + '%',
            height: params.height + '%'
        };
        return <button onControlRectCallback={this.props.onControlRectCallback} className="ui-button" style={style}></button>
    }
});