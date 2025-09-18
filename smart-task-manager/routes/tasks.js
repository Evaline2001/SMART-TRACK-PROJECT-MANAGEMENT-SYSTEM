import express from 'express';
import jwt from 'jsonwebtoken';
import Task from '../models/Task.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Create Task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, dueDate, assignee } = req.body;
    const task = await Task.create({ title, description, dueDate, assignee, status: 'todo', createdBy: req.userId });
    // send notification email if assignee has email
    if (assignee) {
      const user = await User.findById(assignee);
      if (user?.email) {
        sendEmail(user.email, 'New Task Assigned', `You have been assigned a new task: ${title}`);
      }
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get tasks (for the current user)
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find({ $or: [{ assignee: req.userId }, { createdBy: req.userId }] }).populate('assignee', 'name email');
  res.json(tasks);
});

// Update task
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('assignee', 'name email');
    // If status changed to 'completed', notify creator
    if (task && task.status === 'completed') {
      const creator = await User.findById(task.createdBy);
      if (creator?.email) sendEmail(creator.email, 'Task Completed', `Task "${task.title}" was marked completed.`);
    }
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Nodemailer helper
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail(to, subject, text) {
  try {
    await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text });
  } catch (err) {
    console.error('Email error', err);
  }
}

export default router;
