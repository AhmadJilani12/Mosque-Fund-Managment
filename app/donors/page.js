'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DonorsPage() {
  const router = useRouter();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    defaultAmount: '',
    notes: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
    } else {
      fetchDonors();
    }
  }, [router]);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/donors');
      const data = await res.json();

      if (data.success) {
        setDonors(data.donors);
      } else {
        setMessage('Failed to fetch donors');
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      setMessage('Error fetching donors');
    } finally {
      setLoading(false);
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

    if (!formData.name.trim()) {
      setMessage('Donor name is required');
      return;
    }

    if (!formData.defaultAmount || parseFloat(formData.defaultAmount) <= 10) {
      setMessage('Default monthly amount must be greater than 10');
      return;
    }

    try {
      setLoading(true);
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId
        ? { id: editingId, ...formData }
        : formData;

      const res = await fetch('/api/donors', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message);
        setFormData({ name: '', phone: '', address: '', notes: '' });
        setEditingId(null);
        setShowForm(false);
        fetchDonors();
      } else {
        setMessage(data.error || 'Failed to save donor');
      }
    } catch (error) {
      console.error('Error saving donor:', error);
      setMessage('Error saving donor');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (donor) => {
    console.log('Editing donor:', donor);
    setFormData({
      name: donor.name,
      phone: donor.phone || '',
      address: donor.address || '',
      defaultAmount: donor.defaultAmount ? String(donor.defaultAmount) : '',
      notes: donor.notes || '',
    });
    setEditingId(donor._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this donor?')) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/donors?id=${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Donor deleted successfully');
        fetchDonors();
      } else {
        setMessage(data.error || 'Failed to delete donor');
      }
    } catch (error) {
      console.error('Error deleting donor:', error);
      setMessage('Error deleting donor');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', phone: '', address: '', defaultAmount: '', notes: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            style={styles.backButton}
            onClick={() => router.back()}
          >
            ← Back
          </button>
          <h1 style={styles.title}>🕌 Donors Management</h1>
        </div>
        {!showForm && (
          <button
            style={styles.addButton}
            onClick={() => setShowForm(true)}
          >
            + Add Monthly Donor
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
            <label style={styles.label}>Donor Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter donor name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Default Monthly Amount</label>
            <input
              type="number"
              name="defaultAmount"
              value={formData.defaultAmount}
              onChange={handleInputChange}
              placeholder="Enter default monthly donation amount"
              step="0.01"
              min="10.01"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter address"
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
              {loading ? 'Saving...' : editingId ? 'Update Donor' : 'Add Monthly Donor'}
            </button>
            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={styles.listContainer}>
        {loading && !showForm ? (
          <div style={styles.spinnerContainer}>
            <div style={styles.spinner}></div>
            <span>Loading donors...</span>
          </div>
        ) : donors.length === 0 ? (
          <p style={styles.emptyText}>No donors added yet. Add your first donor!</p>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCell}>Name</div>
              <div style={styles.tableCell}>Phone</div>
              <div style={styles.tableCell}>Default Amount</div>
              <div style={styles.tableCell}>Address</div>
              <div style={styles.tableCell}>Actions</div>
            </div>
            {donors.map((donor) => (
              <div key={donor._id} style={styles.tableRow}>
                <div style={styles.tableCell}>{donor.name}</div>
                <div style={styles.tableCell}>{donor.phone || '-'}</div>
                <div style={styles.tableCell}>{donor.defaultAmount ? `Rs ${donor.defaultAmount.toFixed(2)}` : '-'}</div>
                <div style={styles.tableCell}>{donor.address || '-'}</div>
                <div style={styles.tableCellActions}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEdit(donor)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDelete(donor._id)}
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
    padding: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '24px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    margin: '0',
  },
  addButton: {
    padding: '8px 12px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  message: {
    padding: '16px',
    marginBottom: '24px',
    backgroundColor: '#d1fae5',
    color: '#065f46',
    borderRadius: '6px',
    fontSize: '14px',
    border: '1px solid #a7f3d0',
  },
  form: {
    backgroundColor: '#f9fafb',
    padding: '24px',
    borderRadius: '8px',
    marginBottom: '32px',
    border: '1px solid #e5e7eb',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    color: '#374151',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  formButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  submitButton: {
    padding: '8px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    minWidth: '120px',
  },
  cancelButton: {
    padding: '8px 24px',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    minWidth: '120px',
  },
  listContainer: {
    marginTop: '32px',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '14px',
    padding: '40px',
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
    padding: '16px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    padding: '16px',
    borderBottom: '1px solid #e5e7eb',
    alignItems: 'center',
    fontSize: '14px',
    color: '#4b5563',
  },
  tableCell: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  tableCellActions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  editButton: {
    padding: '4px 12px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  deleteButton: {
    padding: '4px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  spinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  spinnerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '40px',
    color: '#6b7280',
  },
};
