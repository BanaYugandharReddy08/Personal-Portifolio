import React from 'react';
import { FiArrowUp, FiArrowDown, FiMinus } from 'react-icons/fi';
import './DashboardCard.css';

const DashboardCard = ({ label, value, change = 0 }) => {
  let Icon = FiMinus;
  if (change > 0) Icon = FiArrowUp;
  else if (change < 0) Icon = FiArrowDown;

  return (
    <div className="dashboard-card">
      <span className="metric-label">{label}</span>
      <div className="metric-value">
        {value}
        <Icon className="trend-icon" aria-label="trend" />
      </div>
    </div>
  );
};

export default DashboardCard;
