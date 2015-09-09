/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/27/15 2:15 PM
 * 
 * History  : 
 */
List.View = Backbone.View.extend({
    initialize: function () {
        this.model.on('update', this.render, this);
        this.render();
    },
    render: function () {

        var model = this.model;

        var i = model.getBeginVisibleIndex(),
            visibleCount = model.getVisibleCount(),
            count = model.getCount(),
            html = '';
        //TODO move to template
        html += '<ul' + (this.model.isFocused()? ' class="active"' : '') + '>';
        for (var y = 0; i < count && y < visibleCount; i++, y++)
        {
            var selected = '',
                item = model.getCollectionItemByIndex(i);

            if (item.isSelected()){
                selected = " class='selected'";
            }

            html += '<li'+selected+'>'+item.getTitle()+'</li>';
        }
        html += '</ul>';

        $(this.$el).html(html);
    },
    remove: function() {
        this.model.off(null, null, this);
    }
});