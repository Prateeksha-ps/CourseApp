const Student = require('../models/Student');
const { generateStudentId } = require('../utils/helpers');

async function generateUniqueStudentId() {
  let candidate = null;
  let exists = true;

  while (exists) {
    candidate = generateStudentId();
    // Avoid race conditions by ensuring uniqueness with DB check in loop
    exists = await Student.exists({ studentId: candidate });
  }

  return candidate;
}

exports.registerStudent = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body || {};

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const studentId = await generateUniqueStudentId();

    const student = await Student.create({
      studentId,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
      password,
    });

    res.status(201).json({
      message: 'Registration successful.',
      student: {
        ...student.toSafeObject(),
        role: 'student',
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.loginStudent = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student || student.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      message: 'Login successful.',
      student: {
        ...student.toSafeObject(),
        role: 'student',
      },
    });
  } catch (error) {
    next(error);
  }
};
