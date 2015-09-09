/**
 * @date 8/11/15 2:01 PM
 */
var RNetworkSetupEthernetAutomatic = React.createClass({

    componentDidMount: function () {
        this.applyingNetworkSettings();
    },

    applyingNetworkSettings: function () {
        this.setState({step: 'applying-network-settings'});

        try {
            var networkConfiguration = {
                connection: duneSTB.getConst('NETWORK_CONNECTION_ETHERNET'),
                mode: duneSTB.getConst('NETWORK_MODE_AUTO'),
                ipAddress: "",
                mask: "",
                gateway: "",
                dns1: "",
                dns2: "",
                wifiSsid: "",
                wifiSecurity: 0,
                wifiPassword: "",
                wifiApMode: 0,
                wifiApSsid: "",
                wifiApPassword: "",
                pppoeLogin: "",
                pppoePassword: "",
                pppoeDnsMode: 0,
                pppoeDhcp: 0
            };
            duneSTB.setNetworkConfiguration(networkConfiguration);
        } catch (e) {
            console.error('ApplyingNetworkSettings error: ' + e);
        }

        setTimeout(function () {
            App.navigate('wizard/network-setup/checking', {replace: true});
        }, 1250);
    },

    render: function () {
        return <RNetworkSetup>
            <p className='text'>{__('Applying network settings...')}</p>
            <br />
        </RNetworkSetup>
    }
});