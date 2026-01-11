const User = require('../models/User');

exports.login = async (req, res, next) => {
  try {
    const { username, role } = req.body;

    if (!username || !role) {
      return res.status(400).json({ message: 'Username and role are required.' });
    }

    const normalizedRole = role.toLowerCase();
    if (!['admin', 'student'].includes(normalizedRole)) {
      return res.status(400).json({ message: 'Role must be admin or student.' });
    }

    let user = await User.findOne({ username, role: normalizedRole });
    if (!user) {
      user = await User.create({ username, role: normalizedRole });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};
