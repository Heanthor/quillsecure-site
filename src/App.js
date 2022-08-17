import './App.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { React, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { ReactComponent as Oval } from './oval.svg';
import 'chartjs-adapter-moment';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
);

function App() {
  const [tempData, setTempData] = useState(null);
  const [humidityData, setHumidityData] = useState(null);
  const [vocData, setVocData] = useState(null);
  const [pressureData, setPressureData] = useState(null);

  const getSensorData = async () => {
    const { data } = await axios.get('http://www.quillsecure.com/api/dashboard/stats');
    const filteredData = data.reduce((prev, curr, i) => (i % 30 === 0 ? [...prev, curr] : prev), []);
    const td = filteredData.map((d) => ({ x: d.unixTS * 1000, y: d.temperatureF }));
    const hd = filteredData.map((d) => ({ x: d.unixTS * 1000, y: d.humidity }));
    const pd = filteredData.map((d) => ({ x: d.unixTS * 1000, y: d.pressure }));
    const vd = filteredData.map((d) => ({ x: d.unixTS * 1000, y: d.vocIndex }));

    setTempData(td);
    setHumidityData(hd);
    setVocData(vd);
    setPressureData(pd);
  };

  useEffect(() => {
    getSensorData();
  }, []);

  const chartData = {
    datasets: [{
      label: 'Temperature (F)',
      data: tempData,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
    {
      label: 'Humidity',
      data: humidityData,
      borderColor: 'rgb(250, 88, 54)',
      tension: 0.1,
      yAxisID: 'y1',
    },
    {
      label: 'VOC Index',
      data: vocData,
      borderColor: 'rgb(54, 250, 64)',
      tension: 0.1,
      yAxisID: 'y2',
    },
    {
      label: 'Pressure (mbar)',
      data: pressureData,
      borderColor: 'rgb(204, 54, 250)',
      tension: 0.1,
      yAxisID: 'y3',
    }],
  };

  const chartOptions = {
    animation: {
      duration: 0,
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: 'rgb(75, 192, 192)',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',

        // grid line settings
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
        ticks: {
          color: 'rgb(250, 88, 54)',
        },
      },
      y2: {
        type: 'linear',
        display: true,
        position: 'right',

        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgb(54, 250, 64)',
        },
      },
      y3: {
        type: 'linear',
        display: true,
        position: 'left',

        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgb(204, 54, 250)',
        },
      },
    },
  };

  const loadingSpinner = () => (
    <Oval className="m-2 w-40 h-40" stroke="#3b82f6" />
  );

  return (
    <div className="App bg-slate-200" style={{ height: '100vh' }}>
      <div className="flex bg-slate-300 mb-6">
        <div className="text-6xl font-bold justify-start pl-4 m-4">
          QuillSecure Dashboard
        </div>
      </div>

      <div className="container mx-auto flex justify-center items-center">
        {tempData ? (
          <Line
            options={chartOptions}
            data={chartData}
          />
        ) : loadingSpinner()}
      </div>
    </div>
  );
}

export default App;
