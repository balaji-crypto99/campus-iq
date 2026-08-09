const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'campus_iq_super_secret_jwt_key_2026_secure', {
    expiresIn: '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, studentId, department, year, phone } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role === 'ADMIN' ? 'ADMIN' : 'STUDENT',
      studentId: studentId || '',
      department: department || 'General',
      year: year || 'N/A',
      phone: phone || '',
    });

    // Create welcome notification
    await Notification.create({
      userId: user._id,
      title: 'Welcome to Campus IQ!',
      message: `Your account has been registered successfully as a ${user.role}.`,
      type: 'INFO',
    });

    // Create activity log
    await ActivityLog.create({
      userId: user._id,
      action: 'USER_REGISTERED',
      metadata: { role: user.role, email: user.email },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Create login activity log
    await ActivityLog.create({
      userId: user._id,
      action: 'USER_LOGIN',
      metadata: { timestamp: new Date() },
    });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
