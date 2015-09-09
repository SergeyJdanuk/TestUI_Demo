/**
 * @date 8/11/15 1:36 PM
 */
var RNetworkSetupList = React.createClass({
    getInitialState: function () {
        return {
            selectedIndex: this.props.selectedIndex,
            focused: this.props.focused
        }
    },
    getDefaultProps: function () {
        return {
            selectedIndex: 0,
            items: [],
            count: 5,
            zIndex: 0,
            focused: true
        }
    },
    propTypes: {
        selectedIndex: React.PropTypes.number,
        items: React.PropTypes.array,
        count: React.PropTypes.number,
        zIndex: React.PropTypes.number
    },
    componentDidMount: function () {
        if (this.props.focused !== false)
            this.subscribe();
    },
    componentWillUnmount: function () {
        this.unsubscribe();
    },
    keyUp: function () {
        var i = this.getSelectedIndex();
        if(--i < 0) {
            i = this.props.items.length - 1;
            if (this.onOffside('top') === false)
                return;
            if (this.onOffsideTop() === false)
                return;
        }
        this.setSelectedIndex(i);
    },
    keyDown: function () {
        var i = this.getSelectedIndex();
        if(++i >= this.props.items.length) {
            i = 0;
            if (this.onOffside('bottom') === false)
                return;
        }
        this.setSelectedIndex(i);
    },
    keyEnter: function () {
        if (_.isFunction(this.props.onEnter))
            return this.props.onEnter(this.getSelected());
    },
    keyReturn: function () {
        if (_.isFunction(this.props.onReturn))
            return this.props.onReturn(this);
    },
    onOffsideTop: function () {
        if (_.isFunction(this.props.onOffsideTop))
            return this.props.onOffsideTop(this);
    },
    onOffside: function (dir) {
        if (_.isFunction(this.props.onOffside))
            return this.props.onOffside(dir)
    },
    focusOut: function () {
        this.setState({focused: false});
        this.unsubscribe();
    },
    focusIn: function () {
        this.setState({focused: true});
        this.subscribe();
    },
    subscribe: function () {
        keyboardObserver.on('Up', this.keyUp, this);
        keyboardObserver.on('Down', this.keyDown, this);
        keyboardObserver.on('keyboardEnter', this.keyEnter, this);
        keyboardObserver.on('return', this.keyReturn, this);
    },
    unsubscribe: function () {
        keyboardObserver.off(null, null, this);
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
    getSelectedItem: function () {
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
            elements.push(<RListItem key={'list-item-' + i} title={items[i].title} selected={this.state.selectedIndex == i}/>);
        }

        var classes = React.addons.classSet({
            'list-container': 1,
            'inactive': !this.state.focused,
            'dropdown': this.props.dropdown != undefined
        });

        var styles = {
            zIndex: this.props.zIndex,
            position: this.props.zIndex != 0 ? 'relative' : 'inherit',
            width : this.props.width ? this.props.width : ''
        };

        if (this.props.styleBoxShadow)
            styles['box-shadow'] = this.props.styleBoxShadow;

        return <div className={classes} style={styles}>
            <ul>{elements}</ul>
        </div>
    }
});