const express = require('express');

const controller = require('../controllers/project-controller');

const router = express.Router();
router.get('/projects', controller.getProjects);
router.get('/projects/:id', controller.getProjects);
router.post('/projects', controller.createProject);
router.put('/projects/:id', controller.updateProject);
router.delete('/projects/:id', controller.deleteProject);

module.exports = router;
