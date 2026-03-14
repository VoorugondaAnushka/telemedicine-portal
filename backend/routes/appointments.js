const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/auth');

// GET all appointments for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create appointment
router.post('/', protect, async (req, res) => {
  try {
    const { doctorName, specialty, date, time, symptoms } = req.body;
    const roomNumber = 'ROOM-' + Math.floor(1000 + Math.random() * 9000);
    const appt = await Appointment.create({
      patient: req.user._id,
      doctorName,
      specialty,
      date,
      time,
      symptoms,
      roomNumber,
    });
    res.status(201).json({ success: true, data: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT update appointment status
router.put('/:id', protect, async (req, res) => {
  try {
    const appt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE appointment
router.delete('/:id', protect, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
