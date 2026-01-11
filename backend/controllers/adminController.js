const Admin = require('../models/Admin');
const Course = require('../models/Course');
const Registration = require('../models/Registration');
const Student = require('../models/Student');

exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (username !== 'admin' || password !== 'admin') {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const admin = await Admin.findOne({ username: 'admin' });

    res.json({
      message: 'Login successful.',
      admin: {
        id: admin?._id || null,
        username: 'admin',
        role: 'admin',
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    const {
      courseName,
      description,
      duration,
      amount,
      prerequisites = '',
      maxRegistrations,
      imageUrl = '',
    } = req.body || {};

    if (!courseName || !description || !duration || amount === undefined || !maxRegistrations) {
      return res.status(400).json({ message: 'All course fields are required.' });
    }

    const normalizedPrerequisites = prerequisites
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);

    const courseDoc = await Course.create({
      courseName: courseName.trim(),
      description: description.trim(),
      duration: duration.trim(),
      amount: Number(amount),
      prerequisites: normalizedPrerequisites,
      maxRegistrations: Number(maxRegistrations),
      imageUrl: imageUrl.trim(),
    });

    const course = {
      ...courseDoc.toObject(),
      seatsLeft: Number(maxRegistrations),
      seatsFilled: 0,
    };

    res.status(201).json({
      message: 'Course created successfully.',
      course,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAdminCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();

    if (!courses.length) {
      return res.json({ courses: [] });
    }

    const courseIds = courses.map((course) => course._id);
    const paidRegistrations = await Registration.aggregate([
      { $match: { course: { $in: courseIds }, paymentStatus: 'Paid' } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(paidRegistrations.map((entry) => [entry._id.toString(), entry.count]));

    const response = courses.map((course) => {
      const filled = countMap.get(course._id.toString()) || 0;
      return {
        ...course,
        seatsFilled: filled,
        seatsLeft: Math.max(course.maxRegistrations - filled, 0),
      };
    });

    res.json({ courses: response });
  } catch (error) {
    next(error);
  }
};

exports.getCourseRegistrations = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const registrations = await Registration.find({
      course: courseId,
      paymentStatus: 'Paid',
    })
      .populate('student', 'firstName lastName studentId')
      .populate('course', 'courseName')
      .sort({ registeredAt: -1 })
      .lean();

    const data = registrations.map((registration) => ({
      registrationId: registration._id,
      paymentStatus: registration.paymentStatus,
      registeredAt: registration.registeredAt,
      student: registration.student,
      course: registration.course,
    }));

    res.json({ registrations: data });
  } catch (error) {
    next(error);
  }
};
