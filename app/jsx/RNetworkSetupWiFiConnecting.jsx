/**
 * @date 8/14/15 1:31 PM
 */
var RNetworkSetupWiFiConnecting = React.createClass({
    getInitialState: function () {
        return {
            selectedInputIndex: 0,
            focusedButtonsBlock: false,
            focusedInputsBlock: true,
            isApplyingNetworkSettings: false,

            wifiSsid: this.props.networkSsid,
            wifiSecurity: this.props.networkSecurity,
            wifiPassword: '',

            selectedSecurityIndex: 0,
            securities: [
                {title: 'NONE',             value: duneSTB.getConst('WIFI_SECURITY_NONE')},
                {title: 'WEP_64_BIT_ASCII', value: duneSTB.getConst('WIFI_SECURITY_WEP_64_BIT_ASCII')},
                {title: 'WEP_64_BIT_HEX',   value: duneSTB.getConst('WIFI_SECURITY_WEP_64_BIT_HEX')},
                {title: 'WEP_128_BIT_ASCII',value: duneSTB.getConst('WIFI_SECURITY_WEP_128_BIT_ASCII')},
                {title: 'WEP_128_BIT_HEX',  value: duneSTB.getConst('WIFI_SECURITY_WEP_128_BIT_HEX')},
                {title: 'WPA_TKIP',         value: duneSTB.getConst('WIFI_SECURITY_WPA_TKIP')},
                {title: 'WPA_AES',          value: duneSTB.getConst('WIFI_SECURITY_WPA_AES')},
                {title: 'WPA2_TKIP',        value: duneSTB.getConst('WIFI_SECURITY_WPA2_TKIP')},
                {title: 'WPA2_AES',         value: duneSTB.getConst('WIFI_SECURITY_WPA2_AES')}
            ]
        }
    },
    getDefaultProps: function () {
        return {
            networkSsid: '',
            networkSecurity: 0
        }
    },
    componentDidMount: function () {
        this.inputs = [
            this.refs.password
        ];

        if (this.state.wifiSecurity == duneSTB.getConst('WIFI_SECURITY_NONE'))
            this.applyNetworkSettings();

        var securityIndex = 0,
            currentSecurity = _.filter(this.state.securities, _.bind(function (v) { return v.value === this.props.networkSecurity; }, this)),
            security = { value: duneSTB.getConst('WIFI_SECURITY_NONE'), title: "NONE" };

        if (currentSecurity.length) {
            security = currentSecurity[0];
            securityIndex = _.indexOf(this.state.securities, currentSecurity[0]);
        }

        this.setState({selectedSecurityIndex: securityIndex});
    },
    componentWillUnmount: function () {

    },
    keyEnter: function (item) {
        if (item.id == 'cancel') {
            if (_.isFunction(this.props.onCancel))
                this.props.onCancel();
        }
        if (item.id == 'connect') {
            this.setState({
                wifiSecurity: this.state.wifiPassword,
                wifiPassword: this.refs.password.value()
            });
            return this.applyNetworkSettings();
        }
    },
    applyNetworkSettings: function () {
        var wifiSsid = this.state.wifiSsid,
            wifiSecurity = this.props.networkSecurity,
            wifiPassword = this.state.wifiPassword;

        this.setState({isApplyingNetworkSettings: true});

        try {
            var networkConfiguration = {
                connection: duneSTB.getConst('NETWORK_CONNECTION_WIFI'),
                mode: duneSTB.getConst('NETWORK_MODE_AUTO'),
                ipAddress: "",
                mask: "",
                gateway: "",
                dns1: "",
                dns2: "",
                wifiSsid: wifiSsid,
                wifiSecurity: wifiSecurity,
                wifiPassword: wifiPassword,
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
            App.navigate('wizard/network-setup/checking');
        }, 2000);
    },

    getSelectedInputRef: function () {
        return this.inputs[this.state.selectedInputIndex];
    },

    getSelectedInputIndex: function () {
        return this.state.selectedInputIndex;
    },
    onButtonsOffside: function () {
        this.focusOutButtonsBlock();
        this.focusInInputsBlock();
        return false;
    },
    onInputLeave: function (dir) {
        dir == 'top' && this.selectPrevInput();
        dir == 'bottom' && this.selectNextInput();
    },
    focusInInputsBlock: function (selected) {
        this.setState({
            focusedInputsBlock: true,
            selectedInputIndex: this.inputs.length - 1
        });

        this.getSelectedInputRef().select();
    },
    focusOutInputsBlock: function () {
        if (!this.state.focusedInputsBlock)
            return;
        this.getSelectedInputRef().unselect();
        this.setState({
            focusedInputsBlock: false,
            selectedInputIndex: -1
        });
    },
    focusInButtonsBlock: function () {
        this.refs.buttons.focusIn();
        this.setState({focusedButtonsBlock: true});
    },
    focusOutButtonsBlock: function () {
        this.refs.buttons.focusOut();
        this.setState({focusedButtonsBlock: false});
    },

    selectPrevInput: function () {
        var index = this.getSelectedInputIndex();
        if (--index < 0)
            index = this.inputs.length - 1;
        this.selectInputIndex(index);
    },

    selectNextInput: function () {
        var index = this.getSelectedInputIndex();
        if (++index >= this.getInputsCount()) {
            index--;
            this.focusOutInputsBlock();
            this.focusInButtonsBlock();
            return;
        }
        this.selectInputIndex(index);
    },

    selectInputIndex: function (index) {
        if (this.state.selectedInputIndex != -1)
            this.inputs[this.state.selectedInputIndex].unselect();
        this.setState({selectedInputIndex: index});
        this.inputs[this.state.selectedInputIndex].select();
    },

    getInputsCount: function () {
        return this.inputs.length;
    },
    getApplyingNetworkSettingsRender: function () {
        return <RModalDialog>
                    <p className='text'>{__('Applying network settings...')}</p>
                    <br />
                </RModalDialog>
    },
    getManualRender: function () {
        var buttons = [
            {title: __('Connect'), id: 'connect'},
            {title: __('Cancel'), id: 'cancel'}
        ];
        return <RModalDialog>
                    <p className='text'>{__('Network: :network', {network: this.state.wifiSsid})}</p>
                    <RNetworkSetupList key="buttons" items={buttons} onEnter={this.keyEnter} />
                </RModalDialog>
    },
    render: function () {

        if (this.state.isApplyingNetworkSettings)
            return this.getApplyingNetworkSettingsRender();

        var buttons = [
            {title: __('Connect'), id: 'connect'},
            {title: __('Cancel'), id: 'cancel'}
        ];

        var dlStyles = {
            width: '18em',
            margin: '0 auto'
        };
        var dlClasses = React.addons.classSet({
            'definition-list-container': true,
            'form': true,
            'inactive': !this.state.focusedInputsBlock
        });

        return <RModalDialog>
                    <p className='text'>{__('Network: :network', {network: this.state.wifiSsid})}</p>

                    <div className={dlClasses} style={dlStyles}>
                        <dl>
                            <dt>{__('Password:')}</dt>
                            <dd><RInput
                                    ref="password"
                                    focused={true}
                                    selected={true}
                                    onLeave={this.onInputLeave} />
                            </dd>
                        </dl>
                    </div>

                    <RNetworkSetupList ref="buttons" key="buttons" focused={false} items={buttons} onEnter={this.keyEnter}  onOffsideTop={this.onButtonsOffside}  />
               </RModalDialog>
    }
});