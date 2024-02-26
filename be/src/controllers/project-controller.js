const ProjectModel = require('../models/project-model');
const {transformToSendFormat} = require('../utils');


const getProjects = async (req, res) => {
    let count = 0;

    let projects = req.params.id
        ? ProjectModel.findById(req.params.id)
        : req.query && !!Object.keys(req.query).length
            ? ProjectModel.estimatedDocumentCount()
                .then(
                    data => {
                        count = data;
                        if (!count) {
                            return []
                        }
                        let {sort, sortDirection, limit, page} = req.query ? req.query : {limit: 5, page: 0};
                        const skip = limit * page;
                        sortDirection = !sortDirection ? 1 : +sortDirection;
                        return ProjectModel.find().sort(sort ? {[sort]: sortDirection} : null).skip(skip).limit(limit);
                    }
                )
            : ProjectModel.find();
    projects
        .then(data => {
            if (Array.isArray(data)) {
                return data.map(el => (transformToSendFormat(el)))
            } else {
                return transformToSendFormat(data)
            }
        })
        .then(data => {
            const result = req.query && !!Object.keys(req.query).length
                ? {
                    projects: data,
                    total: count
                }
                : data;
            res.send(result);
        })
        .catch(() => {
            console.log(`Find project(s) is failed, obj=${req.params.id}`);
            res.status(500).send({message: 'Find project(s) is failed.'});
        });
}


const createProject = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({message: 'No body found.'});
    }
    const {name, description} = req.body;
    if (!name || !description) {
        return res.status(404)
            .send({message: 'Failed validation: empty required field(s). Check name, description'});
    }

    ProjectModel.create({name, description})
        .then(project => (res.send(transformToSendFormat(project))))
        .catch(() => {
            console.log(`Create project is failed, obj=${req.body ? JSON.stringify(req.body) : req.body}`);
            res.status(500).send({message: 'create project is failed'});
        });
}

const updateProject = async (req, res) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).send({message: 'No id found.'});
    }
    const {name, description} = req?.body;
    if (!name || !description) {
        return res.status(404).send(
            {message: 'Failed validation: empty required field(s). Check name, description'}
        )
    }

    ProjectModel.findByIdAndUpdate(id, {name, description})
        .then(() => (res.send('ok')))
        .catch(error => {
            console.log(`update project is failed, id=${id}, obj=${req.body ? JSON.stringify(req.body) : req.body}`);
            res.status(500).send({message: 'update project is failed'});
        });
}

const deleteProject = async (req, res) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).send({message: 'no id found'});
    }

    ProjectModel.findByIdAndDelete(id)
        .then(
            d => {
                if (!d) {
                    return res.status(404).send({message: 'no project found'});
                }
                res.status(200).send(d);
            }
        )
        .catch(() => {
            console.log(`findByIdAndDelete project is failed, id=${id}`);
            res.status(500).send({message: 'findByIdAndDelete project is failed!'});
        });

}

module.exports = {
    getProjects,
    createProject,
    deleteProject,
    updateProject
};
