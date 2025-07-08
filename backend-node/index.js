const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

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

app.get('/certificates', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/certificates`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.post('/certificates', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/certificates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.put('/certificates/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/certificates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.delete('/certificates/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/certificates/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      res.sendStatus(204);
    } else {
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.get('/experiences', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/experiences`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.post('/experiences', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/experiences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.put('/experiences/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/experiences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.delete('/experiences/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/experiences/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      res.sendStatus(204);
    } else {
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.get('/projects', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/projects`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.post('/projects', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.put('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.delete('/projects/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/projects/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      res.sendStatus(204);
    } else {
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.get('/leetcode', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/leetcode`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.post('/leetcode', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/leetcode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.put('/leetcode/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/leetcode/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.delete('/leetcode/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/leetcode/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      res.sendStatus(204);
    } else {
      const data = await response.json();
      res.status(response.status).json(data);
    }
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

app.listen(PORT, () => {
  console.log(`Node backend listening on port ${PORT}`);
});
