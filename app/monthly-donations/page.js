'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../monthly-donations/donation.css'
function MonthlyDonationsPage() {
    
  const router = useRouter();
  const [donors, setDonors] = useState([]);
  const [monthlyRecords, setMonthlyRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [useDefaultAmount, setUseDefaultAmount] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

 const donation = monthlyRecords.find(r => {
  const recordDonorId = r.donorId?._id || r.donorId;
  return recordDonorId?.toString() === selectedDonor?._id?.toString();
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

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/');
    } else {
      fetchDonors();
      fetchMonthlyRecords();
    }
  }, [router]);

  const fetchDonors = async () => {
    try {
      const res = await fetch('/api/donors');
      const data = await res.json();

      if (data.success) {
        setDonors(data.donors.filter(d => d.defaultAmount && d.defaultAmount > 0));
      } else {
        setMessage('Failed to fetch donors');
      }
    } catch (error) {
      console.error('Error fetching donors:', error);
      setMessage('Error fetching donors');
    }
  };

  const fetchMonthlyRecords = async () => {
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();

      if (data.success) {
        console.log('All donations:', data.donations);
        const records = data.donations.filter(d => {
          const donationDate = new Date(d.date);
          const match = donationDate.getMonth() + 1 === currentMonth && 
                 donationDate.getFullYear() === currentYear &&
                 d.isMonthly;
          console.log('Donation:', d._id, 'Month:', donationDate.getMonth() + 1, 'Year:', donationDate.getFullYear(), 'IsMonthly:', d.isMonthly, 'Match:', match);
          return match;
        });
        console.log('Filtered monthly records:', records);
        setMonthlyRecords(records);
      }
    } catch (error) {
      console.error('Error fetching monthly records:', error);
    }
  };

  // Returns array of { donor, donation } for paid donors
