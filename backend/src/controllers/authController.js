const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { getUserByEmail, getUserById } = require('../models/authModel');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    });

    return res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, created_at: user.created_at },
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

module.exports = { login, me };
