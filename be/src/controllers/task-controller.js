const mongoose = require('mongoose');
var customParseFormat = require('dayjs/plugin/customParseFormat');
const dayjs = require('dayjs');

const TaskModel = require('../models/task-model');
const {transformToSendFormat} = require('../utils');


dayjs.extend(customParseFormat);
const getDate = (d) => {
    return dayjs(d, 'DD.MM.YY').toDate();
};

const getTasks = async (req, res) => {
    const aggregateConditions = [];
    try {
        if (req.params.id) {
            const id1 = new mongoose.Types.ObjectId(req.params.id);
            aggregateConditions.push({'$match': {'_id': {'$in': [id1]}}});
        }
    } catch (e) {
        return res.status(400).send({message: 'invalid id'})
    }

    aggregateConditions.push(
        {
            $lookup:
                {from: 'projects', localField: 'projectId', foreignField: '_id', as: 'proj'}
        },
        {$unwind: '$proj'},
        {
            $lookup:
                {from: 'employees', localField: 'employeeId', foreignField: '_id', as: 'empl'}
        },
        {$unwind: '$empl'},
        {
            $project: {
                '_id': 1,
                'title': 1,
                'description': 1,
                'status': 1,
                'startDate': 1,
                'endDate': 1,
                'employeeId': 1,
                'projectId': 1,
                'projectName': '$proj.name',
                'employee': '$empl'
            }
        }
    );
    TaskModel.aggregate(aggregateConditions)
        .then(tasks => {
            const data = tasks.map(proj => (transformToSendFormat(proj)));
            return res.send(req.params.id ? data[0] : data)
        })
        .catch((e) => {
            console.log(e);
            console.log(`find task(s) is failed`);
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
