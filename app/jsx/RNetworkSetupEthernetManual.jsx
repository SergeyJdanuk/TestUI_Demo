/**
 * @date 8/11/15 2:01 PM
 */
var RNetworkSetupEthernetManual = React.createClass({
    getInitialState: function () {

        return {
            selectedInputIndex: -1,
            focusedButtonsBlock: false,
            focusedInputsBlock: false,
            ipAddress: '',
            mask: '',
            gateway: '',
            dns1: '',
            dns2: '',
            isApplyingSettings: false
        }
    },
    keyEnter: function (item) {
        if (item.id == 'back') {
            this.focusOutButtonsBlock();
            this.focusOutInputsBlock();
            return App.back();
        }
        if (item.id == 'ok') {
            try {
                var nc = duneSTB.getNetworkConfiguration();

                nc.connection = duneSTB.getConst('NETWORK_CONNECTION_ETHERNET');
                nc.mode = duneSTB.getConst('NETWORK_MODE_MANUAL');
                nc.ipAddress = this.refs.ip.value();
                nc.mask = this.refs.mask.value();
                nc.gateway = this.refs.gateway.value();
                nc.dns1 = this.refs.dns1.value();
                nc.dns2 = this.refs.dns2.value();

                duneSTB.setNetworkConfiguration(nc);

            }catch (e) {
                console.error(e);
            }

            this.refs.buttons.focusOut();
            this.setState({isApplyingSettings: true});

            setTimeout(function () {
                App.navigate('wizard/network-setup/checking', {replace: true});
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

    componentDidMount: function () {
        this.inputs = [
            this.refs.ip,
            this.refs.mask,
            this.refs.gateway,
            this.refs.dns1,
            this.refs.dns2
        ];

        var nc = duneSTB.getNetworkConfiguration();

        this.refs.ip.value(nc.ipAddress);
        this.refs.mask.value(nc.mask);
        this.refs.gateway.value(nc.gateway);
        this.refs.dns1.value(nc.dns1);
        this.refs.dns2.value(nc.dns2);
    },

    componentWillUnmount: function () {

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
                <p className='text'>{__('TCP/IP Settings')}</p>

                <div className={dlClasses}>
                    <dl>
                        <dt>{__('IP address:')}</dt>
                        <dd><RInput
                                ref="ip"
                                selected={this.getSelectedInputIndex() == 0}
                                onLeave={this.onInputLeave} />
                        </dd>
                        <dt>{__('Network mask:')}</dt>
                        <dd><RInput
                                ref="mask"
                                selected={this.getSelectedInputIndex() == 1}
                                onLeave={this.onInputLeave} />
                        </dd>
                        <dt>{__('Gateway:')}</dt>
                        <dd><RInput
                                ref="gateway"
                                selected={this.getSelectedInputIndex() == 2}
                                onLeave={this.onInputLeave} />
                        </dd>
                        <dt>{__('DNS server 1:')}</dt>
                        <dd><RInput
                                ref="dns1"
                                selected={this.getSelectedInputIndex() == 3}
                                onLeave={this.onInputLeave} />
                        </dd>
                        <dt>{__('DNS server 2:')}</dt>
                        <dd><RInput
                                ref="dns2"
                                selected={this.getSelectedInputIndex() == 4}
                                onLeave={this.onInputLeave} />
                        </dd>
                    </dl>
                </div>
                <RNetworkSetupList ref="buttons" items={buttons} onEnter={this.keyEnter} onOffsideTop={this.onButtonsOffside} />
            </RNetworkSetup>
    }
});