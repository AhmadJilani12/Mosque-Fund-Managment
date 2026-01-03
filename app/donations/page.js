'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

function DonationsPage() {
  const router = useRouter();
  const [donations, setDonations] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [formData, setFormData] = useState({
    donorId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    notes: '',
  });

  // Scroll to top effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: 0,
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.2s',
    },
    message: {
      padding: '12px 16px',
      marginBottom: '16px',
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      borderRadius: '8px',
      border: '1px solid #93c5fd',
    },
    form: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
      marginBottom: '16px',
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#374151',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    hint: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px',
      display: 'block',
    },
    formButtons: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
    },
    submitButton: {
      flex: 1,
      padding: '12px 16px',
      backgroundColor: '#22c55e',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '16px',
      transition: 'background-color 0.2s',
    },
    cancelButton: {
      flex: 1,
      padding: '12px 16px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '16px',
      transition: 'background-color 0.2s',
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '24px',
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '8px',
      fontWeight: '500',
    },
    statValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#22c55e',
    },
    listContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    },
    emptyText: {
      padding: '32px',
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: '16px',
    },
    table: {
      width: '100%',
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: '12px',
      padding: '16px',
      backgroundColor: '#f3f4f6',
      fontWeight: '600',
      color: '#374151',
      fontSize: '14px',
      borderBottom: '2px solid #e5e7eb',
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
      gap: '12px',
      padding: '16px',
      borderBottom: '1px solid #e5e7eb',
      alignItems: 'center',
    },
    tableCell: {
      fontSize: '14px',
      color: '#374151',
    },
    tableCellActions: {
      display: 'flex',
      gap: '8px',
    },
    deleteButton: {
      padding: '6px 12px',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      transition: 'background-color 0.2s',
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      backgroundColor: '#e0e7ff',
      color: '#4f46e5',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
    },
    backButton: {
      padding: '10px 16px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
    } else {
      fetchDonations();
      fetchDonors();
    }
  }, [router]);

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();

      if (data.success) {
        setDonations(data.donations);
      } else {
        setMessage('Failed to fetch donations');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setMessage('Error fetching donations');
    }
  };

  const fetchDonors = async () => {
    try {
      const res = await fetch('/api/donors');
      const data = await res.json();

      if (data.success) {
        setDonors(data.donors);
      } else {
        console.error('Failed to fetch donors');
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || formData.amount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: formData.donorId || 'anonymous',
          amount: parseFloat(formData.amount),
          date: formData.date,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Donation added successfully!');
        setFormData({
          donorId: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'cash',
          notes: '',
        });
        setShowForm(false);
        fetchDonations();
      } else {
        setMessage(data.error || 'Failed to add donation');
      }
    } catch (error) {
      console.error('Error adding donation:', error);
      setMessage('Error adding donation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this donation?')) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/donations?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Donation deleted successfully');
        fetchDonations();
      } else {
        setMessage(data.error || 'Failed to delete donation');
      }
    } catch (error) {
      console.error('Error deleting donation:', error);
      setMessage('Error deleting donation');
    } finally {
      setLoading(false);
    }
  };

  const getDonorName = (donorId) => {
    if (!donorId) return 'Anonymous';
    const donor = donors.find(d => d._id === donorId);
    return donor ? donor.name : 'Unknown Donor';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            style={styles.backButton}
            onClick={() => router.back()}
          >
            ← Back
          </button>
          <h1 style={styles.title}>💰 Donations Management</h1>
        </div>
        {!showForm && (
          <button
            style={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            + Add Donation
          </button>
        )}
      </div>

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Select Donor</label>
            <select
              name="donorId"
              value={formData.donorId}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="">-- Anonymous Donation --</option>
              {donors.map((donor) => (
                <option key={donor._id} value={donor._id}>
                  {donor.name}
                </option>
              ))}
            </select>
            <small style={styles.hint}>Leave empty for anonymous donation</small>
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                step="0.01"
                min="0"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Payment Method</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="wallet">Digital Wallet</option>
              </select>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes"
              style={{ ...styles.input, minHeight: '80px', resize: 'none' }}
            />
          </div>

          <div style={styles.formButtons}>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Donation'}
            </button>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={() => setShowForm(false)}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Donations</div>
          <div style={styles.statValue}>Rs {totalDonations.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Number of Donations</div>
          <div style={styles.statValue}>{donations.length}</div>
        </div>
      </div>

      <div style={styles.listContainer}>
        {donations.length === 0 ? (
          <p style={styles.emptyText}>No donations recorded yet</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCell}>Donor Name</div>
              <div style={styles.tableCell}>Amount</div>
              <div style={styles.tableCell}>Date</div>
              <div style={styles.tableCell}>Method</div>
              <div style={styles.tableCell}>Actions</div>
            </div>
            {donations.map((donation) => (
              <div key={donation._id} style={styles.tableRow}>
                <div style={styles.tableCell}>
                  {getDonorName(donation.donorId)}
                </div>
                <div style={styles.tableCell}>
                  Rs {donation.amount.toFixed(2)}
                </div>
                <div style={styles.tableCell}>
                  {formatDate(donation.date)}
                </div>
                <div style={styles.tableCell}>
                  <span style={styles.badge}>
                    {donation.paymentMethod.charAt(0).toUpperCase() + donation.paymentMethod.slice(1)}
                  </span>
                </div>
                <div style={styles.tableCellActions}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(donation._id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
            justifyContent: 'center'
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
          table {
            font-size: 11px;
          }

          th, td {
            padding: 8px 12px !important;
          }
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default DonationsPage;
