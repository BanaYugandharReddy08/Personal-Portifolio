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

  const markers = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return <circle key={i} cx={x} cy={y} r="1.5" className="chart-marker" />;
  });

  const gridLines = Array.from({ length: 5 }).map((_, i) => {
    const y = (i / 4) * 100;
    return (
      <line
        key={i}
        x1="0"
        y1={y}
        x2="100"
        y2={y}
        className="chart-grid-line"
      />
    );
  });

  return (
    <svg
      className="line-chart"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {gridLines}
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {markers}
    </svg>
  );
};

export default LineChart;
