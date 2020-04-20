// Time to refresh the charts with new data (10 mins)
var refreshTime = 60 * 10 * 1000;

// How many days to show the report over
var reportDays = 1;

/*
* getData
*
* Function to get the data from the API
*/
function getData(sheetName, dateRange, callback) {

    // Set our HTTP request
    var xhr = new XMLHttpRequest();

    // Setup listener to process completed requests
    xhr.onload = function () {

        // Process return data
        if (xhr.status >= 200 && xhr.status < 300) {

            var vals = JSON.parse(xhr.response).values;
            var data = {
                labels: [],
                datasetTitle: [],
                datasets: {
                    0: [],
                    1: [],
                    2: [],
                    3: [],
                    4: [],
                },
                title: vals[1][0]
            };

            // Start at 1 as we don't need the first array (contains labels)
            for (var i = 0; i <= dateRange*24; i++) {

                if (i === 0) {
                    data.datasetTitle.push(vals[i][1]);
                    data.datasetTitle.push(vals[i][2]);
                    data.datasetTitle.push(vals[i][3]);
                    data.datasetTitle.push(vals[i][4]);
                    data.datasetTitle.push(vals[i][8]);
                } else {
                    // Values
                    data.datasets[0].push(vals[i][1]);
                    data.datasets[1].push(vals[i][2]);
                    data.datasets[2].push(vals[i][3]);
                    data.datasets[3].push(vals[i][4]);
                    data.datasets[4].push(vals[i][8]);
                    data.labels.push(vals[i][6]);
                }
            }

            // Return the data
            callback(data);

        } else {
            console.log('The request failed!');
        }
    };

    // Send the request
    xhr.open('GET', 'https://sheets.googleapis.com/v4/spreadsheets/1SSIkRt0WgSDgD6XvQiWsXBOUApTE1RFZ-zFftKyaG6Q/values/' + sheetName + '?key=AIzaSyDxuzVaF80Tx4nN3xqfSHeYznHTCTA01Lk');
    xhr.send();
}

/*
* addChart
*
* Function to add a chart
*/
function addChart(chart, title, data, callback) {

    // Get the chart element
    var ctx = document.getElementById(chart).getContext('2d');

    // Set the chart
    var chartObject = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: data.datasetTitle[0],
                    data: data.datasets[0],
                    fill: false,
                    borderColor: [
                        'rgba(54, 162, 235, 1)'
                    ],
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: 'rgba(54, 162, 235, 1)',
                    pointRadius: 1,
                    borderWidth: 2
                },
                {
                    label: data.datasetTitle[1],
                    data: data.datasets[1],
                    fill: false,
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                    ],
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 1,
                    borderWidth: 2
                },
                {
                    label: data.datasetTitle[2],
                    data: data.datasets[2],
                    fill: false,
                    borderColor: [
                        'rgb(65, 255, 99)',
                    ],
                    pointBackgroundColor: 'rgba(65, 255, 99, 1)',
                    pointBorderColor: 'rgba(65, 255, 99, 1)',
                    pointRadius: 1,
                    borderWidth: 2
                },
                {
                    label: data.datasetTitle[3],
                    data: data.datasets[3],
                    fill: false,
                    borderColor: [
                        'rgb(255, 140, 26)',
                    ],
                    pointBackgroundColor: 'rgba(255, 140, 26, 1)',
                    pointBorderColor: 'rgba(255, 140, 26, 1)',
                    pointRadius: 1,
                    borderWidth: 2
                },
                {
                    label: data.datasetTitle[4],
                    data: data.datasets[4],
                    fill: false,
                    borderColor: [
                        'rgb(255,247,55)',
                    ],
                    pointBackgroundColor: 'rgba(255,247,55, 1)',
                    pointBorderColor: 'rgba(255,247,55, 1)',
                    pointRadius: 1,
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: '#6e6e6e',
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: 3,
                        stepSize: 1
                    },
                    gridLines: {
                        display: true,
                        color: "#262626"
                    },
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#6e6e6e',
                        reverse: true
                    },
                    gridLines: {
                        display: true,
                        color: "#262626"
                    },
                }]
            },
            legend: {
                text: 'something',
                labels: {
                    fontColor: '#6e6e6e'
                }
            },
            title: {
                display: true,
                text: title,
                fontSize: 18,
                fontColor: 'white'
            },
            animation: {
                duration: 0
            },
            maintainAspectRatio: false
        }
    });

    // Set height of chart
    chartObject.canvas.parentNode.style.height = window.innerHeight/2.3 + 'px';

    // Return the chart object
    callback(chartObject);

}

/*
* updateChart
*
* Function to update the chart with new data
*/
function updateChart(chart, data) {

    // Set the new labels
    chart.data.labels = data.labels;

    for (var i = 0; i < chart.data.datasets.length; i++) {

        // Push the new data to the chart
        chart.data.datasets[i].data = data.datasets[i];
    }

    // update the chart
    chart.update();
}

getData('Home', reportDays, function (data) {
    addChart('myChart', data.title, data, function (chart) {
        setInterval(function () {
            getData('Home', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Car Insurance', reportDays, function (data) {
    addChart('myChart1', data.title, data, function (chart) {
        setInterval(function () {
            getData('Car Insurance', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Multi Car', reportDays, function (data) {
    addChart('myChart2', data.title, data, function (chart) {
        setInterval(function () {
            getData('Multi Car', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Claims', reportDays, function (data) {
    addChart('myChart3', data.title, data, function (chart) {
        setInterval(function () {
            getData('Claims', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Home Insurance', reportDays, function (data) {
    addChart('myChart4', data.title, data, function (chart) {
        setInterval(function () {
            getData('Home Insurance', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Smartmiles', reportDays, function (data) {
    addChart('myChart5', data.title, data, function (chart) {
        setInterval(function () {
            getData('Smartmiles', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Help', reportDays, function (data) {
    addChart('myChart6', data.title, data, function (chart) {
        setInterval(function () {
            getData('Help', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('About Us', reportDays, function (data) {
    addChart('myChart7', data.title, data, function (chart) {
        setInterval(function () {
            getData('About Us', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Contact Us', reportDays, function (data) {
    addChart('myChart8', data.title, data, function (chart) {
        setInterval(function () {
            getData('Contact Us', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

var glide = new Glide('.glide', {
    autoplay: 30000,
    animationDuration: 1000,
    hoverpause: true
});
// Init the slider
glide.mount();