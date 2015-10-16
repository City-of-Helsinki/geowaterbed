
var chart = null;

function charter (start) {
        chart = new Highcharts.Chart({
        chart: {
            renderTo: 'contained_chart',
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
            data: filter_data(SERIES.range, SERIES.observators[SERIES.selected].observations.data)
        }]
    });
    if (start) $('.mobile #container').hide();
    if (start) update_plotlines();
}


var LINES = [
    {id : 'avg', 'title': 'keskiarvo', color: 'blue'},
    {id : 'min', title: 'minimi', color: '#ff0000'},
    {id : 'max', title: 'maksimi', color: '#ff0000'},
    {id : 'halymin', title: 'huomiorajaminimi', color: 'red'},
    {id : 'halymax', title: 'huomiorajamaksimi', color: 'red'}
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
    $('#observators_amount').text('Havaintojen määrä (kaikki havainnot):' + SERIES.observators[SERIES.selected].selected_amount +
        ' (' + SERIES.observators[SERIES.selected].observations.data.length + ')')
}


function update_observator(key) {
    if (SERIES.observators[key].observations) {
        SERIES.selected = key;
        chart.series[0].setData(filter_data(SERIES.range, SERIES.observators[SERIES.selected].observations.data));
        update_plotlines()
    } else {
        $.getJSON('data/' + key, function (resp, status) {
            SERIES.observators[key].observations = resp;
            SERIES.selected = key;
            chart.series[0].setData(filter_data(SERIES.range, SERIES.observators[SERIES.selected].observations.data));
            update_plotlines()
        })
    }
}

function filter_data(range, data) {

    if (range === 'all') return data;

    // Take last observation which is assumed to be latest
    var last = data[data.length - 1];
    // get Unix time in ms span months from this moment
    var last_moment = moment(last[0]);
    var range_before = last_moment.subtract(range, 'months').valueOf();

    var filtered = [];
    for (var i=0; i < data.length; i++) {
        var datum = data[i];
        if (datum[0] >= range_before) {
            filtered.push(datum)
        }
    }
    SERIES.observators[SERIES.selected].selected_amount = filtered.length;
    return filtered;
}

function chart_reflow() {
    chart.reflow();
}
