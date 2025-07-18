import React from 'react';
import './LineChart.css';

const LineChart = ({ data = [] }) => {
  if (!data.length) return null;
  const max = Math.max(...data);
  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (val / max) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="line-chart" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export default LineChart;
