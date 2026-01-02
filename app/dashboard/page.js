'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  // Mock data - will connect to API later
  const dashboardData = {
    totalDonations: 120000,
    totalExpenses: 75000,
    currentBalance: 45000,
    monthlyDonations: 45000,
    monthlyExpenses: 32000,
    pendingDonations: 18000,
  };

  const StatCard = ({ title, amount, icon, color }) => (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      padding: '24px',
      border: `3px solid ${color}`,
      transition: 'all 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 15px 40px rgba(34, 197, 94, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <p style={{color: '#6b7280', fontSize: '13px', fontWeight: '600', marginBottom: '8px'}}>{title}</p>
          <p style={{fontSize: '24px', fontWeight: 'bold', color: '#065f46'}}>
            ${amount?.toLocaleString()}
          </p>
        </div>
        <div style={{fontSize: '40px', opacity: 0.8}}>{icon}</div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)',
      position: 'relative'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        borderBottom: '2px solid rgba(34, 197, 94, 0.15)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{fontSize: '24px', fontWeight: 'bold', color: '#065f46'}}>☪️ Masjid Fund Management</h1>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              fontWeight: '600',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ef4444';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        {/* Navigation Tabs */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          marginBottom: '32px',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          overflow: 'hidden'
        }}>
          <div style={{display: 'flex', borderBottom: '1px solid rgba(34, 197, 94, 0.15)'}}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'donations', label: 'Donations', icon: '🤲' },
              { id: 'expenses', label: 'Expenses', icon: '💰' },
              { id: 'budget', label: 'Budget', icon: '📋' },
              { id: 'reports', label: 'Reports', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '16px 16px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: activeTab === tab.id ? '#22c55e' : '#6b7280',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab.id ? '3px solid #22c55e' : '3px solid transparent',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#065f46';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = '#6b7280';
                  }
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              <StatCard
                title="Total Donations"
                amount={dashboardData.totalDonations}
                icon="🤲"
                color="#22c55e"
              />
              <StatCard
                title="Total Expenses"
                amount={dashboardData.totalExpenses}
                icon="💸"
                color="#ef4444"
              />
              <StatCard
                title="Current Balance ⭐"
                amount={dashboardData.currentBalance}
                icon="💚"
                color="#16a34a"
              />
              <StatCard
                title="Monthly Donations"
                amount={dashboardData.monthlyDonations}
                icon="🤲"
                color="#4ade80"
              />
              <StatCard
                title="Monthly Expenses"
                amount={dashboardData.monthlyExpenses}
                icon="💰"
                color="#f97316"
              />
              <StatCard
                title="Pending Donations"
                amount={dashboardData.pendingDonations}
                icon="⏳"
                color="#eab308"
              />
            </div>

            {/* Quick Actions */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              padding: '24px',
              border: '1px solid rgba(34, 197, 94, 0.15)'
            }}>
              <h2 style={{fontSize: '18px', fontWeight: 'bold', color: '#065f46', marginBottom: '20px'}}>Quick Actions</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px'
              }}>
                <button style={{
                  backgroundColor: '#22c55e',
                  color: 'white',
                  fontWeight: '600',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#22c55e';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  🤲 Add Donation
                </button>
                <button style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontWeight: '600',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  💰 Add Expense
                </button>
                <button style={{
                  backgroundColor: '#d97706',
                  color: 'white',
                  fontWeight: '600',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#b45309';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#d97706';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  📋 Set Budget
                </button>
                <button style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  fontWeight: '600',
                  padding: '16px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#15803d';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  📊 Generate Report
                </button>
              </div>
            </div>

            {/* Summary Info */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(34, 197, 94, 0.15)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <h2 style={{fontSize: '18px', fontWeight: 'bold', color: '#065f46', marginBottom: '20px'}}>Financial Summary</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '24px'
              }}>
                <div style={{textAlign: 'center'}}>
                  <p style={{color: '#6b7280', fontSize: '11px', fontWeight: '600', marginBottom: '12px'}}>TOTAL DONATIONS</p>
                  <p style={{fontSize: '22px', fontWeight: 'bold', color: '#22c55e'}}>
                    ${dashboardData.totalDonations.toLocaleString()}
                  </p>
                </div>
                <div style={{textAlign: 'center'}}>
                  <p style={{color: '#6b7280', fontSize: '11px', fontWeight: '600', marginBottom: '12px'}}>TOTAL EXPENSES</p>
                  <p style={{fontSize: '22px', fontWeight: 'bold', color: '#ef4444'}}>
                    ${dashboardData.totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div style={{textAlign: 'center'}}>
                  <p style={{color: '#6b7280', fontSize: '11px', fontWeight: '600', marginBottom: '12px'}}>BALANCE</p>
                  <p style={{fontSize: '22px', fontWeight: 'bold', color: '#22c55e'}}>
                    ${dashboardData.currentBalance.toLocaleString()}
                  </p>
                </div>
                <div style={{textAlign: 'center'}}>
                  <p style={{color: '#6b7280', fontSize: '11px', fontWeight: '600', marginBottom: '12px'}}>NET CHANGE</p>
                  <p style={{fontSize: '22px', fontWeight: 'bold', color: '#d97706'}}>
                    {(dashboardData.currentBalance > 0 ? '+' : '')}{dashboardData.currentBalance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs - Coming Soon */}
        {activeTab !== 'dashboard' && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid rgba(34, 197, 94, 0.15)'
          }}>
            <p style={{fontSize: '20px', fontWeight: 'bold', color: '#065f46', marginBottom: '12px'}}>Coming Soon</p>
            <p style={{color: '#6b7280'}}>This page is under development...</p>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[role="button"] {
            font-size: 12px;
            padding: 12px 8px;
          }
        }
      `}</style>
    </div>
  );
}
