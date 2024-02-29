const express = require('express');

const controller = require('../controllers/employee-controller');

const router = express.Router();

router.get('', controller.getEmployees);
router.get('/:id', controller.getEmployees);
router.post('', controller.createEmployee);
router.put('/:id', controller.updateEmployee);
router.delete('/:id', controller.deleteEmployee);

module.exports = router;
