/**
 * @date 8/12/15 2:20 PM
 */

////////////////////////////////////////////////////////////////////////////////
/// RKeyboardRowItem ///////////////////////////////////////////////////////////
var RKeyboardRowItem = React.createClass({
    render: function () {
        var className = this.props.className ? this.props.className : 'key'
        return <div className={className}>{this.props.value}</div>
    }
});

////////////////////////////////////////////////////////////////////////////////
/// RKeyboardRow ///////////////////////////////////////////////////////////////
var RKeyboardRow = React.createClass({
    render: function () {
        return <div className="keys-row">{this.props.children}</div>
    }
});

////////////////////////////////////////////////////////////////////////////////
/// RKeyboardRows //////////////////////////////////////////////////////////////
var RKeyboardRows = React.createClass({
    render: function () {
        return <div className="keys">{this.props.children.map(function(v) {
            return v
        })}</div>
    }
});

////////////////////////////////////////////////////////////////////////////////
/// RKeyboard //////////////////////////////////////////////////////////////////
var RKeyboard = React.createClass({
    getInitialState: function () {
        return {
            value: this.props.value,
            isAlphabeticalLayout: true,
            selectedRowIndex: 0,
            selectedRowItemIndex: 0
        }
    },
    getDefaultProps: function () {
        return {
            value: ''
        }
    },
    isAlphabeticalLayout: function () {
        return this.state.isAlphabeticalLayout;
    },

    subscribe: function () {
        keyboardObserver.on('Up', this.keyUp, this);
        keyboardObserver.on('Down', this.keyDown, this);
        keyboardObserver.on('Left', this.keyLeft, this);
        keyboardObserver.on('Right', this.keyRight, this);
        keyboardObserver.on('keyboardEnter', this.keyEnter, this);
        keyboardObserver.on('keyboardNumber', this.keyNumber, this);
        keyboardObserver.on('Clear', this.keyDelete, this);
    },
    unsubscribe: function () {
        keyboardObserver.off(null, null, this);
    },
    appendToInput: function (text) {
        this.setState({value: this.state.value += text});
    },
    deleteLastCharFromInput: function () {
        var t = this.state.value;
        if (t.length > 0)
            t = t.slice(0, -1);
        this.setState({value: this.state.value = t});
    },
    keyNumber: function (n) {
        this.setState({value: this.state.value += n});
    },
    keyDelete: function () {
        this.deleteLastCharFromInput();
    },
    keyUp: function () {
        this.cursor.setActiveNearControl(12);
    },
    keyDown: function () {
        this.cursor.setActiveNearControl(6);
    },
    keyLeft: function () {
        this.cursor.setActiveNearControl(9);
    },
    keyRight: function () {
        this.cursor.setActiveNearControl(3);
    },
    keyEnter: function () {
        var that = this;
        var el = this.cursor.getCurrentControl();
        var text = Zepto(el.data()).html();


        switch (text) {
            case 'EN':
                break;
            case 'shift':
                this.isShifted = !this.isShifted;
                this.cursor.each(function (iter) {
                    var i = iter.data();
                    var text = Zepto(i).html();
                    if (text == 'EN' || text == 'shift' || text == 'OK')
                        return;
                    text = that.isShifted ? text.toUpperCase() : text.toLowerCase();
                    Zepto(i).html(text);
                });
                break;
            case '&lt;': /* < */
                this.deleteLastCharFromInput();
                break;
            case 'OK':
                this.close();
                if (_.isFunction(this.props.onOK))
                    this.props.onOK(this.state.value);
                break;
            default:
                this.appendToInput(text);
        }
    },

    close: function () {
        var node = this.getDOMNode().parentNode;
        React.unmountComponentAtNode(node);
        node.parentNode.removeChild(node);
    },
    componentDidMount: function () {
        this.isShifted = false;
        this.cursor = new LibCursor();

        var elements = Zepto(this.getDOMNode()).find('.key');

        for (var j = 0, len = elements.length; j < len; j++) {
          var i = elements[j];
          var position = Zepto(i).position();
          this.cursor.addCoord(parseInt(position.left), parseInt(position.top), parseInt(Zepto(i).width()), parseInt(Zepto(i).height()), i);
        }

        this.cursor.onSelect = _.bind(this.onSelect, this);
        this.cursor.onUnselect = _.bind(this.onUnselect, this);
        this.cursor.onBeforeSelect = _.bind(this.onBeforeSelect, this);

        this.cursor.selectByIndex(2);

        this.subscribe();

    },
    onSelect: function (el) {
        Zepto(el).addClass('selected');
    },
    onUnselect: function (el) {
        Zepto(el).removeClass('selected');
    },
    onBeforeSelect: function () {
        return false;
    },
    getSelectedRowIndex: function () {
        return this.state.selectedRowIndex;
    },
    componentWillUnmount: function () {
        this.unsubscribe();
    },

    getAlphabeticalLayout: function () {
        return (<div className="keyboard-content">
                    <div className="input-container">
                        <input value={this.state.value} />
                        <RKeyboardRowItem value="&lt;" className="key clear" />
                        <RKeyboardRowItem value="OK" className="key ok" />
                    </div>
                    <RKeyboardRows>
                        <RKeyboardRow>
                            <RKeyboardRowItem value="1" />
                            <RKeyboardRowItem value="2" />
                            <RKeyboardRowItem value="3" />
                            <RKeyboardRowItem value="4" />
                            <RKeyboardRowItem value="5" />
                            <RKeyboardRowItem value="6" />
                            <RKeyboardRowItem value="7" />
                            <RKeyboardRowItem value="8" />
                            <RKeyboardRowItem value="9" />
                            <RKeyboardRowItem value="0" />
                            <RKeyboardRowItem value="!" />
                            <RKeyboardRowItem value="@" />
                            <RKeyboardRowItem value="#" />
                            <RKeyboardRowItem value="%" />
                            <RKeyboardRowItem value=";" />
                        </RKeyboardRow>
                        <RKeyboardRow>
                            <RKeyboardRowItem value="a" />
                            <RKeyboardRowItem value="b" />
                            <RKeyboardRowItem value="c" />
                            <RKeyboardRowItem value="d" />
                            <RKeyboardRowItem value="e" />
                            <RKeyboardRowItem value="f" />
                            <RKeyboardRowItem value="g" />
                            <RKeyboardRowItem value="h" />
                            <RKeyboardRowItem value="i" />
                            <RKeyboardRowItem value="." />
                            <RKeyboardRowItem value="&" />
                            <RKeyboardRowItem value="*" />
                            <RKeyboardRowItem value="(" />
                            <RKeyboardRowItem value=")" />
                            <RKeyboardRowItem value=":" />
                        </RKeyboardRow>
                        <RKeyboardRow>
                            <RKeyboardRowItem value="j" />
                            <RKeyboardRowItem value="k" />
                            <RKeyboardRowItem value="l" />
                            <RKeyboardRowItem value="n" />
                            <RKeyboardRowItem value="m" />
                            <RKeyboardRowItem value="o" />
                            <RKeyboardRowItem value="p" />
                            <RKeyboardRowItem value="q" />
                            <RKeyboardRowItem value="r" />
                            <RKeyboardRowItem value='"' />
                            <RKeyboardRowItem value="$" />
                            <RKeyboardRowItem value="^" />
                            <RKeyboardRowItem value="[" />
                            <RKeyboardRowItem value="]" />
                            <RKeyboardRowItem value="\" />
                        </RKeyboardRow>
                        <RKeyboardRow>
                            <RKeyboardRowItem value="s" />
                            <RKeyboardRowItem value="t" />
                            <RKeyboardRowItem value="u" />
                            <RKeyboardRowItem value="v" />
                            <RKeyboardRowItem value="w" />
                            <RKeyboardRowItem value="x" />
                            <RKeyboardRowItem value="y" />
                            <RKeyboardRowItem value="z" />
                            <RKeyboardRowItem value="," />
                            <RKeyboardRowItem value="!" />
                            <RKeyboardRowItem value="?" />
                            <RKeyboardRowItem value="+" />
                            <RKeyboardRowItem value="{" />
                            <RKeyboardRowItem value="}" />
                            <RKeyboardRowItem value="|" />
                        </RKeyboardRow>
                        <RKeyboardRow>
                            <RKeyboardRowItem value="EN" className="key change-layout" />
                            <RKeyboardRowItem value=" " className="key space" />
                            <RKeyboardRowItem value="shift" className="key shift" />

                            <RKeyboardRowItem value="_" />
                            <RKeyboardRowItem value="-" />
                            <RKeyboardRowItem value="<" />
                            <RKeyboardRowItem value=">" />
                            <RKeyboardRowItem value="/" />
                        </RKeyboardRow>

                    </RKeyboardRows>
                </div>)
    },

    getEntityLayout: function () {
        return (<div className="keyboard-content" style='display:none'>
                    <div className="input"></div>
                    <div className="keys">
                        <div className="numeric-keys">
                            <RKeyboardRow keys=", . / ? ! @ # $ % ^" />
                        </div>
                        <div className="alphabetical-keys">
                            <RKeyboardRow keys="&amp; * ( ) - + { } [ ]" />
                            <RKeyboardRow keys='; : \ " | \ / < > &sect;' />
                            <div className="keys-row">
                                <div className='key change-layout'>abc</div>
                                <div className='key change-language'>EN</div>
                                <div className='key space'></div>
                                <div className='key shift'>shift</div>
                                <div className='key ok'>OK</div>
                                <div className='key clear'>&lt;</div>
                            </div>
                        </div>
                    </div>
                </div>)
    },

    render: function () {
        var layout = this.isAlphabeticalLayout()
            ? this.getAlphabeticalLayout()
            : this.getEntityLayout();

        return <div className="keyboard-container">
                    <div className="keyboard-wrapper">
                        {layout}
                    </div>
                </div>
    }
});