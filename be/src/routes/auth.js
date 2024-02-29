const express = require('express');
const authRouter = express.Router();

const {login} = require('../controllers/auth-controller');

authRouter.post('', login);
module.exports = authRouter;
