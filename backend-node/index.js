const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());

const JAVA_BASE_URL = process.env.JAVA_BASE_URL || 'http://localhost:8080';
const PORT = process.env.PORT || 3001;


app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body || {};
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Full name, email and password required' });
  }
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.get('/certificates', (req, res) => {
  res.json({ certificates: [] });
});

app.get('/leetcode', (req, res) => {
  res.json({ problems: [] });
});

app.listen(PORT, () => {
  console.log(`Node backend listening on port ${PORT}`);
});
