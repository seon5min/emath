/* 차트 */
function chartDataSetMath(chartLabel, chartData){
    var chartDataset = null;
    var chartOption = null;

    chartDataset = {
        labels:	chartLabel,
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
            legend: false,
        },
		layout: {
		  padding: {
			left:0
		  }
		},
		scales: {
			x:{
				ticks: {
					  color: 'transparent',
				},
				  grid: {
					color: "transparent",
					display: false,
					zeroLineColor: "transparent",
					zeroLineWidth: 0,
				}
				
			},
			y: {
				ticks: {
					color: 'transparent',
					fontSize : 0
				},
				 grid: {
				  color: "#e1e1e1",
				  display: true,
				  drawBorder: false,
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
