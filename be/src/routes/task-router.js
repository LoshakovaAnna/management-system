const express = require('express');

const controller = require('../controllers/task-controller');

const router = express.Router();
router.get('/tasks', controller.getTasks);
router.get('/tasks/:id', controller.getTasks);
router.get('/tasks/project/:projectId', controller.getTasks);
router.post('/tasks', controller.addTask);
router.put('/tasks/:id', controller.addTask);
router.delete('/tasks/:id', controller.deleteTask);

module.exports = router;
