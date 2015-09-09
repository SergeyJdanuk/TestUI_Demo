/** @jsx React.DOM */
var ROptionDialog = React.createClass({
    getInitialState: function () {
        return {
            selected: 0
        };
    },
    componentDidMount: function () {
        this.index = 0;

        keyboardObserver.on('keyboardEnter', this.keyEnter, this);
        keyboardObserver.on('Left', this.keyLeft, this);
        keyboardObserver.on('Right', this.keyRight, this);
    },
    componentWillUnmount: function () {
        keyboardObserver.off(null, null, this);
    },
    getSelected: function () {
        return this.props.buttons[this.index];
    },
    selectNextButton: function () {
        if (++this.index >= this.props.buttons.length)
            this.index = 0;
        this.setState({selected: this.index});
    },
    selectPrevButton: function () {
        if (--this.index < 0)
            this.index =  this.props.buttons.length - 1;
        this.setState({selected: this.index});
    },
    keyEnter: function () {
        var selected = this.getSelected();
        if (!selected)
            return;

        if (_.isFunction(selected.onEnter))
            selected.onEnter.call(this);
    },
    keyRight: function() {
        this.selectNextButton();
    },
    keyLeft: function() {
        this.selectPrevButton();
    },
    close: function () {
        React.unmountComponentAtNode(this.getDOMNode().parentNode);
    },
    render: function () {
        var that = this;
        var buttons = [];

        if (this.props.buttons) {
            buttons = this.props.buttons.map(function (v, i) {
                return (<button className={that.state.selected == i ? 'selected' : ''}>{v.caption ? v.caption : 'Button-'+i}</button>)
            });
        }

        return (
            <div className='dlg-container'>
                <div className='dlg-border'>
                    <div className="dlg-caption">{this.props.caption}</div>
                    <div className="dlg-content">
                        <p>{this.props.message}</p>
                        <br />
                        <div className='dlg-buttons'>
                            {buttons}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});