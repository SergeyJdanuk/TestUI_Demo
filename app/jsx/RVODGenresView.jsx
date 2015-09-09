/**
 * Created by sergiyjdanuk on 8/6/15.
 */
var RGenresView = React.createClass({
    getInitialState: function () {
        return {
            selectedIndex: this.props.selectedIndex
        }
    },
    getDefaultProps: function () {
        return {
            selectedIndex: 0,
            items: [],
            count: 5
        }
    },
    propTypes: {
        selectedIndex: React.PropTypes.number,
        items: React.PropTypes.array,
        count: React.PropTypes.number
    },
    componentDidMount: function () {
        keyboardObserver.off(null, null, null);
        keyboardObserver.on('Up', this.keyUp, this);
        keyboardObserver.on('Down', this.keyDown, this);
        keyboardObserver.on('keyboardEnter', this.keyEnter, this);
    },
    componentWillUnmount: function () {
        keyboardObserver.off(null, null, this);
    },
    keyUp: function () {
        var i = this.getSelectedIndex();
        if(--i < 0)
            i = this.props.items.length - 1;
        this.setSelectedIndex(i);
    },
    keyDown: function () {
        var i = this.getSelectedIndex();
        if(++i >= this.props.items.length)
            i = 0;
        this.setSelectedIndex(i);
    },
    keyEnter: function () {
        if (_.isFunction(this.props.onEnter))
            return this.props.onEnter.call(this);
    },
    setSelectedIndex: function (index) {
        this.setState({selectedIndex: index});
    },
    getSelectedIndex: function () {
        return this.state.selectedIndex;
    },
    getSelected: function () {
        return this.props.items[this.getSelectedIndex()];
    },
    render: function () {
        var items = this.props.items;
        var max = items.length;
        var elements = [];
        var count = this.props.count > max ? max : this.props.count;
        var index = this.state.selectedIndex;
        var n = Math.floor(count / 2);
        var begin = index - n;
        begin = (begin < 0 ? 0 : begin);
        var end = begin + count;

        if (index + n < begin)
            begin++;

        if (end > max)
            begin -= (end - max);

        for (var i = begin; i < max && i < end; i++) {
            elements.push (
                <div className={this.state.selectedIndex == i ? 'selected' : ''}>
                    <span className="title">{items[i].getTitle()}</span>
                    <img src="img/vod/categories/gray/korotkometragka.png" alt="ico" className="ico" />
                    <img className="ico selected" src="img/vod/categories/white/korotkometragka.png" alt="ico selected" />
                </div>
            );
        }

        return <div>{elements}</div>
    }
});