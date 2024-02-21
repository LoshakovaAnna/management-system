const express = require('express');

const controller = require('../controllers/employee-controller');

const router = express.Router();

router.get('/employees', controller.getEmployees);
router.get('/employees/:id', controller.getEmployees);
router.post('/employees', controller.createEmployee);
router.put('/employees/:id', controller.updateEmployee);
router.delete('/employees/:id', controller.deleteEmployee);

module.exports = router;
