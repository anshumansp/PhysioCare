import express from 'express';
import Appointment from '../models/appointment.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create appointment (Protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      userId: req.user._id
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's appointments (Protected)
router.get('/my-appointments', authenticateToken, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ appointmentDate: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific appointment (Protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update appointment (Protected)
router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel appointment (Protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { status: 'cancelled' } },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
