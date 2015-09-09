/**
 * @date 8/7/15 5:48 PM
 */
var RDialog = React.createClass({
    onControlRectCallback: function (rect) {
        console.log(rect);
    },
    render: function () {
        var that = this;
        var controls = _.map(this.props.controls, function (v) {
            switch(v.type) {
                case 'button': return <RButton onControlRectCallback={that.onControlRectCallback} params={v} />
                default: return;
            }
        });

        return <div className='ui-dialog-container'>
                <div className='ui-dialog-wrapper'>
                    <div className='ui-dialog'>
                        {controls}
                    </div>
                </div>
        </div>
    }
});