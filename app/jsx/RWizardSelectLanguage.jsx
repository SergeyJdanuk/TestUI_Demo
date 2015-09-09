/**
 * @date 8/6/15 1:24 PM
 */
var RWizardSelectLanguage = React.createClass({
    componentDidMount: function () {

    },
    componentWillUnmount: function () {

    },
    keyEnter: function (item) {
        App.I18n.setDefaultLanguage(item.code);
        App.navigate('wizard/select-language/completed');
    },
    render: function() {
        return <RWizard caption={__('Select language')}>
                    <RList items={App.I18n.getLanguages()} focused={true} onEnter={this.keyEnter} />
                    <br />
                </RWizard>
    }
});