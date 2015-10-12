
var FULL_APP = '620';

function isRetinaDisplay() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        return (mq && mq.matches || (window.devicePixelRatio > 1));
    }
}

function respond() {

    var retina = isRetinaDisplay();

    return function () {
        var height = $(window).height() - 20;
        var width = $(window).width() - 20;
        console.log('respond activate', height, width, retina);
        if (width < FULL_APP) {
            $("#app").toggleClass('mobile', true).css('max-width', width);
            $("#container").css({'width': width, 'max-width' : width, 'max-height' : map_orig_height, height: map_orig_height});
            $('#map').css('max-width', width);
            window.requestAnimationFrame(function () {
               chart_reflow();
            });
        } else {

            var top_halves_height = height / 2;
            var top_halves_width = width / 2;

            $("#app").toggleClass('mobile', false).css('max-width', '90%');
            $("#container").css({'width': width, 'max-width' : '90%', 'max-height' : '30em'});
            $('#map').css({'height':height, 'width': width, 'max-width' : '40%', 'max-height' : '32em'});
            $('#observators').css({'height':"24em", 'width': width, 'max-width' : '40%', 'max-height' : '32em'});
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
        $('#container').hide();
    });

    $(window).bind('resize', respond());
    $(window).resize();

    $('#timerange_toolbar').click(function (e) {
        console.log("setting range", e.target.value);
        SERIES.range = e.target.value;
        $('#timerange_toolbar button').removeClass('active');
        $(e.target).toggleClass('active');
        update_observator(SERIES.selected)
    });

    respond();
    create_map();

});
