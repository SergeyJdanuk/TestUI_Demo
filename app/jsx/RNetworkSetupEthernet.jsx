/**
 * @date 8/11/15 2:01 PM
 */
var RNetworkSetupEthernet = React.createClass({

    keyEnter: function (item) {
        if (item.url == 'none')
            return App.navigate('wizard/network-setup/completed');

        if (item.url == 'back')
            return App.back();

        App.navigate(item.url);
    },

    close: function () {
        React.unmountComponentAtNode(this.getDOMNode().parentNode);
    },

    render: function () {

        var buttons = [
            {title: __('OK (Automatic Setup)'), url: 'wizard/network-setup/ethernet/automatic'},
            {title: __('Manual Setup'), url: 'wizard/network-setup/ethernet/manual'},
            {title: __('Back'), url: 'back'}
        ];

        return (<RNetworkSetup>
                    <p className='text'>
                        {__('The following settings will be applied')}
                        <br/>
                        {__('Connection type: Wired (Ethernet)')}
                    </p>
                    <RNetworkSetupList items={buttons} onEnter={this.keyEnter} />
                </RNetworkSetup>)
    }
});