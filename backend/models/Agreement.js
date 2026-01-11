const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    courseId: {
      type: String,
      required: true,
      trim: true,
    },
    accepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

agreementSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Agreement', agreementSchema);
