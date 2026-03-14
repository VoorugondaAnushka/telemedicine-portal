import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Marathi', 'Bengali', 'Gujarati'];

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', phone: '', location: '', language: 'English' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'stretch',
      background: 'var(--bg)', fontFamily: 'var(--font)'
    }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        alignItems: 'center', padding: '60px 40px',
        background: 'linear-gradient(160deg, #060e1a 0%, #0a2a20 50%, #060e1a 100%)',
        borderRight: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden', minWidth: 340
      }}>
        {/* Decorative glows */}
        <div style={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,212,170,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,212,170,0.06)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', animation: 'fadeUp 0.6s ease both' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 22, margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #00d4aa, #00a880)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 38, boxShadow: '0 0 40px rgba(0,212,170,0.3)'
          }}>🏥</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: -0.5, color: 'var(--text)', marginBottom: 6 }}>
            TeleMed<span style={{ color: 'var(--accent)' }}>AI</span>
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: 13, maxWidth: 260 }}>
            AI-Powered Telemedicine Portal for Rural India
          </p>
        </div>

        {/* Feature list */}
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 300, animation: 'fadeUp 0.7s ease 0.1s both' }}>
          {[
            { icon: '🤖', title: 'AI Health Chatbot', desc: 'Smart triage with NLP' },
            { icon: '📹', title: 'Video Consultation', desc: 'Optimized for 2G/3G' },
            { icon: '🌐', title: 'Multilingual', desc: 'Regional Indian languages' },
            { icon: '📋', title: 'E-Prescriptions', desc: 'Instant delivery via email' },
          ].map(f => (
            <div key={f.title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
              }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* IEEE badge */}
        <div style={{
          marginTop: 48, padding: '8px 16px', borderRadius: 8,
          background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)',
          fontSize: 11, color: 'var(--accent)', letterSpacing: 1, fontWeight: 600
        }}>IEEE · CISES 2025 · DOI: 10.1109/CISES66934.2025.11265573</div>
      </div>

      {/* Right Panel - Form */}
      <div style={{
        width: '45%', maxWidth: 480, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 48px', background: 'var(--bg)'
      }}>
        <div style={{ width: '100%', animation: 'fadeUp 0.5s ease both' }}>
          {/* Tab Toggle */}
          <div style={{
            display: 'flex', background: 'var(--bg2)', borderRadius: 12,
            padding: 4, marginBottom: 32, border: '1px solid var(--border)'
          }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
                flex: 1, padding: '10px', borderRadius: 9, fontWeight: 700, fontSize: 14,
                background: mode === m ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'transparent',
                color: mode === m ? 'var(--bg)' : 'var(--text2)',
                transition: 'all 0.2s', textTransform: 'capitalize'
              }}>{m === 'login' ? 'Sign In' : 'Register'}</button>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: 'var(--text)' }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: 'var(--text2)', fontSize: 13, marginBottom: 28 }}>
            {mode === 'login' ? 'Sign in to access your telemedicine portal' : 'Join TeleMedAI for free healthcare access'}
          </p>

          {error && (
            <div style={{
              background: 'rgba(231,111,81,0.12)', border: '1px solid rgba(231,111,81,0.3)',
              color: '#e76f51', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'register' && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Full Name</label>
                  <input name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Phone</label>
                    <input name="phone" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Language</label>
                    <select name="language" value={form.language} onChange={handleChange}>
                      {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Location (Village/District)</label>
                  <input name="location" placeholder="e.g. Kurnool, Andhra Pradesh" value={form.location} onChange={handleChange} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Register as</label>
                  <select name="role" value={form.role} onChange={handleChange}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Email Address</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>Password</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>

            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? '⏳ Please wait...' : mode === 'login' ? '→ Sign In' : '→ Create Account'}
            </button>
          </form>

          {mode === 'login' && (
            <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>🧪 Demo credentials</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--accent)' }}>patient@demo.com / demo1234</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
