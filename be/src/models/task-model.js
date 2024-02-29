const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: {
            values: ['Not Started' , 'In progress', 'Finished' , 'Delay'],
            message: '{VALUE} is not supported'
        },
        required: true
    },
    startDate: Date,
    endDate: Date,
    projectId:  mongoose.ObjectId,
    employeeId: mongoose.ObjectId,
});

module.exports = mongoose.model('Task', taskSchema);

