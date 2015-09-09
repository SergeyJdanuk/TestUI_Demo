/**
 * @date 8/15/15 5:26 PM
 */
var RWizardKTVSettings = React.createClass({
    getInitialState: function () {

        var account = Provider.createKartinaTV().getAccount();
        var settings = Provider.createKartinaTV().getSettings();

        return {
            isSettings: true,
            isError: false,
            isSaving: false,
            errorMessage: '',
            packetName: account.getPacketName(),
            packetExpired: account.getPacketExpireFormat(),
            streamStandardList: settings.getStreamStandardList(),
            selectedStreamStandardIndex: settings.getSelectedStreamStandardIndex(),
            streamServerList: settings.getStreamServerList(),
            selectedStreamServerIndex: settings.getSelectedStreamServerIndex(),
            bitrateNames: settings.getBitrateNames(),
            selectedBitrateIndex: settings.getSelectedBitrateIndex(),
            timeshiftList: settings.getTimeshiftList(),
            selectedTimeshiftIndex: settings.getSelectedTimeshiftIndex(),
            timezoneList: [
                {title: 'GMT -12', value: -12},
                {title: 'GMT -11', value: -11},
                {title: 'GMT -10', value: -10},
                {title: 'GMT -9', value: -9},
                {title: 'GMT -8', value: -8},
                {title: 'GMT -7', value: -7},
                {title: 'GMT -6', value: -6},
                {title: 'GMT -5', value: -5},
                {title: 'GMT -4', value: -4},
                {title: 'GMT -3', value: -3},
                {title: 'GMT -2', value: -2},
                {title: 'GMT -1', value: -1},
                {title: 'GMT 0', value: 0}, 
                {title: 'GMT +1', value: 1},
                {title: 'GMT +2', value: 2},
                {title: 'GMT +3', value: 3},
                {title: 'GMT +4', value: 4},
                {title: 'GMT +5', value: 5},
                {title: 'GMT +6', value: 6},
                {title: 'GMT +7', value: 7},
                {title: 'GMT +8', value: 8},
                {title: 'GMT +9', value: 9},
                {title: 'GMT +10', value: 10},
                {title: 'GMT +11', value: 11},
                {title: 'GMT +12', value: 12}
            ],
            selectedTimezoneIndex: 12
        }
    },
    componentDidMount: function () {
    },
    componentWillUnmount: function () {

    },
    close: function () {
        React.unmountComponentAtNode(this.getDOMNode().parentNode);
    },
    keyEnter: function (button) {
        if (button.id == 'ok') {
            this.refs.buttons.focusOut();
            var settings = [
                {key: 'stream_standard', val: this.refs.streamStandard.value()},
                {key: 'stream_server', val: this.refs.streamServer.value()},
                {key: 'bitrate', val: this.refs.bitrate.value()},
                {key: 'timeshift', val: this.refs.timeshift.value()},
                {key: 'timezone', val: this.refs.timezone.value()}
            ];
            return this.saveSettings(settings)
                .then(
                    _.bind(this.saveSettingsSuccess, this),
                    _.bind(this.saveSettingsError, this)
                );
        }
        if (button.id == 'skip') {
            return this.onSkip();
        }
    },
    focusStreamStandardInput: function() {
        this.refs.streamStandard.focusIn();
    },
    focusStreamServerInput: function() {
        this.refs.streamServer.focusIn();
    },
    focusBitrateInput: function() {
        this.refs.bitrate.focusIn();
    },
    focusTimeshiftInput: function() {
        this.refs.timeshift.focusIn();
    },
    focusTimezoneInput: function() {
        this.refs.timezone.focusIn();
    },
    focusButtonsInput: function() {
        this.refs.buttons.focusIn();
    },
    onComplete: function () {
        this.close();
        App.navigate('wizard/ktv-completed');
    },
    onSkip: function () {
        this.onComplete();
    },
    saveSettings: function (data) {
        this.showSavingDialog();

        var that = this;

        return new Promise(function (resolve, reject) {
            var Iterator = {
                index: 0,
                settings: data,
                next: function () {
                    return (++this.index < this.settings.length);
                },
                save: function () {
                    var i = this.index;
                    var key = this.settings[i].key;
                    var val = this.settings[i].val;
                    that.saveSetting(key, val).then(
                        _.bind(this.saveNext, this),
                        reject
                    );
                },
                saveNext: function () {
                    _.delay(_.bind(function() {
                        if (!this.next())
                            return resolve();
                        this.save();
                    },this), 500);
                }
            };

            Iterator.save();
        });

    },
    saveSetting: function (key, val) {
        var provider = Provider.createKartinaTV();
        return provider.saveSetting(key, val);
    },
    saveSettingsSuccess: function () {
        this.onComplete();
    },
    saveSettingsError: function (message) {
        this.showError(message);
    },
    showSavingDialog: function () {
        this.refs.buttons.focusOut();
        this.setState({
            isSaving: true,
            isError: false
        });
    },
    showError: function (message) {
        this.setState({
            isSaving: false,
            isError: true,
            errorMessage: __(message)
        });
    },
    hideError: function () {
        this.setState({isError: false});
        this.refs.buttons.focusIn();
    },
    getErrorDialogRender: function () {
        var that = this;
        function close() {
            that.hideError();
        }
        var buttons = [
            { title: __('Close'), id: 'close'}
        ];
        return <RModalDialog>
                <h2>{__('Error')}</h2>
                <p className='text'>{this.state.errorMessage}</p>
                <br />
                <RList ref="closeDialogButton" focused={true} items={buttons} onEnter={close}  />
           </RModalDialog>
    },
    getSavingDialogRender: function () {
        return <RModalDialog>
                    <p className='text'>{__('Saving settings...')}</p>
            </RModalDialog>
    },
    render: function () {

        if (this.state.isError)
            var errorDialog = this.getErrorDialogRender();

        if (this.state.isSaving)
            var savingDialog =  this.getSavingDialogRender();

        var buttons = [
            {title: __('OK'), id: 'ok'},
            {title: __('Skip'), id: 'skip'}
        ];

        var classes = React.addons.classSet({
            'form': true
        });

        return <RWizardKTV>
                    {savingDialog}
                    {errorDialog}
                    <p className='text'>{__('Account:')} <u><i>{this.state.packetName}</i></u> &nbsp;&nbsp;&nbsp; {__('Expiration date:')} <u><i>{this.state.packetExpired}</i></u></p>

                    <p>{__('Stream Settings')}</p>

                    <table style={{'margin':'0 auto'}}>
                        <tr>
                            <th>{__('Stream standard')}</th>
                            <td>
                                <div className={classes}>
                                    <RDropdown
                                        ref="streamStandard"
                                        focused={true}
                                        items={this.state.streamStandardList}
                                        selectedIndex={this.state.selectedStreamStandardIndex}
                                        onOffsideBottom={this.focusStreamServerInput}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>{__('Stream server')}</th>
                            <td>
                                <div className={classes}>
                                    <RDropdown
                                        ref="streamServer"
                                        items={this.state.streamServerList}
                                        selectedIndex={this.state.selectedStreamServerIndex}
                                        onOffsideBottom={this.focusBitrateInput}
                                        onOffsideTop={this.focusStreamStandardInput}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>{__('Bitrate')}</th>
                            <td>
                                <div className={classes}>
                                    <RDropdown
                                        ref="bitrate"
                                        items={this.state.bitrateNames}
                                        selectedIndex={this.state.selectedBitrateIndex}
                                        onOffsideTop={this.focusStreamServerInput}
                                        onOffsideBottom={this.focusTimeshiftInput} />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>{__('Timeshift')}</th>
                            <td>
                                <div className={classes}>
                                    <RDropdown
                                        ref="timeshift"
                                        items={this.state.timeshiftList}
                                        selectedIndex={this.state.selectedTimeshiftIndex}
                                        onOffsideTop={this.focusBitrateInput}
                                        onOffsideBottom={this.focusTimezoneInput}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>{__('Timezone')}</th>
                            <td>
                                <div className={classes}>
                                    <RDropdown
                                        ref="timezone"
                                        items={this.state.timezoneList}
                                        selectedIndex={this.state.selectedTimezoneIndex}
                                        onOffsideTop={this.focusTimeshiftInput}
                                        onOffsideBottom={this.focusButtonsInput}/>
                                </div>
                            </td>
                        </tr>
                    </table>
                    

                    <RList ref="buttons"
                        items={buttons}
                        onOffsideTop={this.focusTimezoneInput}
                        onEnter={this.keyEnter}
                    />
                </RWizardKTV>
    }
});