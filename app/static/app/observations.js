
$(function () {
    // ISO date to epoch seconds
    for (var i= 0; i<SERIES.data.length; i++) {
        var d = new Date(SERIES.data[i][0]);
        var dd = d.getTime();
        SERIES.data[i][0] = dd;
    }

    $('#container').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Pohjaveden korkeus ja normaalitaso'
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                    'Click and drag in the plot area to zoom in' :
                    'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime',
            //minRange: 28 * 24 * 3600000 // fourteen days
        },
        yAxis: {
            title: {
                text: 'Pohjaveden korkeus'
            },
            plotLines:[{
                    value: SERIES.avg,
                    color: '#ff0000',
                    width: 2,
                    zIndex: 4,
                    label: {text: 'keskiarvo'}
                }]

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                },
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },

        series: [{
            type: 'area',
            name: 'Pohjaveden korkeus',
            //pointInterval: 24 * 3600 * 1000,
            //pointStart: Date.UTC(SERIES.first[0], SERIES.first[1], SERIES.first[2]),
            data: SERIES.data
        }]
    });
});