const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.register = async (req, res) => {
  try {
    const { name, srn, phone, year, semester, department, role, password } = req.body;
    const existing = await User.findOne({ where: { srn } });
    if (existing) return res.status(400).json({ error: 'SRN already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, srn, phone, year, semester, department, role, password_hash
    });
    res.status(201).json({ message: 'Registered successfully', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { srn, password } = req.body;
    const user = await User.findOne({ where: { srn } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, role: user.role, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, role: user.role, name: user.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};