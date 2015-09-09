/**
 * @date 8/14/15 12:41 PM
 */
var RModalDialog = React.createClass({
    render: function () {
        return <div className='modal-dialog-container'>
                    <div className='modal-dialog-wrapper'>
                        <div className='modal-dialog-content'>
                            {this.props.children}
                        </div>
                    </div>
                </div>
    }
});