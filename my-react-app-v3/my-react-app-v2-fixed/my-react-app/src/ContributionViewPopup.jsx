import React from 'react';
import { Line } from 'react-chartjs-2';
import './ContributionViewPopup.css';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function ContributionViewPopup({ task, onClose }) {
  if (!task) {
    return null; // Do not render if task is undefined
  }

  // Prepare data for contributions list
  const contributions = task.contributions || [];

  // Calculate total accumulated time
  const totalDuration = contributions.reduce(
    (total, contrib) => total + contrib.duration,
    0
  );

  // Sort contributions from newest to oldest for display
  const sortedContributions = [...contributions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Prepare data for the graph (should be sorted from oldest to newest)
  const contributionsForGraph = [...contributions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let accumulatedTime = 0;
  const dataPoints = contributionsForGraph.map((contribution) => {
    accumulatedTime += contribution.duration;
    return {
      x: contribution.date,
      y: accumulatedTime,
    };
  });

  // Prepare chart data
  const chartData = {
    datasets: [
      {
        label: 'Accumulated Time (minutes)',
        data: dataPoints,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          tooltipFormat: 'yyyy-MM-dd',
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Accumulated Time (minutes)',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="contribution-view-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Contributions for: {task.name}</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>
        <hr />
        <div className="modal-body">
          <p className="total-duration">
            Total Accumulated Time: <span className="duration-tag">{totalDuration} minutes</span>
          </p>
          <hr className="section-divider" />
          <div className="contribution-list">
            <h3>Contribution Logs</h3>
            <ul>
              {sortedContributions.length > 0 ? (
                sortedContributions.map((contribution, index) => (
                  <li key={index}>
                    <p><strong>Date:</strong> {contribution.date}</p>
                    <p><strong>Duration:</strong> {contribution.duration} minutes</p>
                  </li>
                ))
              ) : (
                <p>No contributions available for this task.</p>
              )}
            </ul>
          </div>
          <hr className="section-divider" />
          {dataPoints.length > 0 && (
            <div className="contribution-chart">
              <h3>Accumulated Time Graph</h3>
              <div className="chart-container">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContributionViewPopup;
