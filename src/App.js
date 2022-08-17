import './App.css';
import {Line} from 'react-chartjs-2';
import axios from 'axios';
import {React, useState, useEffect} from 'react';
import 'chartjs-adapter-moment';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await axios.get('http://104.237.150.204/api/dashboard/stats');
      const tempData = data.map(d => { return {x: d.unixTS * 1000, y:d.temperatureF} });
      const endDate = data[0].unixTS;
      const startDate = data[data.length-1].unixTS;
      console.log(`start: ${startDate}, end: ${endDate}`);
    
      const filteredData = tempData.reduce((prev, curr, i) => i % 15 === 0 ? [...prev, curr] : prev, []);
      console.log(filteredData)
    
      setData(filteredData);
    }
    fetch();
  }, [])
  
  const chartData = {
    datasets: [{
        label: 'Temperature (F)',
        data: data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
  };

  const chartOptions = {
    scales: {
        x: {
            type: 'time',
        }
    }
  };

  return (
    <div className="App">
        <Line  
          options={chartOptions}
          data={chartData}
        />
    </div>
  );
}

export default App;
