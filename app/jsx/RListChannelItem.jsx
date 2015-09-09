/**
 * @date 8/7/15 12:38 PM
 */
var RListChannelItem = React.createClass({
    render: function () {
        return <li className={this.props.selected ? 'selected' : ''}>
            <img src={this.props.logotype} alt="" />
            {this.props.title}
        </li>
    }
});