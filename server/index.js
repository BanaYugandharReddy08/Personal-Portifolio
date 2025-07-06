const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// In-memory data stores
const certificates = [];
const experiences = [];
const projects = [];
const leetcode = [];

function findItem(arr, id) {
  return arr.findIndex(item => item.id === id);
}

// Generic CRUD handlers
function setupCrudRoutes(path, store) {
  app.get(path, (req, res) => {
    res.json(store);
  });

  app.post(path, (req, res) => {
    const item = { id: Date.now().toString(), ...req.body };
    store.push(item);
    res.status(201).json(item);
  });

  app.put(`${path}/:id`, (req, res) => {
    const idx = findItem(store, req.params.id);
    if (idx === -1) return res.sendStatus(404);
    store[idx] = { ...store[idx], ...req.body };
    res.json(store[idx]);
  });

  app.delete(`${path}/:id`, (req, res) => {
    const idx = findItem(store, req.params.id);
    if (idx === -1) return res.sendStatus(404);
    const [deleted] = store.splice(idx, 1);
    res.json(deleted);
  });
}

setupCrudRoutes('/certificates', certificates);
setupCrudRoutes('/experiences', experiences);
setupCrudRoutes('/projects', projects);
setupCrudRoutes('/leetcode', leetcode);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
