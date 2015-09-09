/**
 * @date 8/11/15 2:01 PM
 */
var RNetworkSetupWiFiNetworks = React.createClass({

    getInitialState: function () {
        return {
            isNetworkConnectionDialogOpened: false,
            isScanning: true,
            networks: []
        }
    },
    componentDidMount: function () {

    },
    componentWillUnmount: function () {

    },
    startScan: function () {
        this.setState({isScanning: true,networks: []});
    },
    scanSuccess: function (networks) {
        this.setState({isScanning: false,networks: networks});
    },
    scanError: function () {},
    buttonsKeyEnter: function (item) {
        if (item.id == 'back')
            return App.back();
        if (item.id == 'scan-again')
            return this.startScan();
        if (item.id == 'manual-setup')
            return App.navigate('wizard/network-setup/wifi/manual');
    },
    networkKeyEnter: function () {
        var network = this.refs.networks.getSelectedItem();
        if (!network)
            return;

        this._selectedNetwork = network;

        this.openNetworkConnectionDialog();
    },
    openNetworkConnectionDialog: function () {
        this.setState({isNetworkConnectionDialogOpened: true});
        this.refs.networks.focusOut();
    },
    closeNetworkConnectionDialog: function () {
        this.setState({isNetworkConnectionDialogOpened: false});
        this.refs.networks.focusIn();
    },
    getSelectedNetworkName: function() {
        return this._selectedNetwork.title;
    },
    buttonsOffside: function (dir) {
        if (dir == 'top') {
            this.refs.buttons.focusOut();
            this.refs.networks.focusIn();
            return false;
        }
    },
    networksOffside: function (dir) {
        if (dir == 'bottom') {
            this.refs.buttons.focusIn();
            this.refs.networks.focusOut();
            return false;
        }
    },
    networkKeyReturn: function () {
        this.refs.buttons.focusIn();
        this.refs.networks.focusOut();
    },
    close: function () {
        React.unmountComponentAtNode(this.getDOMNode().parentNode);
    },
    onNetworkConnectingSuccess: function () {

    },
    onNetworkConnectingError: function () {

    },
    onNetworkConnectingCancel: function () {
        this.closeNetworkConnectionDialog();
    },
    getNetworkConnectionDialogRender: function () {
        return <RNetworkSetupWiFiConnecting
            ref="connecting"
            networkSsid={this._selectedNetwork.title}
            networkSecurity={this._selectedNetwork.security}
            onSuccess={this.onNetworkConnectingSuccess}
            onError={this.onNetworkConnectingError}
            onCancel={this.onNetworkConnectingCancel} />
    },
    getScanningRender: function () {
        return <RNetworkSetupWiFiScanning ref="scan" onSuccess={this.scanSuccess} />
    },
    render: function () {

        var networkConnectionDialog = '';

        if (this.state.isScanning)
            return this.getScanningRender();

        if (this.state.isNetworkConnectionDialogOpened)
            networkConnectionDialog = this.getNetworkConnectionDialogRender();

        var networks = _.map(this.state.networks, function (v) {
            return {title: v.ssid, security: v.security}
        });

        var buttons = [
            {title: __('Scan again'), id: 'scan-again'},
            {title: __('Manual setup'), id: 'manual-setup'},
            {title: __('Back'), id: 'back'}
        ];

        return (<RNetworkSetup>
                    {networkConnectionDialog}
                    <p className='text'>{__('Select WiFi network')}</p>
                    <RNetworkSetupList styleBoxShadow='0em 0em .5em .25em #606060' ref="networks" key="networks" items={networks} count={3}  onEnter={this.networkKeyEnter} onOffside={this.networksOffside} onReturn={this.networkKeyReturn} />
                    <br />
                    <RNetworkSetupList ref="buttons" key="back" onOffside={this.buttonsOffside} items={buttons} focused={false} onEnter={this.buttonsKeyEnter} />
                </RNetworkSetup>)
    }
});