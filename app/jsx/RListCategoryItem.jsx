/**
 * @date 8/7/15 12:38 PM
 */
var RListCategoryItem = React.createClass({
    render: function () {
        return (<li className={this.props.selected ? 'selected' : ''}>
                    <img src={this.props.item.icon} alt="" className="list-right-icon" />
                    <p>{this.props.item.title}</p>
                </li>)
    }
});