const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const {checkAuth} = require('./src/controllers/auth-controller');
const employeeRouter = require('./src/routes/employee-router');
const projectRouter = require('./src/routes/project-router');
const taskRouter = require('./src/routes/task-router');
const authRouter = require('./src/routes/auth');


dotenv.config();
const PORT = process.env.PORT || 5000;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_DB = process.env.MONGO_DB;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res) => {
    res.setHeader(
        'Content-type', 'application/json'
    );
    res.send = (data) => {
        res.end(JSON.stringify(data));
    };
    req.next();
});

app.use('/api/v1/login', authRouter);
app.use('/api/v1/*', checkAuth);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/employees', employeeRouter);



const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/${MONGO_DB}?retryWrites=true&w=majority`);
        app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
    } catch (e) {
        console.log(e);
        console.log('Connect to DB is failed.');
    }
}

start();