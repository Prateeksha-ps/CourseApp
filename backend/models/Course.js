const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    prerequisites: {
      type: [String],
      default: [],
    },
    maxRegistrations: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { timestamps: true }
);

courseSchema.methods.hasAvailableSpots = async function () {
  const Registration = mongoose.model('Registration');
  const count = await Registration.countDocuments({
    course: this._id,
    paymentStatus: 'Paid',
  });
  return count < this.maxRegistrations;
};

module.exports = mongoose.model('Course', courseSchema);