// Returns array of { donor, donation } where donation.donorId is replaced by donor
const getPaidDonors = () => {
  return donors
    .map(donor => {
      const donation = monthlyRecords.find(record => {
        const recordDonorId = record.donorId?._id || record.donorId;
        return recordDonorId?.toString() === donor._id?.toString();
      });

      if (donation) {
        // Replace donation.donorId with the donor object you already have
        return {
          donor,
          donation: {
            ...donation,
            donorId: donor, // now it points to your original donor
          },
        };
      }

      return null;
    })
    .filter(Boolean);
};




  const getUnpaidDonors = () => {
    return donors.filter(donor => {
      const hasPaid = monthlyRecords.some(record => {
        const recordDonorId = record.donorId ? record.donorId._id || record.donorId : null;
        const donorId = donor._id;
        return recordDonorId && recordDonorId.toString() === donorId.toString();
      });
      return !hasPaid;
    });
  };

  const handleMarkAsPaid = async (donor) => {
    const amount = useDefaultAmount ? donor.defaultAmount : parseFloat(paymentAmount);
    
    console.log('Marking as paid:', {
      donorId: donor._id,
      amount,
      useDefaultAmount,
      currentMonth,
      currentYear
    });

    if (!amount || amount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId: donor._id,
          amount: amount,
          date: new Date().toISOString().split('T')[0],
          paymentMethod: 'monthly',
          notes: `Monthly donation for ${currentMonth}/${currentYear}`,
          isMonthly: true,
          month: currentMonth,
          year: currentYear,
        }),
      });

      const data = await res.json();
      console.log('API Response:', data);

      if (data.success) {
        setMessage('Donation recorded successfully!');
        setSelectedDonor(null);
        setPaymentAmount('');
        setUseDefaultAmount(true);
        await fetchMonthlyRecords();
      } else {
        setMessage(data.error || 'Failed to record donation');
      }
    } catch (error) {
      console.error('Error recording donation:', error);
      setMessage('Error recording donation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = async (donor, donation) => {
    try {
      setLoading(true);
      
      // Create a simple receipt HTML
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Donation Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .receipt { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border: 2px solid #22c55e; border-radius: 8px; }
            .header { text-align: center; margin-bottom: 30px; }
            .icon { font-size: 48px; margin-bottom: 10px; }
            h1 { color: #065f46; margin: 0; font-size: 24px; }
            .subtitle { color: #6b7280; margin: 5px 0; }
            .title-section { border-top: 2px solid #22c55e; border-bottom: 2px solid #22c55e; padding: 20px; margin: 20px 0; text-align: center; }
            .title-section h2 { color: #1f2937; margin: 0; font-size: 18px; }
            .details { margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; margin: 10px 0; }
            .label { color: #6b7280; font-weight: bold; }
            .value { color: #1f2937; font-weight: bold; }
            .amount { color: #22c55e; font-size: 18px; }
            .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
            .verified { text-align: center; margin-top: 30px; padding: 15px; background: #f0fdf4; border-radius: 8px; border: 2px solid #22c55e; }
            .verified-icon { font-size: 24px; margin-bottom: 5px; }
            .verified-text { color: #065f46; font-weight: bold; margin: 0; font-size: 14px; }
            .verified-sub { color: #6b7280; font-size: 12px; margin: 5px 0 0 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div class="icon">🕌</div>
              <h1>Masjid Ashraf ul Masajid</h1>
              <p class="subtitle">مسجد خيراتي نظام</p>
            </div>
            <div class="title-section">
              <h2>DONATION RECEIPT</h2>
            </div>
            <div class="details">
              <div class="detail-row">
                <span class="label">Donor Name:</span>
                <span class="value">${donor.name}</span>
              </div>
              <div class="detail-row">
                <span class="label">Amount:</span>
                <span class="value amount">Rs ${donation.amount.toFixed(2)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${new Date(donation.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Method:</span>
                <span class="value">${donation.paymentMethod.charAt(0).toUpperCase() + donation.paymentMethod.slice(1)}</span>
              </div>
              <div class="detail-row">
                <span class="label">Receipt ID:</span>
                <span class="value">${donation._id.slice(-8).toUpperCase()}</span>
              </div>
            </div>
            <div class="qr-section">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                📱  Reference for verification Purpose: MAM-${donor._id.slice(-6).toUpperCase()}-${donation._id.slice(-6).toUpperCase()}
              </p>
            </div>
  <div style="
  display: flex;
  justify-content: center;
  margin-top: 30px;
">
  <div style="
    width: 160px;
    height: 160px;
    border: 5px solid #16a34a;
    border-radius: 50%;
    color: #16a34a;
    font-size: 26px;
    font-weight: 900;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(-15deg);
    opacity: 0.75;
    text-transform: uppercase;
    position: relative;
    box-sizing: border-box;
  ">
    VERIFIED RECEIPT
    <div style="
      position: absolute;
      bottom: 20px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
    ">
      ${new Date().getFullYear()}
    </div>
  </div>
</div>

            <div class="footer">
              <p>Thank you for your generous contribution!</p>
              <p>May Allah accept from all of us - Ameen</p>
              <p style="margin-top: 20px;">Generated: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Open in new window for printing
      const printWindow = window.open('', '', 'width=800,height=600');
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      
      // Auto download as PDF using browser print
      setTimeout(() => {
        printWindow.print();
      }, 250);

      setMessage('Receipt opened for download/print!');
    } catch (error) {
      console.error('Error generating receipt:', error);
      setMessage('Error generating receipt');
    } finally {
      setLoading(false);
    }
  };

  const paidDonors = getPaidDonors();
  const unpaidDonors = getUnpaidDonors();

  console.log('Monthly Donations Page Render:', {
    totalDonors: donors.length,
    monthlyRecords: monthlyRecords.length,
    paidDonors: paidDonors.length,
    unpaidDonors: unpaidDonors.length,
    currentMonth,
    currentYear,
    donors: donors,
    monthlyRecords: monthlyRecords,
  });

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
          <h1 style={styles.title}>📅 Monthly Donations</h1>
        </div>
      </div>

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {donors.length === 0 && (
        <div style={{...styles.message, backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fcd34d'}}>
          ℹ️ No monthly donors found. Please add donors with a default monthly amount from the Donors page first.
        </div>
      )}

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Paid This Month</div>
          <div style={styles.statValue}>{paidDonors.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Pending</div>
          <div style={styles.statValue}>{unpaidDonors.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Collected</div>
          <div style={styles.statValue}>Rs {monthlyRecords.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}</div>
        </div>
      </div>

      {/* Paid Donors Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>✓ Paid This Month ({paidDonors.length})</h2>
        {paidDonors.length === 0 ? (
          <p style={styles.emptyText}>No donors have paid yet</p>
        ) : (
          <div style={styles.donorsList}>
           {paidDonors.map(({ donor, donation }) => (
  <div key={donor._id} style={styles.donorCard}>
    <div style={styles.donorInfo}>
      <h3 style={styles.donorName}>{donor.name}</h3>
      <p>Rs {Number(donation.amount).toFixed(2)}</p>
      <p>{donation.paymentMethod}</p>
    </div>
    <button
      style={styles.receiptButton}
      onClick={() => generateReceipt(donor, donation)}
      disabled={!donation || loading}
    >
      📥 Download Receipt
    </button>
  </div>
))}
          </div>
        )}
      </div>

      {/* Unpaid Donors Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>⏳ Pending Payment ({unpaidDonors.length})</h2>
        {unpaidDonors.length === 0 ? (
          <p style={styles.emptyText}>All donors have paid!</p>
        ) : (
          <div style={styles.donorsList}>
            {unpaidDonors.map(donor => (
              <div key={donor._id} style={styles.donorCard}>
                <div style={styles.donorInfo}>
                  <h3 style={styles.donorName}>{donor.name}</h3>
                  <p style={styles.donorAmount}>Default: Rs {donor.defaultAmount.toFixed(2)}</p>
                  {selectedDonor === donor._id && (
                    <div style={styles.paymentOptions}>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          checked={useDefaultAmount}
                          onChange={() => setUseDefaultAmount(true)}
                        />
                        <span>Use Default Amount (Rs {donor.defaultAmount.toFixed(2)})</span>
                      </label>
                      <label style={styles.radioLabel}>
                        <input
                          type="radio"
                          checked={!useDefaultAmount}
                          onChange={() => setUseDefaultAmount(false)}
                        />
                        <span>Custom Amount</span>
                      </label>
                      {!useDefaultAmount && (
                        <input
                          type="number"
                          placeholder="Enter custom amount"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          step="0.01"
                          min="0"
                          style={styles.customInput}
                        />
                      )}
                    </div>
                  )}
                </div>
                {selectedDonor === donor._id ? (
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.confirmButton}
                      onClick={() => handleMarkAsPaid(donor)}
                      disabled={loading}
                    >
                      {loading ? '...' : '✓ Confirm'}
                    </button>
                    <button
                      style={styles.cancelButtonSmall}
                      onClick={() => {
                        setSelectedDonor(null);
                        setPaymentAmount('');
                        setUseDefaultAmount(true);
                      }}
                      disabled={loading}
                    >
                      ✕ Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    style={styles.markPaidButton}
                    onClick={() => setSelectedDonor(donor._id)}
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          style={styles.scrollTopButton}
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
    </div>
  );
}

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
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
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
  message: {
    padding: '12px 16px',
    marginBottom: '20px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '8px',
    border: '1px solid #93c5fd',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
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
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  donorsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  donorCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  donorInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1f2937',
    margin: '0 0 8px 0',
  },
  donorAmount: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#22c55e',
    margin: '4px 0',
  },
  donorMeta: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  markPaidButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  receiptButton: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  paymentOptions: {
    marginTop: '12px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    borderLeft: '3px solid #3b82f6',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
  },
  customInput: {
    width: '100%',
    padding: '8px',
    marginTop: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  confirmButton: {
    padding: '8px 16px',
    backgroundColor: '#22c55e',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  cancelButtonSmall: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '16px',
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
  scrollTopButton: {
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
  },
};

export default MonthlyDonationsPage;
