
var FULL_APP = '620';

function respond() {
    var height = $(window).height();
    var width = $(window).width() - 20;

    var chart_orig_width = $('#container').width();
    var map_orig_width = $('#map').width();

    if (width < FULL_APP) {
        console.log('mobile');
        $("#app").css('width', width).toggleClass('mobile', true);
        $("#container").css('width', width);
        $('#map').width(width);
    } else {
        console.log('no mobile');
        $("#app").css('width', 'auto').toggleClass('mobile', false);
        $("#container").css('width', chart_orig_width);
        $('#map').width(map_orig_width);
    }
}

$(document).ready(function() {
    charter();
    respond();
    $(window).bind('resize', respond);
});