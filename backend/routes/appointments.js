const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

// Create a new appointment
router.post('/', auth, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      userId: req.user.id
    });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's appointments
router.get('/my-appointments', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user.id })
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appointment status
router.patch('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: req.body.status },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available time slots for a specific date
router.get('/available-slots/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const bookedAppointments = await Appointment.find({
      date: {
        $gte: new Date(date.setHours(0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59))
      },
      status: { $ne: 'cancelled' }
    });

    const allTimeSlots = [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '02:00 PM', '03:00 PM', '04:00 PM'
    ];

    const bookedSlots = bookedAppointments.map(app => app.timeSlot);
    const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
