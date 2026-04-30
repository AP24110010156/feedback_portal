// M - Model (Handles data logic)
// In a real app, this would interact with a database (like MongoDB or SQL)
const tasks = [
    { id: 1, title: 'Learn MVC Architecture', completed: false },
    { id: 2, title: 'Build an Express App', completed: true }
];

const TaskModel = {
    getAllTasks: () => {
        return tasks;
    },
    
    getTaskById: (id) => {
        return tasks.find(task => task.id === id);
    },

    addTask: (title) => {
        const newTask = {
            id: tasks.length + 1,
            title: title,
            completed: false
        };
        tasks.push(newTask);
        return newTask;
    }
};

module.exports = TaskModel;
