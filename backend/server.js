const express = require('express');
const cors = require('cors');
const dataService = require('./dataService');

const todoRoutes = require('./routes/todos');
const settingsRoutes = require('./routes/settings');

// IIFE to handle async setup
(async () => {
  // Run migrations before starting the server
  await dataService.migrateData();

  const app = express();
  const PORT = 3001;

  app.use(cors());
  app.use(express.json());

  app.use('/api/todos', todoRoutes);
  app.use('/api/settings', settingsRoutes);

  app.get('/', (req, res) => {
    res.send('Hello from the backend!');
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();