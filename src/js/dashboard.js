// Time to refresh the charts with new data (10 mins)
var refreshTime = 60 * 10 * 1000;

// How many days to show the report over
var slideTimeTitle = document.querySelector('.js-slide-time-title');
var reportDaysDisplay = document.querySelector('.js-days');
var reportDays = reportDaysDisplay.value;

// Full screen selector
var fullScreenOpen = document.querySelector('.js-full-screen-open');
var fullScreenClose = document.querySelector('.js-full-screen-close');

// Theme colours
var body = document.body;
var themeGrideLines = body.classList.contains('light-theme') ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
var themeFontColour = body.classList.contains('light-theme') ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';
var toggleSwitch = document.querySelector('.js-toggle-switch');
var toggleSwitchInput = toggleSwitch.querySelector('.onoffswitch-checkbox');

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
            for (var i = 0; i <= dateRange * 24; i++) {

                if (i === 0) {
                    data.datasetTitle.push(vals[i][1]);
                    data.datasetTitle.push(vals[i][2]);
                    data.datasetTitle.push(vals[i][3]);
                    data.datasetTitle.push(vals[i][4]);
                    data.datasetTitle.push(vals[i][8]);
                } else {

                    if (vals[i] !== undefined) {
                        data.datasets[0].push(vals[i][1]);
                        data.datasets[1].push(vals[i][2]);
                        data.datasets[2].push(vals[i][3]);
                        data.datasets[3].push(vals[i][4]);
                        data.datasets[4].push(vals[i][8]);
                        data.labels.push(vals[i][6] + ' ' + vals[i][5]);
                    } else {
                        data.datasets[0].push(0);
                        data.datasets[1].push(0);
                        data.datasets[2].push(0);
                        data.datasets[3].push(0);
                        data.datasets[4].push(0);
                        data.labels.push('00:00:00');
                    }

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
                        'rgb(206,198,53)',
                    ],
                    pointBackgroundColor: 'rgb(206,198,53)',
                    pointBorderColor: 'rgb(206,198,53)',
                    pointRadius: 1,
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: themeFontColour,
                        beginAtZero: true,
                        suggestedMin: 0,
                        suggestedMax: 3,
                        stepSize: 1
                    },
                    gridLines: {
                        display: true,
                        color: themeGrideLines
                    },
                }],
                xAxes: [
                    {
                        id: 'xAxis1',
                        ticks: {
                            fontColor: themeFontColour,
                            reverse: true,
                            autoSkip: true,
                            callback: function (label) {
                                return label.substring(0, 5);
                            }
                        },
                        gridLines: {
                            display: true,
                            color: themeGrideLines
                        },
                    },
                    {
                        id: 'xAxis2',
                        gridLines: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                            color: themeGrideLines
                        },
                        ticks: {
                            fontColor: themeFontColour,
                            maxRotation: 0,
                            autoSkip: false,
                            reverse: true,
                            callback: function (label) {
                                if (label.substring(0, 3) === '00:') {
                                    return label.substring(9) + ' →';
                                }
                            }
                        }
                    }
                ]
            },
            legend: {
                text: 'something',
                labels: {
                    fontColor: themeFontColour
                }
            },
            title: {
                display: true,
                text: title,
                fontSize: 18,
                fontColor: themeFontColour
            },
            animation: {
                duration: 0
            },
            maintainAspectRatio: false
        }
    });

    // Set height of chart
    chartObject.canvas.parentNode.style.height = window.innerHeight / 2.75 + 'px';

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


/*
* updateChartColours
*
* Function to update the chart with new colours
*/
function updateChartColours(chart) {

    themeGrideLines = body.classList.contains('light-theme') ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)';
    themeFontColour = body.classList.contains('light-theme') ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';

    // Set new colours
    chart.options.scales.yAxes[0].ticks.fontColor = themeFontColour;
    chart.options.scales.yAxes[0].gridLines.color = themeGrideLines;
    chart.options.scales.xAxes[0].ticks.fontColor = themeFontColour;
    chart.options.scales.xAxes[0].gridLines.color = themeGrideLines;
    chart.options.scales.xAxes[1].ticks.fontColor = themeFontColour;
    chart.options.scales.xAxes[1].gridLines.color = themeGrideLines;
    chart.options.legend.labels.fontColor = themeFontColour;
    chart.options.title.fontColor = themeFontColour;

    // update the chart
    chart.update();
}

/*
* openFullScreen
*
* Function to open in full screen
*/
function openFullScreen(elem) {
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { // Chrome, Safari & Opera
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
    }

    body.classList.add('full-screen');
}

/*
* closeFullScreen
*
* Function to open in full screen
*/
function closeFullScreen() {
    document.exitFullscreen();
    body.classList.remove('full-screen');
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
    updateAllCharts(e.target.value);
});

function updateAllCharts(reportDays) {
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
}

fullScreenOpen.addEventListener('click', function () {
    openFullScreen(document.documentElement);
});

fullScreenClose.addEventListener('click', function () {
    closeFullScreen();
});

window.addEventListener('resize', function () {

    var resizeValue = 2.60;

    setTimeout(function () {
        chartObject.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
        chartObject1.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
        chartObject2.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
        chartObject3.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
        chartObject4.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
        chartObject5.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
        chartObject6.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
        chartObject7.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
        chartObject8.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
        chartObject9.canvas.parentNode.style.height = window.innerHeight / resizeValue + 'px';
    }, 500);
});

var glide = new Glide('.glide', {
    autoplay: 30000,
    animationDuration: 1000,
    hoverpause: true
});

glide.on("run", function () {
    if (glide.index !== 0) {
        if (!slideTimeTitle.classList.contains('active')) {
            slideTimeTitle.classList.add('active');
        }
    } else {
        slideTimeTitle.classList.remove('active');
    }
});

// Init the slider
glide.mount();

toggleSwitchInput.addEventListener('change', function (e) {

    reportDays = reportDaysDisplay.value;

    if (toggleSwitchInput.checked) {
        body.classList.remove('light-theme');
        updateChartColours(chartObject);
        updateChartColours(chartObject1);
        updateChartColours(chartObject2);
        updateChartColours(chartObject3);
        updateChartColours(chartObject4);
        updateChartColours(chartObject5);
        updateChartColours(chartObject6);
        updateChartColours(chartObject7);
        updateChartColours(chartObject8);
        updateChartColours(chartObject9);
    } else {
        body.classList.add('light-theme');
        updateChartColours(chartObject);
        updateChartColours(chartObject1);
        updateChartColours(chartObject2);
        updateChartColours(chartObject3);
        updateChartColours(chartObject4);
        updateChartColours(chartObject5);
        updateChartColours(chartObject6);
        updateChartColours(chartObject7);
        updateChartColours(chartObject8);
        updateChartColours(chartObject9);
    }
});