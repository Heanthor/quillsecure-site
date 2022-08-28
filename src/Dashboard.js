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

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [tempData, setTempData] = useState(null);
  const [humidityData, setHumidityData] = useState(null);
  const [vocData, setVocData] = useState(null);
  const [activeSensors, setActiveSensors] = useState(0);

  const getSensorData = async () => {
    const { data } = await axios.get('https://quillsecure.com/api/dashboard/stats?days=1');
    const td = data.map((d) => ({ x: d.unixTS * 1000, y: d.temperatureF }));
    const hd = data.map((d) => ({ x: d.unixTS * 1000, y: d.humidity }));

    const vd = data.map((d) => ({ x: d.unixTS * 1000, y: d.vocIndex }));

    setTempData(td);
    setHumidityData(hd);
    setVocData(vd);
  };

  const getActiveSensors = async () => {
    try {
      const { data } = await axios.get('https://quillsecure.com/api/dashboard/sensorsConnected');

      setActiveSensors(data.activeSensors);
    } catch (e) {
      setActiveSensors(0);
    }
  };

  useEffect(() => {
    getSensorData();
    getActiveSensors();
    setLoading(false);
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
        min: 60,
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
        min: 0,
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
      <div className="h-24 flex bg-slate-300 mb-6 p-4">
        <span className="text-6xl font-bold flex flex-grow">
          QuillSecure Dashboard
        </span>
        <div className="flex">
          <div className="text-lg font-bold self-end">
            {loading ? null : (
              <div>
                Sensors connected:
                {' '}
                <span className={activeSensors > 0 ? 'text-sky-500' : 'text-red-500'}>
                  {activeSensors}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="container mx-auto flex justify-center items-center">
        {loading ? loadingSpinner() : (
          <Line
            options={chartOptions}
            data={chartData}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
