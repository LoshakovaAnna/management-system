const mongoose = require('mongoose');
const {Schema} = require('mongoose');

const projectSchema = new Schema({
    name: String,
    description: String,
});

module.exports = mongoose.model('Project', projectSchema);

