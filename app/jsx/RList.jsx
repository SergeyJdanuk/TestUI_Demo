/**
 * @date 8/6/15 10:11 AM
 */
var RList = React.createClass({
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
                focused: false
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
                if (this.onOffside('top'))
                    return this.focusOut();
            }
            this.setSelectedIndex(i);
        },
        keyDown: function () {
            var i = this.getSelectedIndex();
            if(++i >= this.props.items.length) {
                i = 0;
                if (this.onOffside('bottom'))
                    return this.focusOut();
            }
            this.setSelectedIndex(i);
        },
        keyRight: function () {
            if (this.onOffside('right'))
                this.focusOut();
        },
        keyLeft: function () {
            if (this.onOffside('left'))
                this.focusOut();
        },
        keyEnter: function () {
            if (_.isFunction(this.props.onEnter))
                return this.props.onEnter(this.getSelected());
        },
        keyReturn: function () {
            if (_.isFunction(this.props.onReturn))
                return this.props.onReturn(this);
        },
        onOffside: function (dir) {
            if (_.isFunction(this.props.onOffside))
                return this.props.onOffside(dir);

            var canFocusOut = true;

            switch(dir) {
                case 'top':    canFocusOut = _.isFunction(this.props.onOffsideTop) && this.props.onOffsideTop(); break;
                case 'bottom': canFocusOut = _.isFunction(this.props.onOffsideBottom) && this.props.onOffsideBottom(); break;
                case 'left':   canFocusOut = _.isFunction(this.props.onOffsideLeft) && this.props.onOffsideLeft(); break;
                case 'right':  canFocusOut = _.isFunction(this.props.onOffsideRight) && this.props.onOffsideRight(); break;
            }

            return (canFocusOut !== false);
        },
        focusOut: function () {
            this.setState({focused: false});
            this.unsubscribe();
            return true;
        },
        focusIn: function () {
            if (this.props.items.length == 0)
                return false;
            this.setState({focused: true});
            this.subscribe();
            return true;
        },
        subscribe: function () {
            keyboardObserver.on('Up', this.keyUp, this);
            keyboardObserver.on('Down', this.keyDown, this);
            keyboardObserver.on('Right', this.keyRight, this);
            keyboardObserver.on('Left', this.keyLeft, this);
            keyboardObserver.on('keyboardEnter', this.keyEnter, this);
            keyboardObserver.on('return', this.keyReturn, this);
        },
        unsubscribe: function () {
            keyboardObserver.off(null, null, this);
        },
        setSelectedIndex: function (index) {
            this.setState({selectedIndex: index});
            if (_.isFunction(this.props.onChangeItem))
                return this.props.onChangeItem(this.getSelected());
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
                var el = '';
                switch(this.props.itemType) {
                    case 'category':
                        el = <RListCategoryItem key={'list-item-' + i} item={items[i]} selected={this.state.selectedIndex == i} />
                        break;
                    default:
                        el = <RListItem key={'list-item-' + i} title={items[i].title} selected={this.state.selectedIndex == i} />
                }
                elements.push(el);
            }

            var classes = React.addons.classSet({
                'list-container': 1,
                'inactive': !this.state.focused,
                'dropdown': this.props.dropdown != undefined
            });

            var styles = {};
            if (this.props.width)
                styles.width = this.props.width;

            return <div className={classes} style={styles}>
                <ul>{elements}</ul>
            </div>
        }
});