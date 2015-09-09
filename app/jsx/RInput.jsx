/**
 * @date 8/12/15 12:29 PM
 */
var RInput = React.createClass({
    getInitialState: function () {
        return {
            value: this.props.value,
            selected: this.props.selected,
            focused: this.props.focused,
            placeholder: this.props.placeholder
        }
    },

    getDefaultProps: function () {
        return {
            value: '',
            selected: false,
            focused: false,
            placeholder: '',
            type: 'input',
            useKeyboard: true
        }
    },
    componentDidMount: function () {
        if (this.state.focused)
            this.subscribe();
    },
    componentWillUnmount: function () {
        this.unsubscribe();
    },

    select: function () {
        this.setState({selected: true});
        this.subscribe();
    },

    value: function (val) {
        if (val === undefined)
            return this.state.value;
        this.setState({value: val});
    },
    focusIn: function () {
        this.select();
    },
    focusOut: function () {
        this.unselect();
    },
    unselect: function () {
        this.setState({selected: false});
        this.unsubscribe();
    },

    subscribe: function () {
        keyboardObserver.on('Up', this.keyUp, this);
        keyboardObserver.on('Down', this.keyDown, this);
        keyboardObserver.on('Right', this.keyRight, this);
        keyboardObserver.on('Left', this.keyLeft, this);
        keyboardObserver.on('keyboardEnter', this.keyEnter, this);
        keyboardObserver.on('keyboardNumber', this.keyNumber, this);
        keyboardObserver.on('Clear', this.keyDelete, this);
    },
    unsubscribe: function () {
        keyboardObserver.off(null, null, this);
    },
    keyNumber: function (n) {
        this.setState({value: this.state.value += n});
    },
    keyDelete: function () {
        this.deleteLastCharFromInput();
    },
    deleteLastCharFromInput: function () {
        var t = this.state.value;
        if (t.length > 0)
            t = t.slice(0, -1);
        this.setState({value: this.state.value = t});
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
    keyRight: function () {
        if (this.onOffside('right'))
            this.focusOut();
    },
    keyLeft: function () {
        if (this.onOffside('left'))
            this.focusOut();
    },

    keyEnter: function () {
        if (!this.props.useKeyboard)
            return;

        this.unselect();
        var that = this;

        App.keyboard({
            value: this.state.value,
            onOK: function (text) {
                that.setState({value: text});
                that.select();
            }
        });
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

        return (canFocusOut !== false);;
    },

    render: function () {
        var classes = React.addons.classSet({
            input: true,
            selected: this.state.selected
        });

        var value = this.state.value;

        if (!value)
            value = <div className="placeholder">{this.state.placeholder}</div>
        else {
            if (this.props.type == 'password') {
                value = this.state.value.replace(/(.)/g, '*');
            }
        }


        return <div className={classes}>{value}</div>
    }
});