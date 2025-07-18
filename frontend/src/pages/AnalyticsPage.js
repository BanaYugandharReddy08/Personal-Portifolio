import { useEffect, useState } from 'react';
import { fetchAnalytics } from '../services/api';
import DashboardCard from '../components/analytics/DashboardCard';
import LineChart from '../components/analytics/LineChart';
import './AnalyticsPage.css';

const ranges = [
  { label: 'Today', value: 'today' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
  { label: 'All Time', value: 'all' },
  { label: 'Custom Dates', value: 'custom' }
];

const rangeToDays = { today: 1, week: 7, month: 30, year: 365 };

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [prevData, setPrevData] = useState(null);
  const [chartData, setChartData] = useState([]);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const generateChartData = (selectedRange) => {
    const rand = (i) => (i % 5) + 1;
    switch (selectedRange) {
      case 'today':
        return Array.from({ length: 12 }, (_, i) => ({
          label: `${i * 2}h`,
          value: rand(i)
        }));
      case 'week':
        return weekdays.map((d, i) => ({ label: d, value: rand(i) }));
      case 'month':
        return Array.from({ length: 4 }, (_, i) => ({
          label: `W${i + 1}`,
          value: rand(i)
        }));
      case 'year':
        return months.map((m, i) => ({ label: m, value: rand(i) }));
      default:
        return months.map((m, i) => ({ label: m, value: rand(i) }));
    }
  };

  const loadData = async (params) => {
    try {
      const result = await fetchAnalytics(params);
      setPrevData(data);
      setData(result);
      setChartData(generateChartData(range));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let params = {};
    if (range !== 'custom' && range !== 'all') {
      const days = rangeToDays[range];
      if (days) {
        const end = new Date();
        const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
        params = { start: start.toISOString(), end: end.toISOString() };
      }
    } else if (range === 'custom') {
      if (startDate) params.start = new Date(startDate).toISOString();
      if (endDate) params.end = new Date(endDate).toISOString();
    }
    loadData(params);
  }, [range, startDate, endDate]);

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>
      {data && (
        <div className="metrics-row">
          <DashboardCard label="Guest Logins" value={data.GUEST_LOGIN} change={prevData ? data.GUEST_LOGIN - prevData.GUEST_LOGIN : 0} />
          <DashboardCard label="Signups" value={data.USER_SIGNUP} change={prevData ? data.USER_SIGNUP - prevData.USER_SIGNUP : 0} />
          <DashboardCard label="CV Downloads" value={data.CV_DOWNLOAD} change={prevData ? data.CV_DOWNLOAD - prevData.CV_DOWNLOAD : 0} />
          <DashboardCard label="Cover Downloads" value={data.COVERLETTER_DOWNLOAD} change={prevData ? data.COVERLETTER_DOWNLOAD - prevData.COVERLETTER_DOWNLOAD : 0} />
          {/* Additional cards with fixed values */}
          <DashboardCard label="Total Views" value={12} change={0} />
          <DashboardCard label="Returning Users" value={2} change={0} />
        </div>
      )}
      <div className="filter-row">
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
      <div className="chart-wrapper">
        <LineChart data={chartData} />
      </div>
    </div>
  );
};

export default AnalyticsPage;
