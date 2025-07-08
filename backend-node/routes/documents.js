const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const JAVA_BASE_URL = process.env.JAVA_BASE_URL || 'http://localhost:8080';

// Get list of documents
router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/documents`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

// Upload a document by type
router.post('/:type', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/documents/${req.params.type}`, {
      method: 'POST',
      headers: { 'content-type': req.headers['content-type'] },
      body: req,
    });
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    response.body.pipe(res);
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

// Retrieve a document by type
router.get('/:type', async (req, res) => {
  try {
    const response = await fetch(`${JAVA_BASE_URL}/api/documents/${req.params.type}`);
    res.status(response.status);
    response.headers.forEach((v, k) => res.setHeader(k, v));
    if (response.status === 200) {
      response.body.pipe(res);
    } else {
      const data = await response.json();
      res.json(data);
    }
  } catch (err) {
    console.error('Error contacting Java backend:', err);
    res.status(500).json({ error: 'Java backend unreachable' });
  }
});

module.exports = router;
