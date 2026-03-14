// seed.js — Run with: node seed.js
// Creates demo user, doctors, and sample appointments in MongoDB

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine_db';

// ── Inline schemas (no imports needed) ──────────────────────────────────────
const userSchema = new mongoose.Schema({
  name: String, email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, default: 'patient' },
  phone: String, location: String, language: { type: String, default: 'English' },
  createdAt: { type: Date, default: Date.now },
});

const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctorName: String, specialty: String,
  date: String, time: String, symptoms: String,
  status: { type: String, default: 'pending' },
  roomNumber: String, prescription: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Appointment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash passwords
    const hash = (pw) => bcrypt.hash(pw, 12);

    // Create demo patient
    const patient = await User.create({
      name: 'Ravi Kumar',
      email: 'patient@demo.com',
      password: await hash('demo1234'),
      role: 'patient',
      phone: '+91 98765 43210',
      location: 'Kurnool, Andhra Pradesh',
      language: 'Telugu',
    });

    // Create demo doctor
    const doctor = await User.create({
      name: 'Dr. Priya Nair',
      email: 'doctor@demo.com',
      password: await hash('demo1234'),
      role: 'doctor',
      phone: '+91 91234 56789',
      location: 'Bengaluru, Karnataka',
      language: 'Kannada',
    });

    // Create demo admin
    await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: await hash('demo1234'),
      role: 'admin',
      location: 'Hyderabad, Telangana',
      language: 'Telugu',
    });

    // Create sample appointments
    const apptData = [
      {
        patient: patient._id,
        doctorName: 'Dr. Ramesh Kumar',
        specialty: 'Internal Medicine',
        date: '2025-03-20',
        time: '10:00 AM',
        symptoms: 'Fever and body ache for 3 days',
        status: 'completed',
        roomNumber: 'ROOM-4521',
        prescription: 'Paracetamol 500mg, Rest for 3 days',
      },
      {
        patient: patient._id,
        doctorName: 'Dr. Priya Nair',
        specialty: 'Cardiology',
        date: '2025-03-25',
        time: '11:30 AM',
        symptoms: 'Mild chest discomfort and shortness of breath',
        status: 'pending',
        roomNumber: 'ROOM-8832',
      },
      {
        patient: patient._id,
        doctorName: 'Dr. Anjali Singh',
        specialty: 'Neurology',
        date: '2025-03-18',
        time: '09:00 AM',
        symptoms: 'Recurring headaches, mild dizziness',
        status: 'cancelled',
        roomNumber: 'ROOM-1293',
      },
      {
        patient: patient._id,
        doctorName: 'Dr. Suresh Rao',
        specialty: 'Ophthalmology',
        date: '2025-04-01',
        time: '02:00 PM',
        symptoms: 'Blurry vision in right eye',
        status: 'confirmed',
        roomNumber: 'ROOM-5674',
      },
    ];

    await Appointment.insertMany(apptData);

    console.log('\n🎉 Seed complete! Demo accounts created:\n');
    console.log('  👤 Patient  → patient@demo.com  / demo1234');
    console.log('  🩺 Doctor   → doctor@demo.com   / demo1234');
    console.log('  🔑 Admin    → admin@demo.com    / demo1234');
    console.log('\n  4 sample appointments created for the patient.\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
