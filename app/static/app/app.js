
var FULL_APP_WIDTH = '620';
var FULL_APP_HEIGTH = '620';

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
        console.log('respond activate', height / 2, width / 2, retina);
        if (width < FULL_APP_WIDTH || height < FULL_APP_HEIGTH) {
            window.MOBILE = true;
            $("#app").toggleClass('mobile', true).css('max-width', width);
            $("#container").css({'width': width, 'max-width' : width, 'max-height' : "100%", height: "35em"});
            $('#map').css({'height':height, 'width': width, 'max-width' : '90%', 'max-height' : '32em'});
            $('#observators').css({'height':"28em", 'width': width, 'max-width' : '100%', 'max-height' : '32em'});
            window.requestAnimationFrame(function () {
               chart_reflow();
            });
        } else {
            window.MOBILE = false;
            var top_halves_height = height / 2 - 200;
            var top_halves_width = width / 2;

            $("#app").toggleClass('mobile', false).css('max-width', '90%');
            $("#container").css({'width': width, 'max-width' : '100%', 'max-height' : top_halves_height + 'px'});
            $('#map').css({'height':'26em', 'width': width, 'max-width' : '60%', 'max-height' : top_halves_height + 'px'});
            $('#observators').css({'height':"24em", 'width': width, 'max-width' : '40%', 'max-height' : top_halves_height + 'px'});
            window.requestAnimationFrame(function () {
               chart_reflow();
            });
        }
    }
}

$(document).ready(function() {

    $('#container_mobiletoolbar button').click(function () {
        $('#container').hide();
    });

    $(window).bind('resize', respond());
    $(window).resize();

    $('#timerange_toolbar button').click(function (e) {
        SERIES.range = e.target.value;
        $('#timerange_toolbar button').removeClass('active');
        $(e.target).toggleClass('active');
        update_observator(SERIES.selected)
    });

    $('#observators button').click(function (e) {
        SERIES.selected = e.target.value;
        $('#observators button').removeClass('active');
        $(e.target).toggleClass('active');
        update_observator(SERIES.selected);
        center_marker(SERIES.selected);
        $('#container').show();
    });

    $('#switch_nav button').click(function (e) {
        switch (e.target.value) {
            case "map":
                $('#observators').hide();
                $('button[value="map"]').toggleClass('active');
                $('button[value="observators"]').toggleClass('active');
                break;
            case "observators":
                $('#observators').show();
                $('button[value="map"]').toggleClass('active');
                $('button[value="observators"]').toggleClass('active');
                break;
       }
    });

    $('button[value="map"]').toggleClass('active');
    $('button[value="'+ SERIES.selected + '"]').toggleClass('active');

    // Calculate layout
    respond();

    // Draw map
    create_map();

    // Draw the chart
    charter(true);

});
