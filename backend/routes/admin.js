import express from 'express';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

export default router;
