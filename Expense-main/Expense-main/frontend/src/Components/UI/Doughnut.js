import React, {useState, useEffect} from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
  
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
  );


export default function DoughnutChart(props) {
  // console.log('Category Data:', props.categoryData);

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Amount spent',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    if (props.categoryData && props.categoryData.length > 0) {
      const categoryMap = [];

      props.categoryData.forEach(item => {
        const amount = parseInt(item.amount);
        if (categoryMap[item.category]) {
          categoryMap[item.category] = parseInt(categoryMap[item.category]) +amount;
        } else {
          categoryMap[item.category] = amount;
        }
      });

      const labels = [];
      const data = [];
      const backgroundColor = [];
      const borderColor = [];

      Object.keys(categoryMap).forEach(category => {
        // console.log('Category:', category);
        labels.push(category);
        // console.log(categoryMap[category]);
        data.push(categoryMap[category]);
        const color = generateRandomColor();
        backgroundColor.push(color);
        borderColor.push(color.replace('0.2', '1'));
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Amount spent',
            data,
            backgroundColor,
            borderColor,
            borderWidth: 1,
          },
          
        ],
      });
    }
  }, [props.categoryData]);
  return (
    <>
        {/* <div className='mt-4 outline grid grid-cols-2 gap-2 text-white'> */}
        <Doughnut
                    data={chartData}
                    // Height of graph
                    height={400}
                    options={{
                      responsive: true,
                      cutout:'80%',
                      radius:'80%',
                      maintainAspectRatio: false,
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
        {/* </div> */}
    </>
  )
}
