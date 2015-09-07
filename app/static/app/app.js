
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
    var map_orig_width = $('#map').width();

    return function () {
        if (width < FULL_APP) {
            console.log('mobile');
            $("#app").css('max-width', width).toggleClass('mobile', true);
            $("#container").css({'width': width, 'max-width' : width, 'max-height' : height, height: height});
            $('#map').css('max-width', width);
            window.requestAnimationFrame(function () {
               chart_reflow();
            });
        } else {
            console.log('no mobile');
            $("#app").css('max-width', 'auto').toggleClass('mobile', false);
            $("#container").css({'width': chart_orig_width, 'max-width' : 'auto', 'max-height' : 'auto'});
            $('#map').css({'width': chart_orig_width, 'max-width' : 'auto'});
            window.requestAnimationFrame(function () {
               chart_reflow();
            });
        }
    }

}

$(document).ready(function() {
    charter();
    $(window).bind('resize', respond());
    $(window).resize();
});
