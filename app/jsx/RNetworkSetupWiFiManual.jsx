/**
 * @date 8/11/15 2:01 PM
 */
var RNetworkSetupWiFiManual = React.createClass({
    getInitialState: function () {

        var nc = duneSTB.getNetworkConfiguration();

        return {
            selectedInputIndex: -1,
            focusedButtonsBlock: false,
            focusedInputsBlock: false,
            isApplyingSettings: false,

            wifiSsid: '',
            wifiSecurity: '',
            wifiPassword: '',

            selectedSecurityIndex: 0
        }
    },

    componentDidMount: function () {
        this._selectedSecurityIndex = 0;
        this._securitiesItems = [
            {title: 'NONE',             value: duneSTB.getConst('WIFI_SECURITY_NONE')},
            {title: 'WEP_64_BIT_ASCII', value: duneSTB.getConst('WIFI_SECURITY_WEP_64_BIT_ASCII')},
            {title: 'WEP_64_BIT_HEX',   value: duneSTB.getConst('WIFI_SECURITY_WEP_64_BIT_HEX')},
            {title: 'WEP_128_BIT_ASCII',value: duneSTB.getConst('WIFI_SECURITY_WEP_128_BIT_ASCII')},
            {title: 'WEP_128_BIT_HEX',  value: duneSTB.getConst('WIFI_SECURITY_WEP_128_BIT_HEX')},
            {title: 'WPA_TKIP',         value: duneSTB.getConst('WIFI_SECURITY_WPA_TKIP')},
            {title: 'WPA_AES',          value: duneSTB.getConst('WIFI_SECURITY_WPA_AES')},
            {title: 'WPA2_TKIP',        value: duneSTB.getConst('WIFI_SECURITY_WPA2_TKIP')},
            {title: 'WPA2_AES',         value: duneSTB.getConst('WIFI_SECURITY_WPA2_AES')}
        ];

        this.inputs = [
            this.refs.ssid,
            this.refs.security,
            this.refs.password
        ];

        var securityIndex = 0,
            nc = duneSTB.getNetworkConfiguration(),
            currentSecurity = _.filter(this._securitiesItems, function (v) { return v.value === nc.wifiSecurity; }),
            security = { value: duneSTB.getConst('WIFI_SECURITY_NONE'), title: "NONE" };

        if (currentSecurity.length) {
            security = currentSecurity[0];
            securityIndex = _.indexOf(this._securitiesItems, currentSecurity[0]);
        }


        this.refs.ssid.value(nc.wifiSsid);
        this.refs.password.value(nc.wifiPassword);
        this.refs.security.value(security.value);
        this.refs.security.text(security.title);

        this.setState({selectedSecurityIndex: securityIndex});
    },
    componentWillUnmount: function () {

    },
    getSecurityTitleByIndex: function (index) {
        return this._securitiesItems[index].title;
    },
    keyEnter: function (item) {
        if (item.id == 'back') {
            this.focusOutButtonsBlock();
            this.focusOutInputsBlock();
            return App.back();
        }
        if (item.id == 'ok') {
            try {
                var wifiSsid = this.refs.ssid.value();
                var wifiSecurity = this.refs.security.value();
                var wifiPassword = this.refs.password.value();

                var nc = duneSTB.getNetworkConfiguration();

                nc.connection = duneSTB.getConst('NETWORK_CONNECTION_WIFI');
                nc.mode = duneSTB.getConst('NETWORK_MODE_MANUAL');
                nc.wifiSsid = this.refs.ssid.value();
                nc.wifiSecurity = this.refs.security.value();
                nc.wifiPassword = this.refs.password.value();

                duneSTB.setNetworkConfiguration(nc);

            }catch (e) {
                console.error(e);
            }

            this.refs.buttons.focusOut();
            this.setState({isApplyingSettings: true});

            setTimeout(function () {
                App.navigate('wizard/network-setup/checking');
            }, 1250);
        }
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


    getSelectedInputRef: function () {
        return this.inputs[this.state.selectedInputIndex];
    },

    getSelectedInputIndex: function () {
        return this.state.selectedInputIndex;
    },

    focusInInputsBlock: function () {
        console.log('focusInInputsBlock');
        this.setState({
            focusedInputsBlock: true,
            selectedInputIndex: this.inputs.length - 1
        });
        this.getSelectedInputRef().select();
    },
    focusOutInputsBlock: function () {
        console.log('focusOutInputsBlock');
        if (!this.state.focusedInputsBlock)
            return;
        this.getSelectedInputRef().unselect();
        this.setState({
            focusedInputsBlock: false,
            selectedInputIndex: -1
        });
    },
    focusInButtonsBlock: function () {
        console.log('focusInButtonsBlock');
        this.refs.buttons.focusIn();
        this.setState({focusedButtonsBlock: true});
    },
    focusOutButtonsBlock: function () {
        console.log('focusOutButtonsBlock');
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

    getApplyingSettingsRender: function () {
        return <RNetworkSetup>
            <p className='text'>{__('Applying network settings...')}</p>
            <br />
        </RNetworkSetup>
    },

    render: function () {
        if (this.state.isApplyingSettings) {
            return this.getApplyingSettingsRender();
        }
        var buttons = [
            {title: __('OK'), id: 'ok'},
            {title: __('Back'), id: 'back'}
        ];

        var dlClasses = React.addons.classSet({
            'definition-list-container': true,
            'form': true,
            'inactive': !this.state.focusedInputsBlock
        });

        return <RNetworkSetup>
                <p className='text'>{__('WiFi Settings')}</p>

                <div className={dlClasses}>
                    <dl>
                        <dt>{__('Network ID (SSID):')}</dt>
                        <dd><RInput
                                ref="ssid"
                                selected={this.getSelectedInputIndex() == 0}
                                onLeave={this.onInputLeave} />
                        </dd>
                        <dt>{__('Security:')}</dt>
                        <dd><RDropdown
                                ref="security"
                                text="NONE"
                                value={0}
                                items={this._securitiesItems}
                                selected={this.getSelectedInputIndex() == 1}
                                onLeave={this.onInputLeave}
                                selectedIndex={this.state.selectedSecurityIndex}/>
                        </dd>
                        <dt>{__('Password:')}</dt>
                        <dd><RInput
                                ref="password"
                                selected={this.getSelectedInputIndex() == 2}
                                onLeave={this.onInputLeave} />
                        </dd>
                    </dl>
                </div>
                <RNetworkSetupList ref="buttons" items={buttons} onEnter={this.keyEnter} onOffsideTop={this.onButtonsOffside} />
            </RNetworkSetup>
    }
});