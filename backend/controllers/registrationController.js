const Registration = require('../models/Registration');
const Student = require('../models/Student');
const Course = require('../models/Course');

exports.registerCourse = async (req, res, next) => {
  try {
    const { studentId, courseId, paymentStatus, agreementAccepted } = req.body || {};

    if (!studentId || !courseId || !paymentStatus) {
      return res.status(400).json({ message: 'Student, course and payment status are required.' });
    }

    if (paymentStatus !== 'Paid') {
      return res.status(400).json({ message: 'Payment must be marked as Paid to register.' });
    }

    if (!agreementAccepted) {
      return res.status(400).json({ message: 'You must accept the course completion agreement before registering.' });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const existingRegistration = await Registration.findOne({
      student: student._id,
      course: course._id,
    });

    if (existingRegistration) {
      return res.status(409).json({ message: 'You have already registered for this course.' });
    }

    const paidRegistrationsCount = await Registration.countDocuments({
      course: course._id,
      paymentStatus: 'Paid',
    });

    if (paidRegistrationsCount >= course.maxRegistrations) {
      return res.status(400).json({ message: 'Maximum registrations reached for this course.' });
    }

    const registration = await Registration.create({
      student: student._id,
      studentId: student.studentId,
      course: course._id,
      paymentStatus,
      agreementAccepted: true,
    });

    res.status(201).json({
      message: 'Course registration successful.',
      registration,
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentRegistrations = async (req, res, next) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required.' });
    }

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const registrations = await Registration.find({ student: student._id })
      .populate('course', 'courseName description duration amount prerequisites imageUrl')
      .sort({ registeredAt: -1 })
      .lean();

    res.json({ registrations });
  } catch (error) {
    next(error);
  }
};
