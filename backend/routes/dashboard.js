const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// GET dashboard stats
router.get('/stats', protect, async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments({ patient: req.user._id });
    const completedAppointments = await Appointment.countDocuments({ patient: req.user._id, status: 'completed' });
    const pendingAppointments = await Appointment.countDocuments({ patient: req.user._id, status: 'pending' });
    const cancelledAppointments = await Appointment.countDocuments({ patient: req.user._id, status: 'cancelled' });
    const recentAppointments = await Appointment.find({ patient: req.user._id }).sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
        recentAppointments,
        // Research paper metrics (static from paper)
        susScore: 81.2,
        intentAccuracy: 89.4,
        videoSuccess: 92,
        avgLatency: 600,
        pilotUsers: 20,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
