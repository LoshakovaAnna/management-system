const express = require('express');

const controller = require('../controllers/project-controller');

const router = express.Router();
router.get('', controller.getProjects);
router.get('/:id', controller.getProjects);
router.post('', controller.createProject);
router.put('/:id', controller.updateProject);
router.delete('/:id', controller.deleteProject);

module.exports = router;
