const EmployeeModel = require('../models/employee-model');
const {transformToSendFormat} = require('../utils');

const getEmployees = async (req, res) => {
    let count = 0;

    let employees = req?.params?.id
        ? EmployeeModel.findById(req.params.id)
        : req.query && !!Object.keys(req.query).length
            ? EmployeeModel.estimatedDocumentCount()
                .then(data => {
                    count = data;
                    if (!count) {
                        return [];
                    }
                    let {sort, sortDirection, limit, page} = req.query;
                    const skip = limit * page;
                    sortDirection = !sortDirection ? 1 : +sortDirection;
                    return EmployeeModel.find().sort(sort ? {[sort]: sortDirection} : null).skip(skip).limit(limit);
                })
            : EmployeeModel.find();


    employees
        .then(data => {
            if (Array.isArray(data)) {
                return data.map(el => (transformToSendFormat(el)));
            } else {
                return transformToSendFormat(data);
            }
        }).then(
        data => {
            const result = req.query && !!Object.keys(req.query).length
                ? {
                    employees: data,
                    total: count
                }
                : data;
            res.send(result);
        }
    )
        .catch(error => {
            console.log(error);
            console.log(`find employee(s) is failed, obj=${req.params.id}`);
            res.status(500).send({message: 'Find employee(s) is failed.'});
        });
}


const createEmployee = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({message: 'No body found.'});
    }
    const {name, lastName, patronymic, title} = req.body;
    if (!name || !lastName || !patronymic || !title) {
        return res.status(404)
            .send({message: 'Failed validation: empty required field(s). Check name, lastName, patronymic, title '});
    }

    EmployeeModel.create({name, lastName, patronymic, title})
        .then(employee => (res.send(transformToSendFormat(employee))))
        .catch(error => {
            console.log(`create employee is failed, obj=${req.body ? JSON.stringify(req.body) : req.body}`);
            res.status(500).send({message: 'create employee is failed'});
        });
}

const updateEmployee = async (req, res) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).send({message: 'No id found.'});
    }
    const {name, lastName, patronymic, title} = req?.body;
    if (!name || !lastName || !patronymic || !title) {
        return res.status(404).send(
            {message: 'Failed validation: empty required field(s). Check name, lastName, patronymic, title '}
        );
    }

    EmployeeModel.findByIdAndUpdate(id, {name, lastName, patronymic, title})
        .then(employee => (res.send('ok')))
        .catch(error => {
            console.log(`update employee is failed, id=${id}, obj=${req.body ? JSON.stringify(req.body) : req.body}`, error);
            res.status(500).send({message: 'update employee is failed'});
        });
}

const deleteEmployee = async (req, res) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).send({message: 'no id found'});
    }

    EmployeeModel.findByIdAndDelete(id)
        .then(
            d => {
                if (!d) {
                    return res.status(404).send({message: 'no employee found'});
                }
                res.status(200).send(d);
            }
        )
        .catch(error => {
            console.log(`findByIdAndDelete employee is failed, id=${id}`);
            res.status(500).send({message: 'findByIdAndDelete employee is failed!'});
        });

}

module.exports = {
    getEmployees,
    createEmployee,
    deleteEmployee,
    updateEmployee
};
