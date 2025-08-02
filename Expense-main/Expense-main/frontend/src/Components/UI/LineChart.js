import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, Colors, Filler, plugins } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, Filler);

const LineGraph = (props) => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'Saving',
      fill: true,
      // backgroundColor: 'rgba(75,192,192,0.2)',
      plugins: {
        filler: {
          propagate: true
        }
      },
      data: [props.savingData.jan, props.savingData.feb, props.savingData.mar, props.savingData.apr, props.savingData.may, props.savingData.jun, props.savingData.jul, props.savingData.aug, props.savingData.sept, props.savingData.oct, props.savingData.nov, props.savingData.dec],
      borderColor: 'maroon',
      backgroundColor: 'white',
      tension: 0.2,
      
    }]
  };
  
  return (
    <>
      <Line
        data={data}
      />
    </>
  );
};

export default LineGraph;
