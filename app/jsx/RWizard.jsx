/**
 * @date 8/15/15 5:26 PM
 */
var RWizard = React.createClass({
    getDefaultProps: function () {
        return {
            caption: 'Unknown wizard caption'
        }
    },
    render: function () {
        return (
                <div className="dialog-container">
                    <div className="dialog-wrapper">
                        <div className="dialog-content">
                            <div className="border">
                                <div className="caption"><h3>{this.props.caption}</h3></div>
                                <div className="content">
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
});