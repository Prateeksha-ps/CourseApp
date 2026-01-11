const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{5}$/u, 'Student ID must be a 5-digit number'],
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

studentSchema.methods.toSafeObject = function () {
  const { password, __v, _id, createdAt, updatedAt, ...rest } = this.toObject();
  return {
    id: _id.toString(),
    createdAt,
    updatedAt,
    ...rest,
  };
};

module.exports = mongoose.model('Student', studentSchema);
