$ ->
    $('.top-tweet-item').click ->
        twitter_id = $(this).data('id')

        d3.selectAll('.node').classed('selected', false)
        d3.select('.n' + twitter_id).classed('selected', true)
