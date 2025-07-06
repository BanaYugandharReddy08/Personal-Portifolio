import React from 'react';
import './ProgressCircle.css';

const ProgressCircle = ({ label, value, total, color }) => {
  const radius = 36;
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = 2 * Math.PI * normalizedRadius;
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-item">
      <svg
        className="progress-svg"
        height={radius * 2}
        width={radius * 2}
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
      >
        <circle
          stroke="var(--muted)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="progress-bar"
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          aria-label={`${label} progress`}
        />
      </svg>
      <div className="progress-text">{value}</div>
      <span className="progress-label">{label}</span>
    </div>
  );
};

export default ProgressCircle;
