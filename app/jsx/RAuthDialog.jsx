/** @jsx React.DOM */
var RAuthDialog = React.createClass({

    getInitialState: function () {
        return {
            selected: 'login',
            login: this.props.login,
            password: this.props.password,
            isError: false,
            errorMessage: ''
        };
    },
    componentDidMount: function () {
        this.element = 0;

        this.LOGIN = 0;
        this.PASSWORD = 1;
        this.BUTTON_OK = 2;
        this.BUTTON_CANCEL = 3;

        this.elements = [];
        this.elements[this.LOGIN] = 'login';
        this.elements[this.PASSWORD] = 'password';
        this.elements[this.BUTTON_OK] = 'button-ok';
        this.elements[this.BUTTON_CANCEL] = 'button-cancel';

        keyboardObserver.on('Down', this.keyDown, this);
        keyboardObserver.on('Up', this.keyUp, this);
        keyboardObserver.on('Right', this.keyRight, this);
        keyboardObserver.on('Left', this.keyLeft, this);
        keyboardObserver.on('keyboardNumber', this.keyNumber, this);
        keyboardObserver.on('Clear', this.keyDelete, this);
        keyboardObserver.on('keyboardEnter', this.keyEnter, this);
    },
    componentWillUnmount: function () {
        console.log('RAuthDialog::componentWillUnmount');
        keyboardObserver.off(null, null, this);
    },
    getSelectedElement: function () {
        return this.elements[this.element];
    },
    setLogin: function (value) {
        this.setState({login: value});
    },
    setPassword: function (value) {
        this.setState({password: value});
    },
    select: function (index) {
        this.element = index;
        this.setState({selected: this.elements[index]});
    },
    keyUp: function () {
        if (this.element == this.BUTTON_CANCEL)
            return this.select(this.PASSWORD);
        if (this.element == this.LOGIN)
            return;
        if (--this.element < 0)
            this.element = this.elements.length - 1;
        this.select(this.element);
    },
    keyDown: function () {
        if (this.element == this.BUTTON_OK || this.element == this.BUTTON_CANCEL)
            return;
        if (++this.element >= this.elements.length)
            this.element=0;
        this.select(this.element);
    },
    keyNumber: function(num) {
        switch (this.getSelectedElement()) {
            case 'login':
                this.setLogin(this.state.login + num);
                break;
            case 'password':
                this.setPassword(this.state.password + num);
                break;
        }
    },
    keyRight: function() {
        if (this.getSelectedElement() == 'button-ok')
            this.select(this.BUTTON_CANCEL);
    },
    keyLeft: function() {
        if (this.getSelectedElement() == 'button-cancel')
            this.select(this.BUTTON_OK);
    },
    keyDelete: function () {
        switch (this.getSelectedElement()) {
            case 'login':
                this.setLogin(this.state.login.slice(0, this.state.login.length - 1));
                break;
            case 'password':
                this.setPassword(this.state.password.slice(0, this.state.password.length - 1));
                break;
        }
    },
    keyEnter: function () {
        switch(this.getSelectedElement()) {
            case 'button-cancel':
                if (_.isFunction(this.props.onOk))
                    this.props.onCancel.call(this);
                break;
            case 'button-ok':
                if (!this.state.login.length || !this.state.password.length) {
                    if (_.isFunction(this.props.onError))
                        this.props.onError.call(this, __('You must enter your KartinaTV login and password'));
                } else {
                    if (_.isFunction(this.props.onOk))
                        this.props.onOk.call(this);
                }
                break;
        }
    },
    getLogin: function() {
        return this.state.login;
    },
    getPassword: function () {
        return this.state.password;
    },
    close: function () {
        React.unmountComponentAtNode(this.getDOMNode().parentNode);
    },
    render: function () {
        return (
            <div className='authorization'>
                <div className='dlg-container'>
                    <div className='dlg-border'>
                        <div className="dlg-caption">{__('Enter login and password')}</div>
                        <div className="dlg-content">
                            <input type='text' value={this.state.login} className={this.state.selected == 'login' ? 'selected' : ''} />
                            <br />
                            <input type='password' value={this.state.password} className={this.state.selected == 'password' ? 'selected' : ''} />
                            <br />
                            <div className='dlg-buttons'>
                                <button className={this.state.selected == 'button-ok' ? 'selected' : ''}>{__('OK')}</button>
                                <button className={this.state.selected == 'button-cancel' ? 'selected' : ''}>{__('Cancel')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});