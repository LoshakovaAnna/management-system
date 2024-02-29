const express = require('express');

const controller = require('../controllers/task-controller');

const router = express.Router();
router.get('', controller.getTasks);
router.get('/:id', controller.getTasks);
router.get('/project/:projectId', controller.getTasks);
router.post('', controller.addTask);
router.put('/:id', controller.addTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;
