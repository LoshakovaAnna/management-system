const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');

const EmployeeModel = require('../models/employee-model');
const ProjectModel = require('../models/project-model');
const TaskModel = require('../models/task-model');
const MOCK_EMPLOYEE = require('./employees');
const MOCK_PROJECTS = require('./projects');
const MOCK_TASKS = require('./tasks');


const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
let server;
const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`);
        server = app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (e) {
        console.log(e);
        console.log('Connect to DB is failed.');
    }
}

/*
* employees: Array<{
	patronymic: string;
	name: string;
	lastName: string;
	title: string;
}>
* */
const createEmployee = async (employees) => {
    if (!employees || !employees.length) {
        return;
    }

    return EmployeeModel.insertMany(employees)
        .then((d) => {
                console.log(`EMPLOYEES table is filled with ${d.length} entries`)
            }
        )
        .catch(error => {
            console.log(`create employee is failed`);
            console.error(error)
        });
}
const createProjects = async (projects) => {
    if (!projects || !projects.length) {
        return;
    }

    return ProjectModel.insertMany(projects)
        .then((d) => {
                console.log(`PROJECTS table is filled with ${d.length} entries`)
            }
        )
        .catch(error => {
            console.log(`create projects is failed`);
            console.error(error)
        });
}


const randomIntFromInterval = (min, max) => { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const createTasks = async (tasks) => {
    if (!tasks || !tasks.length) {
        return;
    }

    let taskStatus = ['Not Started', 'In progress', 'Finished', 'Delay'];
    let projectsId = [];
    let emplId = [];
    return ProjectModel.find()
        .then((projects) => (projectsId = projects.map(el => (el._id))))
        .then(() => (EmployeeModel.find()))
        .then(employees => (emplId = employees.map(el => (el._id))))
        .then(() => {
            return TaskModel.insertMany(tasks.map(el => ({
                ...el,
                status: taskStatus[randomIntFromInterval(0, 3)],
                projectId: projectsId[randomIntFromInterval(0, projectsId.length - 1)],
                employeeId: emplId[randomIntFromInterval(0, emplId.length - 1)]
            })))
        })
        .then((d) => {
                console.log(`TASKS table is filled with ${d.length} entries`)
            }
        )
        .catch(error => {
            console.log(`create tasks is failed`);
            console.error(error)
        });
}

start()
    .then(() => (createEmployee(MOCK_EMPLOYEE)))
    .then(() => (createProjects(MOCK_PROJECTS)))
    .then(() => (createTasks(MOCK_TASKS)))
    .catch((e) => {
        console.log(e)
    })
    .finally(
        () => {
            mongoose.connection.close();
            console.log('END')
            server?.close(function () {
                console.log('Script executed!:)');
            });

        }
    )