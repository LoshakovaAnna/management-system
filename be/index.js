const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const employeeRouter = require('./src/routes/employee-router');
const projectRouter = require('./src/routes/project-router');
const taskRouter = require('./src/routes/task-router');


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
app.use('/api/v1', employeeRouter);
app.use('/api/v1', projectRouter);
app.use('/api/v1', taskRouter);
const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://userAn:****@cluster0.i84rot5.mongodb.net/myDB?retryWrites=true&w=majority');
        app.listen(5000, () => console.log(`Server started on PORT ${5000}`));
    } catch (e) {
        console.log(e);
        console.log('Connect to DB is failed.');
    }
}

start();