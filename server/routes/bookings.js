import express from 'express';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Create booking
router.post('/', auth, checkRole(['candidate']), async (req, res) => {
  try {
    const service = await Service.findById(req.body.serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const booking = new Booking({
      ...req.body,
      candidateId: req.user._id,
      mentorId: service.mentorId
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const query = req.user.role === 'mentor' 
      ? { mentorId: req.user._id }
      : { candidateId: req.user._id };

    const bookings = await Booking.find(query)
      .populate('serviceId')
      .populate('mentorId', 'name email')
      .populate('candidateId', 'name email');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (req.user.role === 'mentor' && booking.mentorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (req.user.role === 'candidate' && booking.candidateId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;