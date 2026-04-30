const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Map routes to controller functions
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);

module.exports = router;
