
var FULL_APP = '620';

function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
}

function respond() {
    var height = $(window).height();
    var width = $(window).width() - 20;
    console.log('respond activate', height, width, isRetinaDisplay());

    var chart_orig_width = $('#container').width();
    var chart_orig_height = $('#container').height();
    var map_orig_width = $('#map').width();
    var map_orig_height = $('#map').height();

    return function () {
        var height = $(window).height();
        var width = $(window).width() - 20;
        if (width < FULL_APP) {
            $("#app").toggleClass('mobile', true).css('max-width', width);
            $("#container").css({'width': width, 'max-width' : width, 'max-height' : map_orig_height, height: map_orig_height});
            $('#map').css('max-width', width);
            window.requestAnimationFrame(function () {
               chart_reflow();
            });
        } else {
            $("#app").toggleClass('mobile', false).css('max-width', 'auto');
            $("#container").css({'width': chart_orig_width, 'max-width' : 'auto', 'max-height' : 'auto'});
            $('#map').css({'width': chart_orig_width, 'max-width' : 'auto'});
            window.requestAnimationFrame(function () {
               chart_reflow();
            });
        }
    }
}

$(document).ready(function() {

    // Draw the chart
    charter();

    $('#container_mobiletoolbar button').click(function () {
        $('#contained_chart').hide();
    });

    $(window).bind('resize', respond());
    $(window).resize();

    $('#timerange_toolbar').click(function (e) {
        console.log("setting range", e.target.value);
        SERIES.range = e.target.value;
        update_observator(SERIES.selected)
    });

});
