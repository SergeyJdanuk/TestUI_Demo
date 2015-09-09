/**
 * @date 8/13/15 9:19 AM
 */
var RNetworkSetupWiFiCheckingHardware = React.createClass({
    STARTING_HARDWARE_UP: 'starting-hardware-up',
    HARDWARE_NOT_FOUND: 'hardware-not-found',
    getInitialState: function () {
        return {
            step: this.STARTING_HARDWARE_UP,
            errorMessage: '',
            startingHardwareUpTimer: 0
        }
    },
    componentDidMount: function () {
        this.startingWiFiUp().then(_.bind(this.startingWiFiUpSuccess, this), _.bind(this.startingWiFiUpError, this));
    },
    componentWillUnmount: function () {
    },
    keyEnter: function (item) {
        if (item.id == 'back')
            return App.back();
    },
    startingWiFiUp: function () {
        var that = this;
        console.log('RNetworkSetupWiFiCheckingHardware::startingWiFiUp...');
        return new Promise(function (resolve, reject) {
            try {
                var res = duneSTB.getWifiNetworksDescription();
                console.log('getWifiNetworksDescription() ' + JSON.stringify(res));

                if (res.code != 0 && res.message == 'wifi device is not active') {
                    console.log('RNetworkSetupWiFiCheckingHardware::startingWiFiUp... waiting. Code: ' + res.code + ', Message: ' + res.message);

                    res = duneSTB.getInstance().upWiFi();
                    console.log('upWiFi() ' + res);
                    res = JSON.parse(res);

                    if (res.code != 0) {
                        console.log('RNetworkSetupWiFiCheckingHardware::startingWiFiUp... error. Code: ' + res.code + ', Message: ' + res.message);
                        return reject('Hardware not found');
                    }
                }

                var max = 30;
                var i = 0;

                var intervalId = setInterval(function () {

                    console.log('RNetworkSetupWiFiCheckingHardware::startingWiFiUp... '+i+' sec');

                    ++i;
                    that.setState({startingHardwareUpTimer: i});

                    // получаем список сетей.
                    var res = duneSTB.getWifiNetworksDescription();

                    if (res.code != 0 && i >= max) {
                        console.log('RNetworkSetupWiFiCheckingHardware::startingWiFiUp... error. Code: ' + res.code + ', Message: ' + res.message);
                        return error('Starting wifi up error');
                    }

                    if (!res.result && i < max)
                        return;

                    if (res.result && res.result.length == 0 && i < max)
                        return;

                    console.log('getWifiNetworksDescription(). Found ' + res.result.length + ' networks');

                    clearInterval(intervalId);
                    console.log('RNetworkSetupWiFiCheckingHardware::startingWiFiUp... success');
                    resolve(res.result);
                }, 1000);
            } catch (e) {
                console.log('catch ' + e);
                clearInterval(intervalId);
                console.error(e);
                return error('Hardware not found');
            }

            function error(message) {
                clearInterval(intervalId);
                console.log('RNetworkSetupWiFiCheckingHardware::startingWiFiUp... error');
                reject(message);
            }
        });
    },
    startingWiFiUpSuccess: function (networks) {
        console.log('startingWiFiUpSuccess: found networks - ' + JSON.stringify(networks));
        App.navigate('wizard/network-setup/wifi/networks', {replace: true});
    },
    startingWiFiUpError: function (error) {
        console.log('startingWiFiUpError: ' + error);
        if (error == 'Hardware not found')
            this.setState({step: this.HARDWARE_NOT_FOUND});

        if (error == 'Starting wifi up error')
            this.setState({step: this.ERROR, errorMessage: error});
    },
    isStepEqual: function (name) {
        return this.state.step == name;
    },

    /*
    checkingHardware: function () {

        // Сохраняем предыдущую настройку соединения
        var nc = duneSTB.getNetworkConfiguration();
        var prevConnection = nc.connection;
        var prevMode = nc.mode;

        try {
            nc.connection = duneSTB.getInstance().NETWORK_CONNECTION_WIFI;
            nc.mode = duneSTB.getInstance().NETWORK_MODE_AUTO;
            console.log('setNetworkConfiguration #1: ' +  JSON.stringify(nc));
            duneSTB.setNetworkConfiguration(nc);
        } catch (e) { console.log('Error: NetworkSetupWiFiCheckingHardware::checkingHardware'); }

        console.log('NetworkSetupWiFiCheckingHardware::checkingHardware... ');
        return new Promise(function (resolve, reject) {
            var max = 4;
            var i = 0;
            var intervalId = null;

            function error() {
                // Возвращаемся на предыдущие настройки соединения
                nc.connection = prevConnection;
                nc.mode = prevMode;
                console.log('setNetworkConfiguration #2: ' +  JSON.stringify(nc));
                duneSTB.setNetworkConfiguration(nc);

                console.log('NetworkSetupWiFiCheckingHardware::checkingHardware... error');
                clearInterval(intervalId);
                reject();
            }

            intervalId = setInterval(function () {
                i++;
                try {
                    var ns = duneSTB.getNetworkStatus();
                    console.log(JSON.stringify(ns));

                    var wlan = _.filter(ns, function (v) { return v.interface == 'wlan0'; });

                    if (wlan.length == 0)
                        return error();

                    if (wlan[0].up !== 1 && i < max )
                        return;

                    if (wlan[0].up !== 1)
                        return error();

                    clearInterval(intervalId);
                    console.log('NetworkSetupWiFiCheckingHardware::checkingHardware... success');
                    resolve();
                }
                catch (e) {
                    return error()
                }

                if (i >= max)
                    return error();
            }, 1000);

        });
    },

    */
    getStartingHardwareUpRender: function () {
        return <RNetworkSetup>
                    <p className='text'>{__('Starting WiFi up... :seconds sec', {seconds: this.state.startingHardwareUpTimer})}</p>
               </RNetworkSetup>
    },
    getHardwareNotFoundRender: function () {
        var buttons = [
            {title: __('Back'), id: 'back'}
        ];
        return <RNetworkSetup>
                    <p className='text'>{__('Wi-Fi hardware not found.')}</p>
                    <RNetworkSetupList key="networkSetupList" items={buttons} onEnter={this.keyEnter} />
               </RNetworkSetup>
    },
    getErrorRender: function () {
        var buttons = [
            {title: __('Back'), id: 'back'}
        ];
        return <RNetworkSetup>
                    <p className='text'>{this.state.errorMessage}</p>
                    <RNetworkSetupList key="networkSetupList" items={buttons} onEnter={this.keyEnter} />
               </RNetworkSetup>
    },
    render: function () {
        if (this.isStepEqual(this.STARTING_HARDWARE_UP))
            return this.getStartingHardwareUpRender();

        if (this.isStepEqual(this.HARDWARE_NOT_FOUND))
            return this.getHardwareNotFoundRender();

        if (this.isStepEqual(this.ERROR))
            return this.getErrorRender();

        return <div></div>
    }
});