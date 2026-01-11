const Course = require('../models/Course');
const Registration = require('../models/Registration');

function mapCourseWithCapacity(course, paidCount = 0) {
  const seatsFilled = paidCount;
  const seatsLeft = Math.max(course.maxRegistrations - seatsFilled, 0);

  return {
    ...course,
    seatsFilled,
    seatsLeft,
  };
}

exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 }).lean();
    if (!courses.length) {
      return res.json([]);
    }

    const courseIds = courses.map((course) => course._id);
    const paidRegistrations = await Registration.aggregate([
      { $match: { course: { $in: courseIds }, paymentStatus: 'Paid' } },
      { $group: { _id: '$course', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(paidRegistrations.map((entry) => [entry._id.toString(), entry.count]));

    const response = courses.map((course) =>
      mapCourseWithCapacity(course, countMap.get(course._id.toString()) || 0)
    );

    res.json(response);
  } catch (error) {
    next(error);
  }
};

exports.getCourseById = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).lean();

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const paidCount = await Registration.countDocuments({ course: course._id, paymentStatus: 'Paid' });
    res.json(mapCourseWithCapacity(course, paidCount));
  } catch (error) {
    next(error);
  }
};
