var customParseFormat = require('dayjs/plugin/customParseFormat');
const dayjs = require('dayjs');
const TaskModel = require('../models/task-model');
const {transformToSendFormat} = require('../utils');


dayjs.extend(customParseFormat);
const getDate = (d) => {
    return dayjs(d, 'DD.MM.YY').toDate();
};

const getTasks = async (req, res) => {
    let tasks = req.params.id
        ? TaskModel.findById(req.params.id)
            .then(task => (transformToSendFormat(task)))
        : TaskModel.find()
            .then(tasks => (tasks.map(proj => (transformToSendFormat(proj)))));
    tasks
        .then(data => (res.send(data)))
        .catch(() => {
            console.log(`Find task(s) is failed, obj=${req.params.id}`);
            res.status(500).send({message: 'Find task(s) is failed.'});
        });
}

const sendTask = async (req, res) => {
    const id = req?.params?.id;
    if (!req.body) {
        return res.status(400).send({message: 'No body found.'});
    }
    const {title, description, status, projectId, employeeId} = req.body;
    const startDate = req.body.startDate ? getDate(req.body.startDate) : new Date();
    const endDate = req.body.endDate ? getDate(req.body.startDate) : new Date();

    if (!title || !description || !status || !projectId || !employeeId) {
        return res.status(404)
            .send({message: 'Failed validation: empty required field(s). Check title, description, status, projectId, employeeId'});
    }

    const dd = !!id
        ? TaskModel.findByIdAndUpdate(id, {title, description, status, startDate, endDate, projectId, employeeId})
        : TaskModel.create({title, description, status, startDate, endDate, projectId, employeeId});

    dd.then(task => (res.send(transformToSendFormat(task))))
        .catch((e) => {
            console.log(`${id ? 'Update' : 'Create'} task is failed, obj=${req.body ? JSON.stringify(req.body) : req.body}`);
            console.log(e)
            res.status(500).send({message: `${id ? 'Update' : 'Create'} task is failed`});
        });
}


const deleteTask = async (req, res) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).send({message: 'no id found'});
    }

    TaskModel.findByIdAndDelete(id)
        .then(
            d => {
                if (!d) {
                    return res.status(404).send({message: 'no task found'});
                }
                res.status(200).send('ok');
            }
        )
        .catch(() => {
            console.log(`findByIdAndDelete task is failed, id=${id}`);
            res.status(500).send({message: 'findByIdAndDelete task is failed!'});
        });

}

module.exports = {
    getTasks,
    sendTask,
    deleteTask,
};
