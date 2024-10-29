import express from 'express';
import User from '../models/User.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Get all mentors
router.get('/', async (req, res) => {
  try {
    const mentors = await User.find({ 
      role: 'mentor',
      isApproved: true 
    }).select('-password');
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending mentor approvals (admin only)
router.get('/pending', auth, checkRole(['admin']), async (req, res) => {
  try {
    const pendingMentors = await User.find({
      role: 'mentor',
      isApproved: false
    }).select('-password');
    res.json(pendingMentors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve/reject mentor (admin only)
router.patch('/:id/approve', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { approved } = req.body;
    const mentor = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'mentor' },
      { isApproved: approved },
      { new: true }
    ).select('-password');

    if (!mentor) {
      return res.status(404).json({ error: 'Mentor not found' });
    }

    res.json(mentor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update mentor profile
router.patch('/profile', auth, checkRole(['mentor']), async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'bio', 'skills', 'domains', 'experience'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save();
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;