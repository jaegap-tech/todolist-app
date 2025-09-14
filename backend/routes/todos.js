const express = require('express');
const router = express.Router();
const dataService = require('../dataService');

router.get('/', async (req, res) => {
  try {
    const data = await dataService.readData();
    res.json(data.todos);
  } catch (error) {
    res.status(500).json({ message: 'Error reading data' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await dataService.readData();
    const newTodo = {
      id: Date.now(),
      text: req.body.text,
      status: 'todo',
      dueDate: req.body.dueDate || null,
      tags: req.body.tags || [],
      flagged: false,
    };
    data.todos.push(newTodo);
    await dataService.writeData(data);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error writing data' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await dataService.readData();
    const todoIndex = data.todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    const updatedTodo = { ...data.todos[todoIndex], ...req.body };
    data.todos[todoIndex] = updatedTodo;
    await dataService.writeData(data);
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error writing data' });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const data = await dataService.readData();
    const todoIndex = data.todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    data.todos[todoIndex].status = req.body.status;
    await dataService.writeData(data);
    res.json(data.todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error writing data' });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const data = await dataService.readData();
    const todoIndex = data.todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    data.todos[todoIndex].flagged = !data.todos[todoIndex].flagged;
    await dataService.writeData(data);
    res.json(data.todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Error writing data' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await dataService.readData();
    const todoIndex = data.todos.findIndex(t => t.id === parseInt(req.params.id));
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    data.todos.splice(todoIndex, 1);
    await dataService.writeData(data);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error writing data' });
  }
});

module.exports = router;
