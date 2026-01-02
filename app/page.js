'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (email && password) {
        localStorage.setItem('adminToken', 'demo-token');
        router.push('/dashboard');
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '384px',
        height: '384px',
        backgroundColor: 'rgba(34, 197, 94, 0.05)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '384px',
        height: '384px',
        backgroundColor: 'rgba(217, 119, 6, 0.05)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }}></div>
      
      <div style={{
        width: '100%',
        maxWidth: '448px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header Section */}
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #22c55e 0%, #d97706 100%)',
            borderRadius: '16px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(34, 197, 94, 0.2)',
            fontSize: '40px'
          }}>
            ☪️
          </div>
          <h1 style={{fontSize: '32px', fontWeight: 'bold', color: '#065f46', marginBottom: '8px'}}>Masjid Fund</h1>
          <p style={{color: '#047857', fontSize: '16px', fontWeight: '500'}}>مسجد خيراتي نظام</p>
          <p style={{color: '#6b7280', fontSize: '13px', marginTop: '4px'}}>Management System</p>
        </div>

        {/* Login Card */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          border: '2px solid rgba(34, 197, 94, 0.2)'
        }}>
          <form onSubmit={handleLogin}>
            {/* Error Message */}
            {error && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#991b1b',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div style={{marginBottom: '20px'}}>
              <label style={{
                display: 'block',
                color: '#065f46',
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <div style={{position: 'relative'}}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@masjid.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#065f46',
                    fontSize: '14px',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22c55e';
                    e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.backgroundColor = '#f0fdf4';
                  }}
                />
                <svg style={{position: 'absolute', right: '12px', top: '12px', width: '20px', height: '20px', color: '#6b7280'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Password Input */}
            <div style={{marginBottom: '20px'}}>
              <label style={{
                display: 'block',
                color: '#065f46',
                fontWeight: '600',
                fontSize: '14px',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{position: 'relative'}}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '8px',
                    color: '#065f46',
                    fontSize: '14px',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#22c55e';
                    e.target.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                    e.target.style.boxShadow = 'none';
                    e.target.style.backgroundColor = '#f0fdf4';
                  }}
                />
                <svg style={{position: 'absolute', right: '12px', top: '12px', width: '20px', height: '20px', color: '#6b7280'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              marginBottom: '24px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#374151',
                cursor: 'pointer'
              }}>
                <input type="checkbox" style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }} />
                Remember me
              </label>
              <a href="#" style={{color: '#22c55e', textDecoration: 'none', transition: 'color 0.3s'}} onMouseEnter={(e) => e.target.style.color = '#16a34a'} onMouseLeave={(e) => e.target.style.color = '#22c55e'}>
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 'linear-gradient(90deg, #d1d5db, #d1d5db)' : 'linear-gradient(90deg, #22c55e, #16a34a)',
                color: 'white',
                fontWeight: '600',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                transition: 'all 0.3s',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '24px',
                boxShadow: '0 10px 20px rgba(34, 197, 94, 0.15)',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.background = 'linear-gradient(90deg, #16a34a, #15803d)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 15px 30px rgba(34, 197, 94, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 20px rgba(34, 197, 94, 0.15)';
                }
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{position: 'relative', margin: '24px 0'}}>
              <div style={{borderTop: '1px solid rgba(34, 197, 94, 0.2)'}}></div>
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#ffffff',
                padding: '0 8px'
              }}>
                <span style={{fontSize: '12px', color: '#6b7280'}}>Demo Credentials</span>
              </div>
            </div>

            {/* Demo Info */}
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.05)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '12px',
              color: '#374151'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <span style={{color: '#22c55e'}}>✉️</span>
                <span>Email: <span style={{color: '#065f46', fontWeight: '500'}}>admin@masjid.com</span></span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <span style={{color: '#22c55e'}}>🔐</span>
                <span>Password: <span style={{color: '#065f46', fontWeight: '500'}}>password123</span></span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '32px',
          color: '#6b7280',
          fontSize: '12px'
        }}>
          <p>© 2026 Masjid Fund Management. All rights reserved.</p>
          <p style={{marginTop: '8px', fontSize: '11px', color: '#9ca3af'}}>Alhamdulillah - جزاك الله خيرا</p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder {
          color: #64748b;
        }
      `}</style>
    </div>
  );
}
