/** @jsx React.DOM */
var RMessageBox = React.createClass({
    getInitialState: function () {
        return {
            selected: 'button-ok'
        };
    },
    componentDidMount: function () {
        this.elementIndex = 0;
        this.elements = ['button-ok'];
        keyboardObserver.on('keyboardEnter', this.keyEnter, this);
    },
    componentWillUnmount: function () {
        keyboardObserver.off(null, null, this);
    },
    getSelectedElement: function () {
        return this.elements[this.elementIndex];
    },
    keyEnter: function () {
        if (_.isFunction(this.props.onOK))
            this.props.onOK.call(this);
    },
    close: function () {
        React.unmountComponentAtNode(this.getDOMNode().parentNode);
    },
    render: function () {
        return (
            <div className='dlg-container'>
                <div className='dlg-border'>
                    <div className="dlg-caption">{this.props.caption}</div>
                    <div className="dlg-content">
                        <p>{this.props.message}</p>
                        <br />
                        <div className='dlg-buttons'>
                            <button className={this.state.selected == 'button-ok' ? 'selected' : ''}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});