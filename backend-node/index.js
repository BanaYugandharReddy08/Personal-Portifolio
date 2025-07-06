const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

app.get('/login', (req, res) => {
  res.json({ message: 'login placeholder' });
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
