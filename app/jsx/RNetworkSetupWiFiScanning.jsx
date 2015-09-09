/**
 * @date 8/13/15 9:19 AM
 */
var RNetworkSetupWiFiScanning = React.createClass({
    scanForWifiNetworksTimeout: 3,
    STATUS_SCANNING: 1,
    STATUS_CANCELED: 2,
    STATUS_ERROR: 3,
    STATUS_NOT_FOUND: 4,
    getInitialState: function () {
        return {
            status: this.STATUS_SCANNING
        }
    },
    componentDidMount: function () {
        this.startScanning();
    },
    componentWillUnmount: function () {

    },
    isScanStatusEqual: function (status) {
        return this.state.status == status;
    },
    keyEnter: function (item) {
        if (item.id == 'back')
            return App.back();
    },
    startScanning: function() {
        this.setState({status: this.STATUS_SCANNING});
        this.scanForWifiNetworks().then(_.bind(this.onSuccess, this), _.bind(this.onError, this));
    },
    scanForWifiNetworks: function () {
        console.log('RNetworkSetupWiFiScanning...');
        var that = this;
        return new Promise(function (resolve, reject) {
            var max = 4;
            var i = 0;
            var intervalId = 0;

            intervalId = setInterval(function() {
                // Если сканирование прервали, остановить таймер проверки.
                if (!that.isScanStatusEqual(that.STATUS_SCANNING)) {
                    console.log('RNetworkSetupWiFiScanning... cancelled');
                    return clearInterval(intervalId);
                }

                i++;
                var res = duneSTB.getWifiNetworksDescription();

                if (res.result.length == 0 && i < max)
                    return;

                if (res.result.length == 0)
                    return error('networks not found');

                console.log('RNetworkSetupWiFiScanning... success');
                clearInterval(intervalId);
                resolve(res.result);
            }, 1000);

            function error(message) {
                console.log('RNetworkSetupWiFiScanning... error');
                clearInterval(intervalId);
                reject(message);
            }
        });
    },
    onSuccess: function (networks) {
        if (_.isFunction(this.props.onSuccess))
            this.props.onSuccess(networks);
    },
    onError: function (status) {
        if (status == 'networks not found')
            return this.setState({status: this.STATUS_NOT_FOUND});

        this.setState({status: this.STATUS_ERROR});
        if (_.isFunction(this.props.onError))
            this.props.onError(status);
    },
    getScanningRender: function () {
        var that = this;
        var onEnter = function () { that.setState({status: that.STATUS_CANCELED}); };

        var buttons = [
            {title: __('Cancel'), id: 'cancel'}
        ];

        return <RNetworkSetup>
                    <p className='text'>{__('Scanning for Wi-Fi networks...')}</p>
                    <RNetworkSetupList key="networkSetupList" items={buttons} onEnter={onEnter} />
               </RNetworkSetup>
    },
    getCancelledScanningRender: function () {
        var that = this;
        var onEnter = function (item) {
            if (item.id == 'repeat')
                return that.startScanning();
            if (item.id == 'back')
                return App.back();
            if (item.id == 'manual-setup')
                return App.navigate('wizard/network-setup/wifi/manual', {replace: true});
        };

        var buttons = [
            {title: __('Repeat'), id: 'repeat'},
            {title: __('Manual setup'), id: 'manual-setup'},
            {title: __('Back'), id: 'back'}
        ];

        return <RNetworkSetup>
                    <p className='text'>{__('Scanning for Wi-Fi networks is canceled')}</p>
                    <RNetworkSetupList key="networkSetupList" items={buttons} onEnter={onEnter} />
               </RNetworkSetup>
    },
    getNetworksNotFoundRender: function() {
        var that = this;
        var onEnter = function (item) {
            if (item.id == 'repeat')
                return that.startScanning();
            if (item.id == 'back')
                return App.back();
            if (item.id == 'manual-setup')
                return App.navigate('wizard/network-setup/wifi/manual', {replace: true});
        };

        var buttons = [
            {title: __('Repeat'), id: 'repeat'},
            {title: __('Manual setup'), id: 'manual-setup'},
            {title: __('Back'), id: 'back'}
        ];

        return <RNetworkSetup>
                    <p className='text'>{__('Wi-Fi networks not found.')}</p>
                    <RNetworkSetupList key="networkSetupList" items={buttons} onEnter={onEnter} />
               </RNetworkSetup>
    },
    render: function () {
        if (this.isScanStatusEqual(this.STATUS_SCANNING))
            return this.getScanningRender();
        if (this.isScanStatusEqual(this.STATUS_CANCELED))
            return this.getCancelledScanningRender();
        if (this.isScanStatusEqual(this.STATUS_NOT_FOUND))
            return this.getNetworksNotFoundRender();
    }
});