const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    default: 'admin'
  },
  password: {
    type: String,
    required: true,
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create default admin if not exists
adminSchema.statics.initializeAdmin = async function() {
  const admin = await this.findOne({ username: 'admin' });
  if (!admin) {
    await this.create({
      username: 'admin',
      password: 'admin' // In production, this should be hashed
    });
    console.log('Default admin user created');
  }
};

module.exports = mongoose.model('Admin', adminSchema);
