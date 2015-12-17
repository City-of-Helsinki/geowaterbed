
var chart = null;

function get_title(obs, no_dates) {
    var title;
    switch (obs.type) {
        case 'pohja':
            title = "Pohjaveden korkeus ja normaalitaso";
            break;
        case 'orsi':
            title = "Orsiveden korkeus ja normaalitaso";
            break;
        default:
            title = "Veden korkeus ja normaalitaso";
    }

    if (!no_dates) {
        moment.locale('fi');
        title = title + ' ' + moment(obs.first).format('l') + ' - ' + moment(obs.last).format('l');
    }
    return title;
}

function charter (start) {
        var filtered = filter_data(SERIES.range, SERIES.observators[SERIES.selected].observations.data);
        chart = new Highcharts.Chart({
        chart: {
            renderTo: 'contained_chart',
            zoomType: 'x'
        },
        title: {
            text: get_title(SERIES.observators[SERIES.selected])
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
                text: get_title(SERIES.observators[SERIES.selected], true)
            }
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
            data: filtered
        }]
    });
    if (start) $('.mobile #container').hide();
    if (start) update_plotlines();
}


var LINES = [
    {id : 'avg', 'title': 'keskiarvo', color: 'blue', width: 2, dashstyle: 'Solid'},
    {id : 'halymin', title: 'huomiorajaminimi', color: 'red', width: 1, dashstyle: 'ShortDash'},
    {id : 'halymax', title: 'huomiorajamaksimi', color: 'red', width: 1, dashstyle: 'ShortDash'}
];

function update_plotlines() {
    var obs = SERIES.observators[SERIES.selected];
    LINES.forEach(function (line) {
        chart.yAxis[0].removePlotLine(line.id);
        if (obs[line.id]) {
            chart.yAxis[0].addPlotLine({
                value: obs[line.id],
                color: line.color,
                width: line.width,
                zIndex: 4,
                label: {
                    text: line.title,
                    style: {
                        color: line.color,
                        fontWeight: 'bold'
                    }
                },
                id: line.id,
                dashStyle: line.dashstyle
            });
        }
    });
    $('#observators_amount').html('<span>Havaintojen määrä (kaikki havainnot): ' + obs.selected_amount +
        ' (' + obs.observations.data.length + ') </span> <br>' +
        ' <span> Veden korkeuden keskiarvo: ' + obs.avg + '</span> </div>')
}


function update_observator(key) {
    if (SERIES.observators[key].observations) {
        SERIES.selected = key;
        chart.series[0].setData(filter_data(SERIES.range, SERIES.observators[SERIES.selected].observations.data));
        chart.setTitle({text: get_title(SERIES.observators[SERIES.selected])});
        update_plotlines()
    } else {
        $.getJSON('data/' + key, function (resp, status) {
            SERIES.observators[key].observations = resp;
            SERIES.selected = key;
            chart.series[0].setData(filter_data(SERIES.range, SERIES.observators[SERIES.selected].observations.data));
            chart.setTitle({text: get_title(SERIES.observators[SERIES.selected])});
            update_plotlines()
        })
    }
}

function filter_data(range, data) {

    if (range === 'all') {
        SERIES.observators[SERIES.selected].first = data[0][0];
        SERIES.observators[SERIES.selected].last = data[data.length - 1][0];
        SERIES.observators[SERIES.selected].selected_amount = data.length;
        return data;
    }

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
    SERIES.observators[SERIES.selected].first = filtered[0][0];
    SERIES.observators[SERIES.selected].last = filtered[filtered.length - 1][0];
    SERIES.observators[SERIES.selected].selected_amount = filtered.length;
    return filtered;
}

function chart_reflow() {
    chart.reflow();
}
