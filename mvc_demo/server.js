const express = require('express');
const path = require('path');
const app = express();
const taskRoutes = require('./routes/taskRoutes');

// Set up the View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Redirect root to /tasks
app.get('/', (req, res) => {
    res.redirect('/tasks');
});

// Use routes
app.use('/tasks', taskRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`MVC App running on http://localhost:${PORT}`);
});
