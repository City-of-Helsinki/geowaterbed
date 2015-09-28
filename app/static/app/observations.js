
var chart = null;

function charter () {
        chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
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
                    value: SERIES.observators[SERIES.selected].avg,
                    color: '#ff0000',
                    width: 2,
                    zIndex: 4,
                    label: {text: 'keskiarvo'},
                    id: 'avg'
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
            data: SERIES.observators[SERIES.selected].observations.data
        }]
    });
}

function update_observator(key) {
    if (SERIES.observators[key].observations) {
        SERIES.selected = key;
        chart.series[0].setData(SERIES.observators[SERIES.selected].observations.data);
        chart.yAxis[0].removePlotLine('avg');
        chart.yAxis[0].addPlotLine({
            value: SERIES.observators[SERIES.selected].avg,
            color: '#ff0000',
            width: 2,
            zIndex: 4,
            label: {text: 'keskiarvo'},
            id: 'avg'
        });
    } else {
        $.getJSON('/' + key + '/', function (resp, status) {
            SERIES.observators[key].observations = resp;
            SERIES.selected = key;
            chart.series[0].setData(SERIES.observators[SERIES.selected].observations.data);
            chart.yAxis[0].removePlotLine('avg');
            chart.yAxis[0].addPlotLine({
                value: SERIES.observators[SERIES.selected].avg,
                color: '#ff0000',
                width: 2,
                zIndex: 4,
                label: {text: 'keskiarvo'},
                id: 'avg'
            });
        })
    }
}

function chart_reflow() {
    chart.reflow();
}
