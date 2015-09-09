/**
 * Created by sergiyjdanuk on 8/6/15.
 */
var RProgramShortInfo = React.createClass({
    render: function () {
        var program = this.props.program;
        return (
            <div>
                <div className="head">
                    <img src={this.props.program.collection.channel.getSmallIcon()} alt="" title="" />
                    <div className="title">
                        <h5>{ program.getFormatDate() }</h5>
                        <h6>{ program.getName() }</h6>
                    </div>
                </div>
                <div className="progressbar">
                    <time className="start absolute">{ program.getBeginFormatTime() }</time>
                    <div className="progress absolute">
                        <div className="bar" style={{width:program.getPositionInPercents()+'%'}}>&nbsp;</div>
                    </div>
                    <time className="end absolute">{ program.getEndFormatTime() }</time>
                </div>
                <br />
                <br />
                <p>{ program.getDescription() }</p>
            </div>
        )
    }
});