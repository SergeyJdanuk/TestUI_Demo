/**
 * @date 8/18/15 5:52 PM
 */
var RSectionTV = React.createClass({
    componentDidMount: function () {

    },
    componentWillUnmount: function () {

    },
    close: function () {
        React.unmountComponentAtNode(this.getDOMNode().parentNode);
    },
    focusIn: function () {
        console.log('RSectionTV::focusIn');
        return this.refs.categories.focusIn();
    },
    focusOut: function () {
        console.log('RSectionTV::focusOut');
        return this.refs.categories.focusOut();
    },
    onOffsideLeft: function () {
        if (_.isFunction(this.props.onOffsideLeft))
            return this.props.onOffsideLeft();
    },
    onOffsideRight: function () {
        this.focusOut();
        return this.refs.channels.focusIn();
    },
    onOffsideLeftFromChannels: function () {
        this.refs.categories.focusIn();
    },
    onChangeCategoryItem: function (item) {
        console.log('onChangeCategoryItem', item);
    },
    render: function () {
        return <div>
            <RSectionTVCategoriesList
                ref="categories"
                onOffsideLeft={this.onOffsideLeft}
                onOffsideRight={this.onOffsideRight}
                onChangeItem={this.onChangeCategoryItem}
                />

        </div>
    }
});

/*
<RSectionTVChannelsList
                ref="channels"
                onOffsideLeft={this.onOffsideLeftFromChannels}
                />
<div>
    <div id="categories" class="pos1 list">
        <div class="unactive selected">
            <span class="title">Общие</span><img
                src="img/epg/categories/general.png" alt=""
                onerror="this.src='img/epg/channels/fallback.png'" class="ico">
            <img src="img/epg/categories/general.active.png" alt=""
                 onerror="this.src='img/epg/channels/fallback.png'"
                 class="selected ico"></div>
        <div>
            <span class="title">Познавательные</span><img
                src="img/epg/categories/cognitive.png" alt=""
                onerror="this.src='img/epg/channels/fallback.png'"
                class="ico"><img src="img/epg/categories/cognitive.active.png"
                                 alt=""
                                 onerror="this.src='img/epg/channels/fallback.png'"
                                 class="selected ico"></div>
        <div><span class="title">Новости</span><img
                src="img/epg/categories/news.png" alt=""
                onerror="this.src='img/epg/channels/fallback.png'"
                class="ico"><img src="img/epg/categories/news.active.png" alt=""
                                 onerror="this.src='img/epg/channels/fallback.png'"
                                 class="selected ico"></div>
        <div><span class="title">Развлекательные</span><img
                src="img/epg/categories/comedy.png" alt=""
                onerror="this.src='img/epg/channels/fallback.png'"
                class="ico"><img src="img/epg/categories/comedy.active.png"
                                 alt=""
                                 onerror="this.src='img/epg/channels/fallback.png'"
                                 class="selected ico"></div>
        <div><span class="title">Детские</span><img
                src="img/epg/categories/kids.png" alt=""
                onerror="this.src='img/epg/channels/fallback.png'"
                class="ico"><img src="img/epg/categories/kids.active.png" alt=""
                                 onerror="this.src='img/epg/channels/fallback.png'"
                                 class="selected ico"></div>
        <div><span class="title">Музыкальные</span><img
                src="img/epg/categories/music.png" alt=""
                onerror="this.src='img/epg/channels/fallback.png'"
                class="ico"><img src="img/epg/categories/music.active.png"
                                 alt=""
                                 onerror="this.src='img/epg/channels/fallback.png'"
                                 class="selected ico"></div>
        <div><span class="title">Комедийные</span><img
                src="img/epg/categories/comedy.png" alt=""
                onerror="this.src='img/epg/channels/fallback.png'"
                class="ico"><img src="img/epg/categories/comedy.active.png"
                                 alt=""
                                 onerror="this.src='img/epg/channels/fallback.png'"
                                 class="selected ico"></div>
        <div><span class="title">Спортивные</span><img
                src="img/epg/categories/international.png" alt=""
                onerror="this.src='img/epg/channels/fallback.png'"
                class="ico"><img
                src="img/epg/categories/international.active.png" alt=""
                onerror="this.src='img/epg/channels/fallback.png'"
                class="selected ico"></div>
    </div>
    <div id="channels" class="list pos2">
        <div class="unactive selected"><img
                src="img/common/channel-fallback.png" alt="" title=""
                class="ico"
                onerror="this.src = 'img/common/channel-fallback.png'">

            <span class="title">Iton tv</span><span class="number">1471</span>
        </div>
        <div><img src="http://iptv.kartina.tv/img/ico/2.gif" alt="" title=""
                  class="ico"
                  onerror="this.src = 'img/common/channel-fallback.png'">

            <span class="title">Первый</span><span class="number">2</span></div>
        <div><img src="http://iptv.kartina.tv/img/ico/371.gif" alt="" title=""
                  class="ico"
                  onerror="this.src = 'img/common/channel-fallback.png'">

            <span class="title">ORT International</span><span
                    class="number">371</span></div>
        <div><img src="http://iptv.kartina.tv/img/ico/815.gif" alt="" title=""
                  class="ico"
                  onerror="this.src = 'img/common/channel-fallback.png'">

            <span class="title">Первый HD</span><span class="number">815</span>
        </div>
        <div><img src="http://iptv.kartina.tv/img/ico/3.gif" alt="" title=""
                  class="ico"
                  onerror="this.src = 'img/common/channel-fallback.png'">

            <span class="title">Россия 1</span><span class="number">3</span>
        </div>
        <div><img src="http://iptv.kartina.tv/img/ico/373.gif" alt="" title=""
                  class="ico"
                  onerror="this.src = 'img/common/channel-fallback.png'">

            <span class="title">РТР-Планета</span><span
                    class="number">373</span></div>
        <div><img src="http://iptv.kartina.tv/img/ico/817.gif" alt="" title=""
                  class="ico"
                  onerror="this.src = 'img/common/channel-fallback.png'">

            <span class="title">Россия HD</span><span class="number">817</span>
        </div>
        <div><img src="http://iptv.kartina.tv/img/ico/4.gif" alt="" title=""
                  class="ico"
                  onerror="this.src = 'img/common/channel-fallback.png'">

            <span class="title">НТВ</span><span class="number">4</span></div>
    </div>
    <div id="programm" class="list pos3"></div>
    <div id="rightInfo" class="pos4 screen_width content_top"></div>
</div>

*/