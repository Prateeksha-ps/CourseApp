const express = require('express');
const {
  registerCourse,
  getStudentRegistrations,
} = require('../controllers/registrationController');

const router = express.Router();

router.post('/register', registerCourse);
router.get('/student/registrations', getStudentRegistrations);

module.exports = router;
