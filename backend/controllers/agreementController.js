const Agreement = require('../models/Agreement');

exports.acceptAgreement = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId) {
      return res.status(400).json({ message: 'Student ID and course ID are required.' });
    }

    const agreement = await Agreement.findOneAndUpdate(
      { studentId, courseId },
      { accepted: true },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: 'Agreement accepted.', agreement });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Agreement already accepted.' });
    }
    next(err);
  }
};

exports.getAgreementStatus = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.query;

    if (!studentId || !courseId) {
      return res.status(400).json({ message: 'Student ID and course ID are required.' });
    }

    const agreement = await Agreement.findOne({ studentId, courseId });
    res.json({ accepted: agreement ? agreement.accepted : false });
  } catch (err) {
    next(err);
  }
};
