const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const employeeSchema = new Schema({
    name: String,
    lastName: String,
    patronymic: String,
    title: String,
});

module.exports = mongoose.model('Employee', employeeSchema);

