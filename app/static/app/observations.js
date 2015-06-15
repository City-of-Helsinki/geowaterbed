
var labels = ["January", "February", "March", "April", "May", "June", "July"];
var data = [4,6,10,20,22,43, 12];

var config = {
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
        }
    ]
};

function set_chart(labels, data, config) {
    config.labels = labels;
    config.datasets[0].data = data;
    return config;
}

var ctx = document.getElementById("obschart").getContext("2d");

function create_chart(labels, data, config, ctx) {
    var myLineChart = new Chart(ctx).Line(set_chart(
        labels, data, config
    ), {});
}

create_chart(labels, data, config, ctx);
