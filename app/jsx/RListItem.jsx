/**
 * @date 8/7/15 12:38 PM
 */
var RListItem = React.createClass({
    render: function () {
        return <li className={this.props.selected ? 'selected' : ''}>{this.props.title}</li>
    }
});