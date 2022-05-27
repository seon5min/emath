/* 차트 */
function chartDataSetMath(chartLabel, chartData){
    var chartDataset = null;
    var chartOption = null;
    chartDataset = {
        labels: chartLabel,
        datasets: [{
            type: 'line',
            label: '나의 점수',
            borderColor: '#4e42ca',
            data: chartData,
            fill: true,
            pointRadius:3,
            pointBackgroundColor: '#4e42ca',
            borderWidth:1,
            pointBorderWidth:0,
            backgroundColor:"rgba(78, 66, 202, 0.15)",
            lineTension:0.4
        }]
    };

    // Options
    chartOption = {
        responsive: true,
        maintainAspectRatio: false,
        bezierCurve:true,
        title: {
            display: false,
        },
        tooltips: {
            display: false
        },
        legend: {
            display: false,
        },
        plugins: {
            // tooltip
            tooltip: {
                displayColors: false,
                mode: 'x',
                intersect: false
            },
            legend: false
        },
        layout: {
            padding: {
                // padding
                left: -14
            }
        },
        scales: {
            x:{
                ticks: false, // ticks
                grid: {
                    color: "transparent",
                    display: false,
                    zeroLineColor: "transparent",
                    zeroLineWidth: 1

                }

            },
            y: {
                 // y축 옵션
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: {
                    stepSize:20,
                    beginAtZero: true,
                    color: "#000",
                    font: {
                        size: 14,
                        family: "'Noto Sans KR','맑은 고딕','Malgun Gothic','Roboto'"
                    },
                    padding : 15,


                },
                grid: {
                    color: "#e1e1e1",
                    display: true,
                    drawBorder: false,
                    drawTicks: false,
                    zeroLineColor: "transparent",

                },
            },
        },
    }
    var chartSet = {
        type: 'line',
        data: chartDataset,
        options: chartOption,
    }
    return chartSet;
}