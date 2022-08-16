import {
	BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title,
	Tooltip
} from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);

const BarChart = (props) => {
  const options = {
	datasets: {
		line: {
			pointRadius: 0 // disable for all `'line'` datasets
		}
	},
	elements: {
		point: {
			radius: 0 // default to disabled in all datasets
		}
	},
		responsive: true,
		interaction: {
				mode: 'index',
				intersect: false,
		},
		stacked: false,
		plugins: {
				title: {
				display: true,
				},
		},
		scales: {
			x: {
	
				title: {
					display: true,
					text: props.ax.x
				  }
				},
				y: {
				type: 'linear',
				display: true,
				position: 'left',
				title: {
					display: true,
					text: props.ax.y
				  }
				},
		},
		};
		
		const data = {
		labels: props.data.x,
		datasets: [
				{
				label: 'BarChart',
				data: props.data.y,
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)',
				yAxisID: 'y',
				}
		],
		};

  return (
    <>
        <Bar options={options} data={data} />
    </>
  )
}

export default BarChart