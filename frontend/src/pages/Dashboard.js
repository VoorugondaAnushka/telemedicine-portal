import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#00d4aa', '#f4a261', '#e76f51', '#457b9d', '#a8dadc'];
const SPECIALTIES = ['Internal Medicine', 'Cardiology', 'Ophthalmology', 'Neurology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'General'];
const DOCTORS = { 'Internal Medicine': 'Dr. Ramesh Kumar', Cardiology: 'Dr. Priya Nair', Ophthalmology: 'Dr. Suresh Rao', Neurology: 'Dr. Anjali Singh', Dermatology: 'Dr. Kavita Sharma', Pediatrics: 'Dr. Arjun Mehta', Orthopedics: 'Dr. Vikram Patel', General: 'Dr. Sunita Reddy' };

const radarData = [
  { feature: 'AI Chatbot', Proposed: 5, 'Ref[24]': 1, 'Ref[25]': 2 },
  { feature: 'Low Bandwidth', Proposed: 5, 'Ref[24]': 1, 'Ref[25]': 1 },
  { feature: 'Multilingual', Proposed: 5, 'Ref[24]': 1, 'Ref[25]': 2 },
  { feature: 'Wearable', Proposed: 4, 'Ref[24]': 1, 'Ref[25]': 2 },
  { feature: 'Scheduling', Proposed: 5, 'Ref[24]': 1, 'Ref[25]': 4 },
  { feature: 'Prescription', Proposed: 5, 'Ref[24]': 1, 'Ref[25]': 3 },
];

const latencyData = [
  { test: 'T1', ms: 580 }, { test: 'T2', ms: 610 }, { test: 'T3', ms: 540 },
  { test: 'T4', ms: 590 }, { test: 'T5', ms: 620 }, { test: 'T6', ms: 560 },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAppt, setNewAppt] = useState({ specialty: 'General', date: '', time: '', symptoms: '' });
  const [loading, setLoading] = useState(true);
  const [apptLoading, setApptLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [statsRes, apptRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/appointments')
      ]);
      setStats(statsRes.data.data);
      setAppointments(apptRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setApptLoading(true);
    try {
      const doctorName = DOCTORS[newAppt.specialty];
      await axios.post('/api/appointments', { ...newAppt, doctorName });
      showNotif('✅ Appointment booked! Room number sent to your email.');
      setShowModal(false);
      setNewAppt({ specialty: 'General', date: '', time: '', symptoms: '' });
      fetchData();
    } catch (err) {
      showNotif('❌ Failed to book appointment. Try again.', 'error');
    } finally {
      setApptLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await axios.put(`/api/appointments/${id}`, { status: 'cancelled' });
      showNotif('Appointment cancelled.');
      fetchData();
    } catch { showNotif('Error cancelling.', 'error'); }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const pieData = stats ? [
    { name: 'Pending', value: stats.pendingAppointments || 0 },
    { name: 'Completed', value: stats.completedAppointments || 0 },
    { name: 'Cancelled', value: stats.cancelledAppointments || 0 },
  ] : [];

  const barData = stats ? [
    { name: 'SUS Score', value: stats.susScore },
    { name: 'Intent Acc.', value: stats.intentAccuracy },
    { name: 'Video OK', value: stats.videoSuccess },
  ] : [];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ margin: '0 auto 16px' }} />
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Loading dashboard...</p>
      </div>
    </div>
  );

  const TABS = ['overview', 'appointments', 'research', 'flow'];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font)' }}>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: notification.type === 'error' ? 'rgba(231,111,81,0.95)' : 'rgba(0,212,170,0.95)',
          color: '#fff', padding: '14px 22px', borderRadius: 12,
          fontWeight: 600, fontSize: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'fadeUp 0.3s ease'
        }}>{notification.msg}</div>
      )}

      {/* Sidebar */}
      <div style={{
        width: 240, background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0
      }}>
        {/* Logo */}
        <div style={{ padding: '0 20px 28px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'linear-gradient(135deg,#00d4aa,#00a880)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏥</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)' }}>TeleMed<span style={{ color: 'var(--accent)' }}>AI</span></div>
              <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 0.5 }}>Rural Healthcare Portal</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#00d4aa,#00a880)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: 'var(--bg)', marginBottom: 10 }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>{user?.email}</div>
          <div style={{ marginTop: 8, display: 'inline-block', background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.25)', borderRadius: 6, padding: '2px 10px', fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'capitalize' }}>{user?.role}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'appointments', label: 'Appointments', icon: '📅' },
            { id: 'research', label: 'Research Metrics', icon: '🔬' },
            { id: 'flow', label: 'System Flow', icon: '🔄' },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 14px', borderRadius: 10, fontWeight: 500, fontSize: 13,
              background: activeTab === t.id ? 'rgba(0,212,170,0.12)' : 'transparent',
              color: activeTab === t.id ? 'var(--accent)' : 'var(--text2)',
              border: activeTab === t.id ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
              textAlign: 'left', transition: 'all 0.2s'
            }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '11px 14px', borderRadius: 10,
            background: 'rgba(231,111,81,0.1)', border: '1px solid rgba(231,111,81,0.2)',
            color: '#e76f51', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10
          }}>🚪 Sign Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>
              {TABS.map(t => t === activeTab ? { overview: 'Dashboard Overview', appointments: 'My Appointments', research: 'Research Metrics', flow: 'System Flow' }[t] : null).find(Boolean)}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text3)', marginTop: 2 }}>AI-Assisted Telemedicine · IEEE CISES 2025</p>
          </div>
          {activeTab === 'appointments' && (
            <button onClick={() => setShowModal(true)} style={{
              background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
              color: 'var(--bg)', padding: '10px 22px', borderRadius: 10,
              fontWeight: 700, fontSize: 13
            }}>+ Book Appointment</button>
          )}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '28px 32px' }}>

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && stats && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              {/* Stats cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                  { label: 'Total Appointments', value: stats.totalAppointments, icon: '📅', color: '#00d4aa' },
                  { label: 'Completed', value: stats.completedAppointments, icon: '✅', color: '#f4a261' },
                  { label: 'Pending', value: stats.pendingAppointments, icon: '⏳', color: '#a8dadc' },
                  { label: 'Cancelled', value: stats.cancelledAppointments, icon: '❌', color: '#e76f51' },
                ].map(s => (
                  <div key={s.label} className="card" style={{ borderColor: s.color + '33' }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {/* Appointment status pie */}
                <div className="card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Appointment Status</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text2)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Research metrics bar */}
                <div className="card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>AI System Performance (%)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barData}>
                      <XAxis dataKey="name" tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[75, 100]} tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="value" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Location & language */}
              <div className="card" style={{ marginTop: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Your Profile</h3>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Name', value: user?.name },
                    { label: 'Role', value: user?.role },
                    { label: 'Language', value: user?.language || 'English' },
                    { label: 'Location', value: user?.location || 'Not set' },
                    { label: 'SUS Score', value: `${stats.susScore}/100` },
                    { label: 'Video Latency', value: `<${stats.avgLatency}ms` },
                  ].map(p => (
                    <div key={p.label} style={{ minWidth: 120 }}>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 4, fontWeight: 600 }}>{p.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{p.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* APPOINTMENTS TAB */}
          {activeTab === 'appointments' && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              {appointments.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 60 }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                  <div style={{ color: 'var(--text2)', fontSize: 14 }}>No appointments yet. Book your first consultation!</div>
                  <button onClick={() => setShowModal(true)} style={{
                    marginTop: 20, background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
                    color: 'var(--bg)', padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 14
                  }}>+ Book Appointment</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {appointments.map(a => (
                    <div key={a._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🩺</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{a.doctorName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3 }}>{a.specialty} · {a.date} at {a.time}</div>
                        {a.symptoms && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Symptoms: {a.symptoms}</div>}
                        {a.roomNumber && <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>Room: {a.roomNumber}</div>}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                          background: { pending: 'rgba(244,162,97,0.15)', completed: 'rgba(0,212,170,0.15)', cancelled: 'rgba(231,111,81,0.15)', confirmed: 'rgba(168,218,220,0.15)' }[a.status],
                          color: { pending: '#f4a261', completed: '#00d4aa', cancelled: '#e76f51', confirmed: '#a8dadc' }[a.status]
                        }}>{a.status}</span>
                        {a.status === 'pending' && (
                          <button onClick={() => handleCancel(a._id)} style={{
                            background: 'rgba(231,111,81,0.1)', border: '1px solid rgba(231,111,81,0.2)',
                            color: '#e76f51', padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600
                          }}>Cancel</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RESEARCH TAB */}
          {activeTab === 'research' && (
            <div style={{ animation: 'fadeUp 0.4s ease', display: 'grid', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Feature Coverage (vs. References)</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="feature" tick={{ fill: 'var(--text2)', fontSize: 11 }} />
                      <Radar name="Proposed" dataKey="Proposed" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.2} strokeWidth={2} />
                      <Radar name="Ref[24]" dataKey="Ref[24]" stroke="#e76f51" fill="#e76f51" fillOpacity={0.1} strokeWidth={2} />
                      <Radar name="Ref[25]" dataKey="Ref[25]" stroke="#f4a261" fill="#f4a261" fillOpacity={0.1} strokeWidth={2} />
                      <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text2)' }} />
                      <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="card">
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>3G Video Latency (ms)</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={latencyData}>
                      <XAxis dataKey="test" tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[500, 650]} tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="ms" stroke="#f4a261" strokeWidth={2.5} dot={{ fill: '#f4a261', r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key metrics */}
              <div className="card">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Pilot Study Results — 20 Rural Users</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
                  {[
                    { label: 'SUS Score', value: '81.2/100', icon: '📊', color: '#00d4aa' },
                    { label: 'Intent Accuracy', value: '89.4%', icon: '🤖', color: '#f4a261' },
                    { label: 'Video Success', value: '92%', icon: '📹', color: '#a8dadc' },
                    { label: 'Max Latency', value: '<600ms', icon: '⚡', color: '#e76f51' },
                    { label: 'Pilot Users', value: '20', icon: '👥', color: '#457b9d' },
                  ].map(m => (
                    <div key={m.label} style={{ background: 'var(--bg)', border: `1px solid ${m.color}33`, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>{m.icon}</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: m.color }}>{m.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FLOW TAB */}
          {activeTab === 'flow' && (
            <div style={{ animation: 'fadeUp 0.4s ease' }}>
              <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 20 }}>Patient Journey — End to End</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { icon: '👤', label: 'User Auth / Signup', desc: 'Secure registration & login with role-based access', color: '#00d4aa' },
                    { icon: '📅', label: 'Appointment Scheduling', desc: 'Smart slot booking with doctor availability check via AI chatbot', color: '#f4a261' },
                    { icon: '🤖', label: 'AI Chatbot Triage', desc: 'NLP-based symptom screening with regional dialect support (iNLTK, IndicTrans)', color: '#a8dadc' },
                    { icon: '📹', label: 'Video Consultation', desc: 'Low-bandwidth Zoom-based real-time video call with adaptive bitrate', color: '#e76f51' },
                    { icon: '🩺', label: 'Health Assessment', desc: 'Consolidated diagnosis summary from chatbot & video inputs', color: '#457b9d' },
                    { icon: '💊', label: 'Prescription Delivery', desc: 'Email delivery of prescription with room number for joining', color: '#00d4aa' },
                  ].map((step, i, arr) => (
                    <div key={step.label} style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 44 }}>
                        <div style={{ width: 44, height: 44, borderRadius: '50%', background: step.color + '20', border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{step.icon}</div>
                        {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--border)', margin: '4px 0', minHeight: 20 }} />}
                      </div>
                      <div style={{ flex: 1, paddingBottom: i < arr.length - 1 ? 20 : 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>Step {i + 1}: {step.label}</div>
                        <div style={{ fontSize: 13, color: 'var(--text2)' }}>{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Future Enhancements</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                  {['IoT Wearable Integration', 'Specialist Network Expansion', 'Advanced AI Diagnostics', 'Telehealth Education Modules', 'Mobile App Version', 'Data Security Protocols', 'Regional Health Content', 'Scalable Architecture'].map(f => (
                    <div key={f} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />{f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Book Appointment Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 480, animation: 'fadeUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>📅 Book Appointment</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text2)', width: 32, height: 32, borderRadius: 8, fontSize: 16 }}>✕</button>
            </div>
            <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Specialty</label>
                <select value={newAppt.specialty} onChange={e => setNewAppt({ ...newAppt, specialty: e.target.value })}>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--accent)' }}>
                🩺 Assigned Doctor: <strong>{DOCTORS[newAppt.specialty]}</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Date</label>
                  <input type="date" value={newAppt.date} onChange={e => setNewAppt({ ...newAppt, date: e.target.value })} required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Time</label>
                  <input type="time" value={newAppt.time} onChange={e => setNewAppt({ ...newAppt, time: e.target.value })} required />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Describe Symptoms</label>
                <textarea value={newAppt.symptoms} onChange={e => setNewAppt({ ...newAppt, symptoms: e.target.value })} rows={3} placeholder="Briefly describe your health concern..." style={{ resize: 'vertical' }} />
              </div>
              <button className="btn-primary" type="submit" disabled={apptLoading}>
                {apptLoading ? '⏳ Booking...' : '✅ Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
