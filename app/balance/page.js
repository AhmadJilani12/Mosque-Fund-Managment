'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BalancePage() {
  const router = useRouter();
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'opening',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
    } else {
      fetchBalances();
    }
  }, [router]);

  const fetchBalances = async () => {
    try {
      const res = await fetch('/api/balances');
      const data = await res.json();

      if (data.success) {
        setBalances(data.balances);
      } else {
        setMessage('Failed to fetch balances');
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
      setMessage('Error fetching balances');
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

    if (!formData.amount) {
      setMessage('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/balances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          amount: parseFloat(formData.amount),
          date: formData.date,
          notes: formData.notes,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Balance record added successfully!');
        setFormData({
          type: 'opening',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          notes: '',
        });
        setShowForm(false);
        fetchBalances();
      } else {
        setMessage(data.error || 'Failed to add balance record');
      }
    } catch (error) {
      console.error('Error adding balance:', error);
      setMessage('Error adding balance record');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this balance record?')) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/balances?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Balance record deleted successfully');
        fetchBalances();
      } else {
        setMessage(data.error || 'Failed to delete balance record');
      }
    } catch (error) {
      console.error('Error deleting balance:', error);
      setMessage('Error deleting balance record');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const totalBalance = balances.reduce((sum, b) => sum + b.amount, 0);
  const openingBalance = balances.find(b => b.type === 'opening')?.amount || 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚖️ Balance Management</h1>
        {!showForm && (
          <button
            style={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            + Add Balance Record
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
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                style={styles.input}
                required
              >
                <option value="opening">Opening Balance</option>
                <option value="adjustment">Adjustment</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                step="0.01"
                style={styles.input}
                required
              />
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
              {loading ? 'Adding...' : 'Add Record'}
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
          <div style={styles.statLabel}>Opening Balance</div>
          <div style={styles.statValue}>Rs {openingBalance.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Balance</div>
          <div style={styles.statValue}>Rs {totalBalance.toFixed(2)}</div>
        </div>
      </div>

      <div style={styles.listContainer}>
        {balances.length === 0 ? (
          <p style={styles.emptyText}>No balance records yet</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCell}>Type</div>
              <div style={styles.tableCell}>Amount</div>
              <div style={styles.tableCell}>Date</div>
              <div style={styles.tableCell}>Notes</div>
              <div style={styles.tableCell}>Actions</div>
            </div>
            {balances.map((balance) => (
              <div key={balance._id} style={styles.tableRow}>
                <div style={styles.tableCell}>
                  <span style={styles.badge}>
                    {balance.type.charAt(0).toUpperCase() + balance.type.slice(1)}
                  </span>
                </div>
                <div style={styles.tableCell}>
                  Rs {balance.amount.toFixed(2)}
                </div>
                <div style={styles.tableCell}>
                  {formatDate(balance.date)}
                </div>
                <div style={styles.tableCell}>
                  {balance.notes || '-'}
                </div>
                <div style={styles.tableCellActions}>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(balance._id)}
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
    </div>
  );
}

const styles = {
  container: {
    padding: clamp('12px', '3vw', '24px'),
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: clamp('16px', '4vw', '32px'),
    flexWrap: 'wrap',
    gap: clamp('12px', '3vw', '24px'),
  },
  title: {
    fontSize: clamp('20px', '5vw', '32px'),
    fontWeight: '700',
    color: '#333',
    margin: '0',
  },
  addButton: {
    padding: clamp('8px', '2vw', '12px') + ' ' + clamp('12px', '3vw', '20px'),
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: clamp('13px', '2.5vw', '16px'),
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  message: {
    padding: clamp('10px', '2vw', '16px'),
    marginBottom: clamp('12px', '3vw', '24px'),
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '6px',
    fontSize: clamp('13px', '2.5vw', '14px'),
    border: '1px solid #a7f3d0',
  },
  form: {
    backgroundColor: '#f9fafb',
    padding: clamp('16px', '4vw', '24px'),
    borderRadius: '8px',
    marginBottom: clamp('16px', '4vw', '32px'),
    border: '1px solid #e5e7eb',
  },
  formGroup: {
    marginBottom: clamp('12px', '3vw', '16px'),
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: clamp('12px', '3vw', '16px'),
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#374151',
    fontSize: clamp('13px', '2.5vw', '14px'),
  },
  input: {
    width: '100%',
    padding: clamp('8px', '2vw', '12px'),
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: clamp('13px', '2.5vw', '14px'),
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  formButtons: {
    display: 'flex',
    gap: clamp('8px', '2vw', '12px'),
    flexWrap: 'wrap',
  },
  submitButton: {
    padding: clamp('8px', '2vw', '12px') + ' ' + clamp('16px', '4vw', '24px'),
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: clamp('13px', '2.5vw', '14px'),
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    minWidth: '120px',
  },
  cancelButton: {
    padding: clamp('8px', '2vw', '12px') + ' ' + clamp('16px', '4vw', '24px'),
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontSize: clamp('13px', '2.5vw', '14px'),
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    minWidth: '120px',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: clamp('12px', '3vw', '16px'),
    marginBottom: clamp('16px', '4vw', '32px'),
  },
  statCard: {
    backgroundColor: '#f59e0b',
    color: 'white',
    padding: clamp('12px', '3vw', '16px'),
    borderRadius: '8px',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: clamp('12px', '2.5vw', '14px'),
    opacity: '0.9',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: clamp('18px', '4vw', '24px'),
    fontWeight: '700',
  },
  listContainer: {
    marginTop: clamp('16px', '4vw', '32px'),
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: clamp('13px', '2.5vw', '14px'),
    padding: clamp('20px', '5vw', '40px'),
  },
  table: {
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    backgroundColor: '#f3f4f6',
    padding: clamp('12px', '3vw', '16px'),
    fontWeight: '600',
    fontSize: clamp('13px', '2.5vw', '14px'),
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    padding: clamp('12px', '3vw', '16px'),
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'center',
    fontSize: clamp('13px', '2.5vw', '14px'),
    color: '#4b5563',
  },
  tableCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tableCellActions: {
    display: 'flex',
    gap: clamp('6px', '1.5vw', '8px'),
  },
  deleteButton: {
    padding: clamp('4px', '1.5vw', '6px') + ' ' + clamp('8px', '2vw', '12px'),
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: clamp('11px', '2vw', '12px'),
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '3px 8px',
    borderRadius: '4px',
    fontSize: clamp('11px', '2vw', '12px'),
    fontWeight: '500',
  },
};
