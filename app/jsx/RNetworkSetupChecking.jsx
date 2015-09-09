/**
 * @date 8/11/15 2:01 PM
 */
var RNetworkSetupChecking = React.createClass({
    CHECKING_NETWORK_STARTED        : 1,
    CHECKING_NETWORK_CANCELED       : 2,
    CHECKING_NETWORK_IGNORED        : 4,
    CHECKING_NETWORK_FINISHED       : 8,
    CHECKING_NETWORK_ERROR          : 16,
    CHECKING_LOCAL_NETWORK_STARTED  : 32,
    CHECKING_LOCAL_NETWORK_CANCELED : 64,
    CHECKING_LOCAL_NETWORK_FINISHED : 128,
    CHECKING_INTERNET_STARTED       : 256,
    CHECKING_INTERNET_CANCELED      : 512,
    CHECKING_INTERNET_FINISHED      : 1024,
    getInitialState: function () {
        return {
            step: '',
            status: 0,
            checkingLocalNetworkStatusText: '',
            checkingInternetStatusText: '',
            checkingInternetStatusCode: 0,
            checkingLocalNetworkStatusCode: 0,
            localNetworkAlreadyChecked: false,
            internetAlreadyChecked: false
        }
    },
    keyEnter: function (item) {
        if (item.id == 'back') {
            this.stopChecking(false);
            return App.back();
        }

        if (item.id == 'cancel') {
            this.cancelCheckingNetwork();
            return this.stopChecking();
        }

        if (item.id == 'ignore-and-continue' || item.id == 'finished')
            return App.navigate('wizard/network-setup/completed');
    },

    status: function (newStatus) {
        if (newStatus === undefined)
            return this._status;
        this._status = newStatus;
        this.setState({status: newStatus});
    },

    startCheckingNetwork: function () {
        this.status(this.CHECKING_NETWORK_STARTED);
    },
    cancelCheckingNetwork: function () {
        this.status(this.status() | this.CHECKING_NETWORK_CANCELED);
    },
    finishCheckingNetwork: function () {
        this.status(this.status() | this.CHECKING_NETWORK_FINISHED);
    },
    ignoreCheckingNetwork: function () {
        this.status(this.status() | this.CHECKING_NETWORK_IGNORED);
    },
    errorCheckingNetwork: function () {
        this.status(this.status() | this.CHECKING_NETWORK_ERROR);
    },
    isCheckingNetworkStarted: function () {
        return this.status() & this.CHECKING_NETWORK_STARTED;
    },
    isCheckingNetworkCanceled: function () {
        return this.status() & this.CHECKING_NETWORK_CANCELED;
    },
    isCheckingNetworkIgnored: function () {
        return this.status() & this.CHECKING_NETWORK_IGNORED;
    },
    isCheckingNetworkFinished: function () {
        return this.status() & this.CHECKING_NETWORK_FINISHED;
    },
    isCheckingNetworkError: function () {
        return this.status() & this.CHECKING_NETWORK_ERROR;
    },

    componentDidMount: function () {
        this._status = 0;
        this.startCheckingNetwork();
        this.checkingNetwork();
    },

    componentWillUnmount: function () {
        if (this.isCheckingInProcess())
            this.stopChecking();
    },

    isCheckingInProcess: function () {
        return this.isCheckingNetworkStarted()
            && !(this.isCheckingNetworkCanceled() || this.isCheckingNetworkFinished() || this.isCheckingNetworkError())
    },

    stopChecking: function (updateText) {
        console.log('RNetworkSetupEthernetAutomatic::stopChecking');
        this.cancelCheckingNetwork();

        if (updateText === false)
            return;

        this.ignoreCheckingNetwork();
        this.setState({
            checkingLocalNetworkStatusText: __('Skipped'),
            checkingInternetStatusText: __('Skipped')
        });
    },

    checkingNetwork: function () {
        if (!this.isCheckingInProcess())
            return;

        this.setState({step: 'checking-network-connection'});

        this.checkingLocalNetwork().then(
            _.bind(this.checkingLocalNetworkSuccess, this),
            _.bind(this.checkingLocalNetworkError, this)
        );
    },

    checkingLocalNetwork: function() {
        if (!this.isCheckingInProcess())
            return;

        console.log('RNetworkSetupEthernetAutomatic::checkingLocalNetwork...');
        var that = this;

        return new Promise(function (resolve, reject) {
            var seconds = 0;
            that.setState({checkingLocalNetworkStatusText: '' });

            var intervalId = setInterval(function () {

                if (!that.isCheckingInProcess())
                    return clearInterval(intervalId);

                try {
                    var nc = duneSTB.getNetworkConfiguration();

                    var ipAddress = nc.ipAddress;

                    if (ipAddress) {
                        clearInterval(intervalId);
                        console.log('RNetworkSetupEthernetAutomatic::checkingLocalNetwork... success');
                        return resolve(ipAddress);
                    }
                    else if (!ipAddress && seconds > 58) {
                        clearInterval(intervalId);
                        console.log('RNetworkSetupEthernetAutomatic::checkingLocalNetwork... error');
                        return reject();
                    }
                } catch (e) {
                    clearInterval(intervalId);
                    console.log('RNetworkSetupEthernetAutomatic::checkingLocalNetwork... error.' + e);
                    return reject();
                }

                seconds++;
                that.setState({checkingLocalNetworkStatusText: __(':seconds sec', {seconds: seconds})});
            }, 1000);
        });
    },

    checkingLocalNetworkSuccess: function (ipaddress) {

        if (!this.isCheckingInProcess())
            return;

        var that = this;

        this.setState({checkingLocalNetworkStatusText: __('OK (IP address :ipaddress)', {ipaddress: ipaddress})});

        this.checkingInternet().then(
            _.bind(this.checkingInternetSuccess, this),
            _.bind(this.checkingInternetError, this)
        );
    },

    checkingLocalNetworkError: function () {
        if (!this.isCheckingInProcess())
            return;
        this.errorCheckingNetwork();

        this.setState({checkingLocalNetworkStatusText: __('Error')});
    },

    checkingInternet: function() {
        if (!this.isCheckingInProcess())
            return;

        console.log('RNetworkSetupEthernetAutomatic::checkingInternet...');
        var that = this;

        return new Promise(function (resolve, reject) {
            var seconds = 0;
            that.setState({checkingInternetStatusText: '' });

            var img = new Image();
            img.onload = function () {
                console.log('RNetworkSetupEthernetAutomatic::checkingInternet... success');
                resolve();
            };
            img.onerror = function () {
                console.log('RNetworkSetupEthernetAutomatic::checkingInternet... error');
                reject(__('Connection failed'));
            };
            img.src = 'http://www.google.com/favicon.ico';
        });
    },

    checkingInternetSuccess: function () {
        if (!this.isCheckingInProcess())
            return;
        this.finishCheckingNetwork();
        this.setState({checkingInternetStatusText: __('OK')});
    },

    checkingInternetError: function (msg) {
        if (!this.isCheckingInProcess())
            return;
        this.errorCheckingNetwork();
        this.setState({checkingInternetStatusText: __('Error: :message', {message: msg})});
    },

    getCheckingNetworkConnectionRender: function () {
        var buttons = [];

        if (this.isCheckingNetworkError() || this.isCheckingNetworkIgnored())
            buttons.push ({title: __('Ignore & continue'), id: 'ignore-and-continue'});
        else if(this.isCheckingNetworkFinished())
            buttons.push ({title: __('OK'), id: 'finished'});
        else
            buttons.push ({title: __('Cancel'), id: 'cancel'});

        buttons.push({title: __('Back'), id: 'back'});

        return <RNetworkSetup>
                    <p className='text'>{__('Checking network connection.')}</p>
                    <div className="definition-list-container">
                        <dl>
                            <dt>{__('Checking local network...')}</dt>
                            <dd>{this.state.checkingLocalNetworkStatusText}</dd>

                            <dt>{__('Checking Internet...')}</dt>
                            <dd>{this.state.checkingInternetStatusText}</dd>
                        </dl>
                    </div>
                    <RNetworkSetupList items={buttons} onEnter={this.keyEnter} />
                </RNetworkSetup>
    },

    render: function () {
        if (this.state.step == 'checking-network-connection')
            return this.getCheckingNetworkConnectionRender();

        return <RNetworkSetup></RNetworkSetup>
    }
});