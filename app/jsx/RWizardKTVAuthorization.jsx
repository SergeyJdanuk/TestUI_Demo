/**
 * @date 8/15/15 5:26 PM
 */
var RWizardKTVAuthorization = React.createClass({
    getInitialState: function () {
        return {
            login: '',
            password: '',

            isLogging: false,
            isErrorMessage: false,
            isErrorLoginMessage: false,
            errorMessage: ''
        }
    },
    componentDidMount: function () {
        this.refs.buttons.focusIn();
    },
    componentWillUnmount: function () {

    },
    close: function () {
        React.unmountComponentAtNode(this.getDOMNode().parentNode);
    },
    focusLogin: function () {
        this.refs.login.focusIn();
    },
    focusPassword: function () {
        this.refs.password.focusIn();
    },
    focusButtons: function () {
        this.refs.buttons.focusIn();
    },
    keyEnter: function (item) {
        if (item.id == 'skip')
            this.onSkip();

        if (item.id == 'ok') {
            this.refs.buttons.focusOut();
            return this.login();
        }
    },
    showErrorMessage: function (message) {
        this.setState({
            isErrorMessage: true,
            errorMessage: message
        });
    },
    showErrorLoginMessage: function (message) {
        this.setState({
            isErrorLoginMessage: true,
            errorMessage: message
        });
    },
    login: function () {

        var login = this.refs.login.value();
        var password =this.refs.password.value();

        if (!login || !password)
            return this.showErrorMessage(__('You must enter your KartinaTV login and password'));

        this.setState({
            isLogging: true,
            login: login,
            password: password
        });

        this.doLogin(login, password)
            .then(this.loginSuccess, this.loginError);
    },
    doLogin: function (login, password) {
        var provider = Provider.createKartinaTV();
        return provider.login(login, password);
    },
    loginSuccess: function () {

        settings.set('auth.login', this.state.login);
        settings.set('auth.password', this.state.password);

        this.setState({isLogging: false});
        this.close();
        this.onComplete()
    },
    onSkip: function () {
        this.close();
        App.navigate('wizard/ktv-completed');
    },
    onComplete: function () {
        App.navigate('wizard/ktv-settings');
    },
    loginError: function (message) {
        setTimeout(_.bind(function() {
            this.setState({isLogging: false});
            this.showErrorLoginMessage(__(message));
        }, this), 250);
    },

    getErrorMessageRender: function () {
        var that = this;
        function close() {
            that.setState({isErrorMessage: false});
            that.refs.buttons.focusIn();
        }
        var buttons = [
            {title: __('Back'), id: 'back'}
        ];
        return <RWizard caption={__('Error')}>
                    <p className='text'>{this.state.errorMessage}</p>
                    <RList focused={true} items={buttons} onEnter={close} />
                </RWizard>
    },
    getErrorLoginMessageRender: function () {
        var that = this;
        function enter(item) {
            if (item.id == 'edit') {
                that.setState({isErrorLoginMessage: false});
                that.refs.buttons.focusIn();
            }
            if (item.id == 'repeat') {
                that.setState({isErrorLoginMessage: false});
                that.login();
            }
            if (item.id == 'skip')
                return that.onSkip();
        }
        var buttons = [
            {title: __('Edit'), id: 'edit'},
            {title: __('Repeat'), id: 'repeat'},
            {title: __('Skip'), id: 'skip'}
        ];
        return <RWizard caption={__('Error')}>
                    <p className='text'>{this.state.errorMessage}</p>
                    <RList focused={true} items={buttons} onEnter={enter} />
                </RWizard>
    },
    getLoggingRender: function () {
        return <RWizardKTV>
                    <p className='text'>{__('Logging...')}</p>
                </RWizardKTV>
    },
    render: function () {

        if (this.state.isErrorMessage)
            return this.getErrorMessageRender();
        if (this.state.isErrorLoginMessage)
            return this.getErrorLoginMessageRender();
        if (this.state.isLogging)
            return this.getLoggingRender();

        var buttons = [
            {title: __('OK'), id: 'ok'},
            {title: __('Skip'), id: 'skip'}
        ];

        return <RWizardKTV>
                    <p className='text'>{__('Enter login and password')}</p>

                    <br />

                    <div className="form">
                        <RInput ref="login"
                            value={this.state.login}
                            placeholder={__('Login')}
                            onOffsideBottom={this.focusPassword}
                            useKeyboard={false}
                        />
                    </div>
                    <div className="form">
                        <RInput ref="password"
                            value={this.state.password}
                            placeholder={__('Password')}
                            type="password"
                            onOffsideTop={this.focusLogin}
                            onOffsideBottom={this.focusButtons}
                            useKeyboard={false}
                        />
                    </div>

                    <RList  ref="buttons"
                        items={buttons}
                        onOffsideTop={this.focusPassword}
                        onEnter={this.keyEnter}
                    />
                </RWizardKTV>
    }
});