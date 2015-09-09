/**
 * @date 8/6/15 1:14 PM
 */
App.module('Wizard', function(Wizard, App, Backbone, Marionette, $ , _) {

    //Wizard.selectLanguage = function (completedCb) {
    //    App.UI.SelectLanguageWizard({
    //        onEnter: function (language) {
    //            App.I18n.setDefaultLanguage(language.code);
    //            if (_.isFunction(completedCb))
    //                completedCb();
    //        }
    //    });
    //};

    function wrapApi(funcName, reactClassName) {
        Wizard[funcName] = function () {
            React.render(
                React.createElement(reactClassName),
                document.getElementById('react-container')
            );
        };
    }

    wrapApi('selectLanguage', RWizardSelectLanguage);

    wrapApi('networkSetupChooseConnectionType', RNetworkSetupChooseConnectionType);
    wrapApi('networkSetupEthernet', RNetworkSetupEthernet);
    wrapApi('networkSetupEthernetAutomatic', RNetworkSetupEthernetAutomatic);
    wrapApi('networkSetupEthernetManual', RNetworkSetupEthernetManual);
    wrapApi('networkSetupChecking', RNetworkSetupChecking);
    wrapApi('networkSetupWiFiCheckingHardware', RNetworkSetupWiFiCheckingHardware);
    wrapApi('networkSetupWiFiNetworks', RNetworkSetupWiFiNetworks);
    wrapApi('networkSetupWiFiChoosingSetup', RNetworkSetupWiFiChoosingSetup);
    wrapApi('networkSetupWiFiManual', RNetworkSetupWiFiManual);

    wrapApi('ktvAuthorization', RWizardKTVAuthorization);
    wrapApi('ktvSettings', RWizardKTVSettings);

    Wizard.on('start', function() {

    });
});