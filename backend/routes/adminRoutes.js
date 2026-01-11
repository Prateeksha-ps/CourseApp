const express = require('express');
const {
  loginAdmin,
  createCourse,
  getAdminCourses,
  getCourseRegistrations,
} = require('../controllers/adminController');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/courses', createCourse);
router.get('/courses', getAdminCourses);
router.get('/course/:courseId/registrations', getCourseRegistrations);

module.exports = router;
