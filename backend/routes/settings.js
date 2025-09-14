const express = require('express');
const router = express.Router();
const dataService = require('../dataService');

router.get('/theme', async (req, res) => {
  try {
    const data = await dataService.readData();
    res.json(data.settings);
  } catch (error) {
    res.status(500).json({ message: 'Error reading data' });
  }
});

router.put('/theme', async (req, res) => {
  try {
    const data = await dataService.readData();
    data.settings.theme = req.body.theme;
    await dataService.writeData(data);
    res.json(data.settings);
  } catch (error) {
    res.status(500).json({ message: 'Error writing data' });
  }
});

module.exports = router;
