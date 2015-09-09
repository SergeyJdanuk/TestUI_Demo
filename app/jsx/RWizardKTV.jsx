/**
 * @date 8/15/15 5:26 PM
 */
var RWizardKTV = React.createClass({
    render: function () {

        return <RWizard caption={__('KartinaTV Setup')}>
                    {this.props.children}
                </RWizard>
    }
});