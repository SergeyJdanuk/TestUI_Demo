/**
 * @date 8/12/15 12:29 PM
 */
var RDropdown = React.createClass({
    TYPE_DEFAULT: 0,
    TYPE_DROPDOWN: 1,
    getInitialState: function () {
        return {
            type: this.TYPE_DEFAULT,
            text: this.props.text,
            value: this.props.value,
            selected: this.props.selected,
            selectedIndex: this.props.selectedIndex
        }
    },

    getDefaultProps: function () {
        return {
            text: '',
            value: '',
            selected: false,
            selectedIndex: 0,
            focused: false,
            items: []
        }
    },
    componentDidMount: function () {
        if (this.props.focused)
            this.select();

        if (this.props.items.length)
            this.setState({
                value: this.props.items[this.state.selectedIndex].value,
                text: this.props.items[this.state.selectedIndex].title
            })
    },
    componentWillUnmount: function () {
        this.unselect();
    },
    setType: function (type) {
        this.setState({type: type});
    },
    setSelectedIndex: function (index) {
        this.setState({selectedIndex: index});
    },
    isTypeEqual: function (type) {
        return this.state.type == type;
    },
    focusIn: function () {
        this.select();
    },
    focusOut: function () {
        this.unselect();
    },
    select: function () {
        this.setState({selected: true});
        this.subscribe();
    },
    unselect: function () {
        this.setState({selected: false});
        this.unsubscribe();
    },
    value: function (val) {
        if (val === undefined)
            return this.state.value;
        this.setState({value: val});
    },
    text: function (text) {
        if (text === undefined)
            return this.state.text;
        this.setState({text: text});
    },
    subscribe: function () {
        keyboardObserver.on('Up', this.keyUp, this);
        keyboardObserver.on('Down', this.keyDown, this);
        keyboardObserver.on('keyboardEnter', this.keyEnter, this);
    },
    unsubscribe: function () {
        keyboardObserver.off(null, null, this);
    },
    keyUp: function () {
        if(_.isFunction(this.props.onLeave))
            return this.props.onLeave('top');
        if (this.onOffside('top'))
            this.focusOut();
    },
    keyDown: function () {
        if(_.isFunction(this.props.onLeave))
            return this.props.onLeave('bottom');
        if (this.onOffside('bottom'))
            this.focusOut();
    },
    keyEnter: function (item) {
        if (this.isTypeEqual(this.TYPE_DEFAULT)) {
            this.unselect();
            return this.setType(this.TYPE_DROPDOWN);
        }
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
    onListEnter: function (item) {
        this.select();
        this.setState({
            text: item.title,
            value: item.value,
            selectedIndex: this.refs.list.getSelectedIndex()
        });
        return this.setType(this.TYPE_DEFAULT);
    },
    onListReturn: function () {
        this.select();
        this.setType(this.TYPE_DEFAULT);
    },
    getDefaultRender: function () {
        var classes = React.addons.classSet({
            input: true,
            selected: this.state.selected
        });

        var item = {title: ''};

        if (_.isArray(this.props.items) && this.props.items.length)
            item =  this.props.items[this.state.selectedIndex];

        return <div className="dropdown-container">
                    <div className="dropdown-wrapper">
                        <div className="dropdown-content">
                            <div className={classes}>{item.title}<i className="arrow-down"></i></div>
                        </div>
                    </div>
                </div>
    },
    getSelectedItem: function () {
        return this.props.items[this.state.selectedIndex];
    },
    getDropdownRender: function () {
        var classes = React.addons.classSet({
            input: true,
            selected: this.state.selected
        });

        var item = {title: ''};

        if (_.isArray(this.props.items) && this.props.items.length)
            item =  this.props.items[this.state.selectedIndex];

        return <div className="dropdown-container">
                    <div className="dropdown-wrapper">
                        <div className="dropdown-content">
                                <div className={classes}>{item.title}<i className="arrow-down"></i></div>
                                <RList
                                    ref="list"
                                    count={3}
                                    focused={true}
                                    items={this.props.items}
                                    onEnter={this.onListEnter}
                                    onReturn={this.onListReturn}
                                    zIndex={9999}
                                    dropdown={true}
                                    width="100%"
                                    selectedIndex={this.state.selectedIndex}/>
                            </div>
                        </div>
                    </div>
    },
    render: function () {
        if (this.isTypeEqual(this.TYPE_DEFAULT))
            return this.getDefaultRender();
        if (this.isTypeEqual(this.TYPE_DROPDOWN))
            return this.getDropdownRender();
    }
});