
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
                    color: 'blue',
                    width: 2,
                    zIndex: 4,
                    label: {text: 'keskiarvo'},
                    id: 'avg'
                },
            {
                    value: SERIES.observators[SERIES.selected].min,
                    color: '#ff0000',
                    width: 2,
                    zIndex: 5,
                    label: {text: 'minimi'},
                    id: 'min'
                },
            {
                    value: SERIES.observators[SERIES.selected].max,
                    color: '#ff0000',
                    width: 2,
                    zIndex: 6,
                    label: {text: 'max'},
                    id: 'max'
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
            data: SERIES.observators[SERIES.selected].observations.data
        }]
    });
}


var LINES = [
    {id : 'avg', 'title': 'keskiarvo', color: 'blue'},
    {id : 'min', title: 'minimi', color: '#ff0000'},
    {id : 'max', title: 'maksimi', color: '#ff0000'}
];

function update_plotlines() {
    LINES.forEach(function (line) {
        chart.yAxis[0].removePlotLine(line.id);
        if (SERIES.observators[SERIES.selected][line.id]) {
            chart.yAxis[0].addPlotLine({
                value: SERIES.observators[SERIES.selected][line.id],
                color: line.color,
                width: 2,
                zIndex: 4,
                label: {text: line.title},
                id: line.id
            });
        }
    });
}


function update_observator(key) {
    if (SERIES.observators[key].observations) {
        SERIES.selected = key;
        chart.series[0].setData(SERIES.observators[SERIES.selected].observations.data);
        update_plotlines()
    } else {
        $.getJSON('data/' + key, function (resp, status) {
            SERIES.observators[key].observations = resp;
            SERIES.selected = key;
            chart.series[0].setData(SERIES.observators[SERIES.selected].observations.data);
            update_plotlines()
        })
    }
}

function chart_reflow() {
    chart.reflow();
}
