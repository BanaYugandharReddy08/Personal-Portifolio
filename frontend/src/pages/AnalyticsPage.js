import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/api';
import './AnalyticsPage.css';

const ranges = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: '3 Months', value: '3m' },
  { label: '6 Months', value: '6m' },
  { label: 'Year', value: 'year' },
  { label: 'Custom', value: 'custom' }
];

const rangeToDays = { day: 1, week: 7, month: 30, '3m': 90, '6m': 180, year: 365 };

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState('week');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const loadData = async (params) => {
    try {
      const result = await fetchAnalytics(params);
      setData(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let params = {};
    if (range !== 'custom') {
      const days = rangeToDays[range];
      if (days) {
        const end = new Date();
        const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
        params = { start: start.toISOString(), end: end.toISOString() };
      }
    } else if (startDate || endDate) {
      if (startDate) params.start = new Date(startDate).toISOString();
      if (endDate) params.end = new Date(endDate).toISOString();
    }
    loadData(params);
  }, [range, startDate, endDate]);

  return (
    <div className="analytics-page">
      <div className="analytics-metrics">
        <h1>Analytics</h1>
        {data && (
          <div className="metrics-grid">
            <div className="metric-card">
              <h2>Guest Logins</h2>
              <p>{data.GUEST_LOGIN}</p>
            </div>
            <div className="metric-card">
              <h2>Signups</h2>
              <p>{data.USER_SIGNUP}</p>
            </div>
            <div className="metric-card">
              <h2>CV Downloads</h2>
              <p>{data.CV_DOWNLOAD}</p>
            </div>
            <div className="metric-card">
              <h2>Cover Downloads</h2>
              <p>{data.COVERLETTER_DOWNLOAD}</p>
            </div>
          </div>
        )}
      </div>
      <div className="analytics-filters">
        <label htmlFor="range">Time Range</label>
        <select id="range" value={range} onChange={(e) => setRange(e.target.value)}>
          {ranges.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {range === 'custom' && (
          <div className="custom-dates">
            <label htmlFor="start">Start Date</label>
            <input
              id="start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="end">End Date</label>
            <input
              id="end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
