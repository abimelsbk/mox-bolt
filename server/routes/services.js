import express from 'express';
import Service from '../models/Service.js';
import { auth, checkRole } from '../middleware/auth.js';

const router = express.Router();

// Create service (mentors only)
router.post('/', auth, checkRole(['mentor']), async (req, res) => {
  try {
    const service = new Service({
      ...req.body,
      mentorId: req.user._id
    });
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const filters = {};
    if (req.query.domain) filters.domains = req.query.domain;
    if (req.query.skill) filters.skills = req.query.skill;

    const services = await Service.find(filters).populate('mentorId', 'name email');
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get service by ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('mentorId', 'name email');
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service (mentor only)
router.patch('/:id', auth, checkRole(['mentor']), async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, mentorId: req.user._id },
      req.body,
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete service (mentor only)
router.delete('/:id', auth, checkRole(['mentor']), async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({
      _id: req.params.id,
      mentorId: req.user._id
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;