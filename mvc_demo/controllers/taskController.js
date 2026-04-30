// C - Controller (Handles logic, connects Model and View)
const TaskModel = require('../models/TaskModel');

const taskController = {
    // Controller method to get all tasks and send them to the View
    getTasks: (req, res) => {
        // 1. Get data from the Model
        const tasks = TaskModel.getAllTasks();
        
        // 2. Pass data to the View (Render the EJS template)
        res.render('tasks', { tasks: tasks });
    },

    // Controller method to add a new task
    createTask: (req, res) => {
        // 1. Extract data from the request body
        const { title } = req.body;
        
        // 2. Update the Model
        if (title) {
            TaskModel.addTask(title);
        }
        
        // 3. Redirect back to the tasks View
        res.redirect('/tasks');
    }
};

module.exports = taskController;
