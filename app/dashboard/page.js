'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
    }

    // Handle scroll to top button
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock data
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
      padding: '20px',
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
          <p style={{color: '#6b7280', fontSize: '12px', fontWeight: '600', marginBottom: '8px'}}>{title}</p>
          <p style={{fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 'bold', color: '#065f46'}}>
            ${amount?.toLocaleString()}
          </p>
        </div>
        <div style={{fontSize: 'clamp(32px, 8vw, 40px)', opacity: 0.8}}>{icon}</div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'donations', label: 'Donations', icon: '🤲' },
    { id: 'expenses', label: 'Expenses', icon: '💰' },
    { id: 'budget', label: 'Budget', icon: '📋' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ];

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
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0}}>
            <div style={{fontSize: 'clamp(24px, 6vw, 32px)'}}>🕌</div>
            <h1 style={{
              fontSize: 'clamp(14px, 4vw, 20px)', 
              fontWeight: 'bold', 
              color: '#065f46',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              Masjid Fund
            </h1>
          </div>
          
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              fontWeight: '600',
              padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
              borderRadius: '8px',
              border: 'none',
              fontSize: 'clamp(11px, 2vw, 14px)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              whiteSpace: 'nowrap'
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
        padding: 'clamp(12px, 3vw, 24px)',
        paddingBottom: '80px'
      }}>
        {/* Navigation Tabs - Only show 3 on mobile */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          marginBottom: '20px',
          border: '1px solid rgba(34, 197, 94, 0.15)',
          overflow: 'auto'
        }}>
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(34, 197, 94, 0.15)',
            overflowX: 'auto',
            scrollBehavior: 'smooth'
          }}>
            {tabs.map((tab, index) => {
              // Hide 4th and 5th items on mobile (only show first 3)
              const isHiddenOnMobile = index >= 3;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: '0 0 auto',
                    minWidth: 'clamp(80px, 20vw, 150px)',
                    padding: 'clamp(10px, 2vw, 16px)',
                    fontWeight: '600',
                    fontSize: 'clamp(11px, 2vw, 14px)',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: activeTab === tab.id ? '#22c55e' : '#6b7280',
                    cursor: 'pointer',
                    borderBottom: activeTab === tab.id ? '3px solid #22c55e' : '3px solid transparent',
                    transition: 'all 0.3s',
                    textAlign: 'center',
                    display: isHiddenOnMobile ? 'none' : 'block'
                  }}
                  className={isHiddenOnMobile ? 'hide-on-mobile' : ''}
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
                  <div style={{fontSize: 'clamp(16px, 3vw, 20px)'}}>{tab.icon}</div>
                  <div>{tab.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 3vw, 24px)'}}>
            {/* Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 100%, 280px), 1fr))',
              gap: 'clamp(12px, 2vw, 16px)'
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
              padding: 'clamp(16px, 3vw, 24px)',
              border: '1px solid rgba(34, 197, 94, 0.15)'
            }}>
              <h2 style={{fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', color: '#065f46', marginBottom: '16px'}}>Quick Actions</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(100px, 100%, 180px), 1fr))',
                gap: '10px'
              }}>
                {[
                  { label: '🤲 Donation', bg: '#22c55e', hover: '#16a34a' },
                  { label: '💰 Expense', bg: '#ef4444', hover: '#dc2626' },
                  { label: '📋 Budget', bg: '#d97706', hover: '#b45309' },
                  { label: '📊 Report', bg: '#16a34a', hover: '#15803d' }
                ].map((action, idx) => (
                  <button
                    key={idx}
                    style={{
                      backgroundColor: action.bg,
                      color: 'white',
                      fontWeight: '600',
                      padding: 'clamp(10px, 2vw, 14px)',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: 'clamp(11px, 2vw, 13px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = action.hover;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = action.bg;
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Info */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid rgba(34, 197, 94, 0.15)',
              borderRadius: '12px',
              padding: 'clamp(16px, 3vw, 24px)'
            }}>
              <h2 style={{fontSize: 'clamp(14px, 3vw, 18px)', fontWeight: 'bold', color: '#065f46', marginBottom: '16px'}}>Financial Summary</h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(120px, 100%, 150px), 1fr))',
                gap: '16px'
              }}>
                <div style={{textAlign: 'center'}}>
                  <p style={{color: '#6b7280', fontSize: 'clamp(10px, 2vw, 11px)', fontWeight: '600', marginBottom: '8px'}}>DONATIONS</p>
                  <p style={{fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 'bold', color: '#22c55e'}}>
                    ${dashboardData.totalDonations.toLocaleString()}
                  </p>
                </div>
                <div style={{textAlign: 'center'}}>
                  <p style={{color: '#6b7280', fontSize: 'clamp(10px, 2vw, 11px)', fontWeight: '600', marginBottom: '8px'}}>EXPENSES</p>
                  <p style={{fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 'bold', color: '#ef4444'}}>
                    ${dashboardData.totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div style={{textAlign: 'center'}}>
                  <p style={{color: '#6b7280', fontSize: 'clamp(10px, 2vw, 11px)', fontWeight: '600', marginBottom: '8px'}}>BALANCE</p>
                  <p style={{fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 'bold', color: '#22c55e'}}>
                    ${dashboardData.currentBalance.toLocaleString()}
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
            padding: 'clamp(32px, 10vw, 48px) clamp(16px, 4vw, 24px)',
            textAlign: 'center',
            border: '1px solid rgba(34, 197, 94, 0.15)'
          }}>
            <p style={{fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 'bold', color: '#065f46', marginBottom: '12px'}}>Coming Soon</p>
            <p style={{color: '#6b7280', fontSize: 'clamp(13px, 2vw, 15px)'}}>This page is under development...</p>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '50px',
            height: '50px',
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
            zIndex: 99,
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.3s ease-in'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#16a34a';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#22c55e';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ↑
        </button>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-on-mobile {
            display: none !important;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Hide scrollbar for tabs on mobile but keep functionality */
        @media (max-width: 640px) {
          div::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
