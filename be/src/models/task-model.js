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
    projectId: String, //mongoose.Types.ObjectId,
    // projectName?: string;
    employeeId: String//mongoose.ObjectIds,
    // employeeFullName?: string;
});

module.exports = mongoose.model('Task', taskSchema);

