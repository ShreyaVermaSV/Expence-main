import React from 'react'

import { Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,


} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


export default function BarChart(props) {
  return (
    <>                <Bar
      data={{
        // Name of the variables on x-axies for each bar
      
        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "Septembar", "October", "November", "December"],
        datasets: [
          {
            // Label for bars
            label: "Monthly Expenses",
            // Data or value of your each variable
            barPercentage: 0.1,
            barThickness: 20,
            minBarLength: 1,
            data: [
              props.chartData.jan, props.chartData.feb, props.chartData.mar, props.chartData.apr, props.chartData.may, props.chartData.jun,
              props.chartData.jul, props.chartData.aug, props.chartData.sept, props.chartData.oct, props.chartData.nov, props.chartData.dec
            ],
            backgroundColor:
              ["#3e95cd"],

          },
        ],
      }}
      // Height of graph
      height={400}

      options={{

        maintainAspectRatio: false,
        responsive:true,

        // scales: {
        //   yAxes: [
        //     {
        //       x: {
        //         beginAtZero: true,
        //       },
        //       y: {
        //         beginAtZero: true,
        //       },
        //     },
        //   ],
        // },
        // legend: {
        //   labels: {
        //     fontSize: 15,
        //   },
        // },
      }}
    />
    </>
  )
}
