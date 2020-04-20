// Time to refresh the charts with new data (10 mins)
var refreshTime = 60 * 10 * 1000;

// How many days to show the report over
var reportDaysDisplay = document.querySelector('.js-days');
var reportDays = reportDaysDisplay.value;

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
    chartObject.canvas.parentNode.style.height = window.innerHeight/2.75 + 'px';

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

var chartObject;
var chartObject1;
var chartObject2;
var chartObject3;
var chartObject4;
var chartObject5;
var chartObject6;
var chartObject7;
var chartObject8;
var chartObject9;

getData('Home', reportDays, function (data) {
    addChart('metricChart', data.title, data, function (chart) {

        chartObject = chart;

        setInterval(function () {
            getData('Home', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Car Insurance', reportDays, function (data) {
    addChart('metricChart1', data.title, data, function (chart) {

        chartObject1 = chart;

        setInterval(function () {
            getData('Car Insurance', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Multi Car', reportDays, function (data) {
    addChart('metricChart2', data.title, data, function (chart) {

        chartObject2 = chart;

        setInterval(function () {
            getData('Multi Car', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Claims', reportDays, function (data) {
    addChart('metricChart3', data.title, data, function (chart) {

        chartObject3 = chart;

        setInterval(function () {
            getData('Claims', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Home Insurance', reportDays, function (data) {
    addChart('metricChart4', data.title, data, function (chart) {

        chartObject4 = chart;

        setInterval(function () {
            getData('Home Insurance', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Smartmiles', reportDays, function (data) {
    addChart('metricChart5', data.title, data, function (chart) {

        chartObject5 = chart;

        setInterval(function () {
            getData('Smartmiles', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Help', reportDays, function (data) {
    addChart('metricChart6', data.title, data, function (chart) {

        chartObject6 = chart;

        setInterval(function () {
            getData('Help', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('About Us', reportDays, function (data) {
    addChart('metricChart7', data.title, data, function (chart) {

        chartObject7 = chart;

        setInterval(function () {
            getData('About Us', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Contact Us', reportDays, function (data) {
    addChart('metricChart8', data.title, data, function (chart) {

        chartObject8 = chart;

        setInterval(function () {
            getData('Contact Us', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

getData('Coronavirus FAQs', reportDays, function (data) {
    addChart('metricChart9', data.title, data, function (chart) {

        chartObject9 = chart;

        setInterval(function () {
            getData('Coronavirus FAQs', reportDays, function (data) {
                updateChart(chart, data);
            });
        }, refreshTime);
    });
});

reportDaysDisplay.addEventListener('change', function (e) {

    reportDays = e.target.value;

    getData('Home', reportDays, function (data) {
        updateChart(chartObject, data);
    });

    getData('Car Insurance', reportDays, function (data) {
        updateChart(chartObject1, data);
    });

    getData('Multi Car', reportDays, function (data) {
        updateChart(chartObject2, data);
    });

    getData('Claims', reportDays, function (data) {
        updateChart(chartObject3, data);
    });

    getData('Home Insurance', reportDays, function (data) {
        updateChart(chartObject4, data);
    });

    getData('Smartmiles', reportDays, function (data) {
        updateChart(chartObject5, data);
    });

    getData('Help', reportDays, function (data) {
        updateChart(chartObject6, data);
    });

    getData('About Us', reportDays, function (data) {
        updateChart(chartObject7, data);
    });

    getData('Contact Us', reportDays, function (data) {
        updateChart(chartObject8, data);
    });

    getData('Coronavirus FAQs', reportDays, function (data) {
        updateChart(chartObject9, data);
    });
});

var glide = new Glide('.glide', {
    autoplay: 30000,
    animationDuration: 1000,
    hoverpause: true
});
// Init the slider
glide.mount();