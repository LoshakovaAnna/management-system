const mongoose = require('mongoose');
var customParseFormat = require('dayjs/plugin/customParseFormat');
const dayjs = require('dayjs');

const TaskModel = require('../models/task-model');
const {transformToSendFormat} = require('../utils');


dayjs.extend(customParseFormat);
const getDate = (d) => {
    const dd = dayjs(d, 'DD.MM.YYYY');
    return dd.toISOString();
};

/*
* filterObject:{[key:string]: any}
* =>[]{}
* */
const getFilterAggregateConditions = (filterObject) => {
    if (!filterObject) {
        return [];
    }
    const aggregateConditions = [];
    for (const filterObjectKey in filterObject) {
        if (filterObjectKey.toLowerCase().endsWith('id')) {
            try {
                const fieldName = filterObjectKey === 'id' ? '_id' : filterObjectKey;
                const idObj = new mongoose.Types.ObjectId(filterObject[filterObjectKey]);
                aggregateConditions.push({$match: {[fieldName]: idObj}});
            } catch (e) {
                console.log('can\'t convert id');
                return new Error('getTotalByFilter: can\'t convert id');
            }
        } else {
            aggregateConditions.push({$match: {[filterObjectKey]: filterObject[filterObjectKey]}}); // value = null?
        }
    }
    return aggregateConditions;
}

/*
* Function return Promise<array of objects> - conditions for aggregate function of mogoose.Model
* @param filter: {id?: number,
* projectId?:number}
* @param params: {sort?: string
* sortDirection?: 1 -1 0
* limit? number
* page?: number}
*
* @return  Promise<array of objects>
* */
const getAggregateConditions = async (filter, params) => {
    return new Promise((resolve, reject) => {
        const {sort, sortDirection, limit, page} = params;
        const aggregateConditions = [];
        try {
            aggregateConditions.push(...getFilterAggregateConditions(filter));
        } catch (e) {
            return reject('error of id')
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
                    // 'employee': '$empl',
                    'employeeFullName': {
                        $concat: [
                            '$empl.lastName',
                            ' ',
                            '$empl.name',
                            ' ',
                            '$empl.patronymic',
                        ]
                    }
                }

            },
        );
        if (sort && sortDirection) {
            aggregateConditions.push({$sort: {[sort]: +sortDirection}})
        }
        if (limit) {
            aggregateConditions.push({$skip: (limit * page) || 0});
            aggregateConditions.push({$limit: +limit});
        }
        resolve(aggregateConditions);

    });

}

/*
* function calculate number of records in db
* @return [{total: number}]
* */
const getTotalByFilter = async (filterObject) => {
    if (!filterObject) {
        return TaskModel.estimatedDocumentCount();
    }
    const aggregateConditions = [];
    try {
        aggregateConditions.push(...getFilterAggregateConditions(filterObject));
    } catch (e) {
        return Promise.reject('getTotalByFilter: can\'t convert id')
    }
    aggregateConditions.push({$count: 'total'});
    return TaskModel.aggregate(aggregateConditions);
}

const getTasks = async (req, res) => {
    let total = 0;
    const pr = req?.params?.id
        ? Promise.resolve([{total: 1}])
        : getTotalByFilter({...req.params});

    pr.then(v => {
        total = v;
        if (!total) {
            return null;
        }
        if (!!total && !total.length) {
            res.status(200).send({tasks: [], total: 0})
            return null;
        }
        return getAggregateConditions({...req.params}, {...req.query});

    })

        .catch((e) => {
            console.log(e);
            return res.status(400).send({message: 'invalid id'});
        })
        .then(
            (aggregateConditions) => {
                if (!aggregateConditions) {
                    throw new Error('wrong condition');
                }
                return TaskModel.aggregate(aggregateConditions);

            }
        )
        .then((tasks) => {
            const data = tasks.map(proj => (transformToSendFormat(proj)));
            const result = req.params.id
                ? data[0]
                : req.query && !!Object.keys(req.query).length
                    ? {tasks: data, total: total?.[0]?.total || 0}
                    : data;
            return res.send(result)
        })
        .catch((e) => {
            console.log(`find task(s) is failed`, e);
            if (!res.finished) {
                res.status(500).send({message: 'Find task(s) is failed.'});
            }
        });
}


const addTask = async (req, res) => {
    const id = req?.params?.id;
    if (!req.body) {
        return res.status(400).send({message: 'No body found.'});
    }
    const {title, description, status, projectId, employeeId} = req.body;
    const startDate = req.body.startDate ? getDate(req.body.startDate) : new Date();
    const endDate = req.body.endDate ? getDate(req.body.endDate) : new Date();

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
    addTask,
    deleteTask,
};
