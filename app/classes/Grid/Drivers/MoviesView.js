/**
 * @author  : Sergey Jdanuk <jdanuk at gmail.com>
 * @date    : 7/23/15 4:28 PM
 * 
 * History  : 
 */
Grid.MoviesView = Grid.AbstractView.extend({
    initialize: function () {
        this.model.on('update', this.render, this);
        this.render();
    },
    render: function () {

        var model = this.model;

        var beginVisibleIndex = model.getBeginVisibleIndex();
        var endVisibleIndex = model.getEndVisibleIndex();
        var i = beginVisibleIndex;
        var rows = model.getRowsCount();
        var cols = model.getColsCount();

        var html = '';
        
        for (var y = 0; y < rows; y++)
        {
            html += '<ul>';
            for(var x = 0; i < endVisibleIndex && x < cols; x++, i++)
            {
                var selected = '';

                var movie = model.getCollectionItemByIndex(i);

                if (this.model.isFocused() && movie.isSelected())
                    selected = " class='selected'";

                html += '<li'+selected+'><img src="'+movie.getThumbnail()+'" alt="" onerror="this.src=\'img/common/no_thumbnail.jpg\'" /></li>';
            }
            html += '</ul>';
        }
        this.$el.html(html);
    }
});