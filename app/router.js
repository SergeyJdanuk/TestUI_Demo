/**
 * @date 7/31/15 11:55 AM
 */
var AppRouter = Marionette.AppRouter.extend({
    routes: {
        "": "start",
        "splash": "splash",
        "loading(/:status)": "loading",
        "wizard": "wizard",
        "wizard/select-language": "wizardSelectLanguage",
        "wizard/select-language/completed": "wizardSelectLanguageCompleted",
        "wizard/network-setup": 'wizardNetworkSetup',
        "wizard/network-setup/choose-connection-type": 'wizardNetworkSetupChooseConnectionType',
        "wizard/network-setup/ethernet": 'wizardNetworkSetupEthernet',
        "wizard/network-setup/ethernet/automatic": 'wizardNetworkSetupEthernetAutomatic',
        "wizard/network-setup/ethernet/manual": 'wizardNetworkSetupEthernetManual',
        "wizard/network-setup/wifi": 'wizardNetworkSetupWiFi',
        "wizard/network-setup/wifi/checking-hardware": 'wizardNetworkSetupWiFiCheckingHardware',
        "wizard/network-setup/wifi/networks": 'wizardNetworkSetupWiFiNetworks',
        "wizard/network-setup/wifi/choosing-setup": 'wizardNetworkSetupWiFiChoosingSetup',
        "wizard/network-setup/wifi/manual": 'wizardNetworkSetupWiFiManual',
        "wizard/network-setup/checking": 'wizardNetworkSetupChecking',
        "wizard/network-setup/completed": 'wizardNetworkSetupCompleted',
        "wizard/ktv-authorization": 'wizardKTVAuthorization',
        "wizard/ktv-settings": 'wizardKTVSettings',
        "wizard/ktv-completed": 'wizardKTVCompleted',
        "wizard/completed": "wizardCompleted",
        "auth": "auth",
        "auth/form": "authForm",
        "home": "home",
        "dialog": "dialog"

    },
    start: function () {
        console.log('AppRouter::start');
        App.navigate('splash');
    },
    splash: function () {
        console.log('AppRouter::splash');
        App.navigate('loading');
    },
    loading: function () {
        console.log('AppRouter::loading');

        var isWizardCompleted = settings.get('isWizardCompleted');
        
        console.log('isWizardCompleted ' + isWizardCompleted);

        isWizardCompleted
            ? App.navigate('auth')
            : App.navigate('wizard');
    },
    wizard: function () {
        console.log('AppRouter::wizard');
        //App.Wizard.start();
        App.navigate('wizard/select-language');
    },
    wizardSelectLanguage: function () {
        console.log('AppRoute::wizardSelectLanguage');
        App.Wizard.selectLanguage();
    },
    wizardSelectLanguageCompleted: function () {
        console.log('AppRoute::wizardSelectLanguageCompleted');
        App.navigate('wizard/network-setup', {replace: true});
    },
    wizardNetworkSetup: function () {
        console.log('AppRouter::wizardNetworkSetup');
        App.navigate('wizard/network-setup/choose-connection-type', {replace: true});
    },
    wizardNetworkSetupChooseConnectionType: function () {
        console.log('AppRouter::wizardNetworkSetupChooseConnectionType');
        App.Wizard.networkSetupChooseConnectionType();
    },
    wizardNetworkSetupEthernet: function () {
        console.log('AppRouter::wizardNetworkSetupEthernet');
        App.Wizard.networkSetupEthernet();
    },
    wizardNetworkSetupEthernetAutomatic: function () {
        console.log('AppRouter::wizardNetworkSetupEthernetAutomatic');
        App.Wizard.networkSetupEthernetAutomatic();
    },
    wizardNetworkSetupEthernetManual: function () {
        console.log('AppRouter::wizardNetworkSetupEthernetManual');
        App.Wizard.networkSetupEthernetManual();
    },
    wizardNetworkSetupWiFi: function () {
        console.log('AppRouter::wizardNetworkSetupWiFi');
        App.navigate('wizard/network-setup/wifi/checking-hardware', {replace: true});
    },
    wizardNetworkSetupWiFiCheckingHardware: function () {
        console.log('AppRouter::wizardNetworkSetupWiFiCheckingHardware');
        App.Wizard.networkSetupWiFiCheckingHardware();
    },
    wizardNetworkSetupWiFiNetworks: function () {
        console.log('AppRouter::wizardNetworkSetupWiFiNetworks');
        App.Wizard.networkSetupWiFiNetworks();
    },
    wizardNetworkSetupWiFiChoosingSetup: function () {
        console.log('AppRouter::wizardNetworkSetupWiFiChoosingSetup');
        App.Wizard.networkSetupWiFiChoosingSetup();
    },
    wizardNetworkSetupWiFiManual: function () {
        console.log('AppRouter::wizardNetworkSetupWiFiManual');
        App.Wizard.networkSetupWiFiManual();
    },
    wizardNetworkSetupChecking: function () {
        console.log('AppRouter::wizardNetworkSetupChecking');
        App.Wizard.networkSetupChecking();
    },
    wizardNetworkSetupCompleted: function () {
        console.log('AppRouter::wizardNetworkSetupCompleted');
        App.navigate('wizard/ktv-authorization', {replace: true});
    },
    wizardKTVAuthorization: function () {
        App.Wizard.ktvAuthorization();
    },
    wizardKTVSettings: function () {
        App.Wizard.ktvSettings();
    },
    wizardKTVCompleted: function () {
        App.navigate('wizard/completed', {replace: true});
    },
    wizardCompleted: function () {
        var isWizardCompleted = settings.get('isWizardCompleted');
        if (!isWizardCompleted)
            settings.set('isWizardCompleted', true);
        App.navigate('home');
    },
    auth: function () {
        console.log('AppRouter::auth');
        App.KartinaTV.auth(function networkErrorCallback() {
            App.navigate('home');
        });
    },
    authForm: function () {
        console.log('AppRouter::authForm');
        App.KartinaTV.form();
    },
    /**
     * Initialized on start, without hash
     * @method
     */
    home: function () {
        config.rootEl = document.body;
        $('#app-container').show();
        var appView = new AppView({el: $('#app-container')});
        appView.render();

        App.STBModule.start();
        sources.init();

        App.DataModule.on('data.inited', App.MainModule.start, App.MainModule);
        App.DataModule.start();
        App.WeatherModule.start();
    },
    dialog: function () {

        function onEnter(control) {

        }

        var controls = [
            {
                type: 'button',
                id: 'wired_ethernet',
                caption: __('Wired (Ethernet)'),
                x: 0, y: 0, width: 10, height: 10
            },
            {
                type: 'button',
                id: 'wireless_wifi',
                caption: __('Wireless (Wi-Fi)'),
                x: 15, y: 15, width: 10, height: 10
            },
            {
                type: 'button',
                id: 'none',
                caption: __('None'),
                x: 10, y: 40, width: 10, height: 10
            }
        ];
        React.render(React.createElement(RDialog, {controls: controls, onEnter: onEnter}), document.getElementById('react-container'));
    }
});