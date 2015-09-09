/**
 * @date 8/11/15 2:01 PM
 */
var RNetworkSetupChooseConnectionType = React.createClass({

    keyEnter: function (item) {
        if (item.url == 'none')
            return App.navigate('wizard/network-setup/completed');

        App.navigate(item.url);
    },

    close: function () {
        React.unmountComponentAtNode(this.getDOMNode().parentNode);
    },

    render: function () {

        var buttons = [
            {title: __('Wired (Ethernet)'), url: 'wizard/network-setup/ethernet'},
            {title: __('Wireless (WiFi)'), url: 'wizard/network-setup/wifi'},
            {title: __('None'), url: 'none'}
        ];

        return (<RNetworkSetup>
                    <p className='text'>{__('Please choose network connection type.')}</p>
                    <RNetworkSetupList key="networkSetupList" items={buttons} onEnter={this.keyEnter} />
                </RNetworkSetup>)
    }
});