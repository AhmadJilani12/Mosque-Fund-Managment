'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function PastDonationsPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchDonations = async () => {
    try {
      const res = await fetch(`/api/donations?month=${month}&year=${year}`);
      const data = await res.json();
      if (data.success) {
        setDonations(data.donations);
        const sum = data.donations.reduce((acc, d) => acc + d.amount, 0);
        setTotal(sum);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch donations');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [month, year]);

 const generateReceipt = async (donor, donation) => {
  try {
    setLoading(true);

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
              📱 Reference for verification: MAM-${donor._id.slice(-6).toUpperCase()}-${donation._id.slice(-6).toUpperCase()}
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

    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(receiptHTML);
    printWindow.document.close();

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

const downloadTablePDF = async () => {
  if (donations.length === 0) return;

  // Dynamically import jsPDF and autoTable
  const jsPDFModule = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDFModule.jsPDF();
  const img = new Image();

  doc.setFontSize(16);
  doc.setTextColor(9, 30, 66);
  doc.text('Masjid Ashraf ul Masajid - Donations Report', 105, 32, { align: 'center' });

  // Month, Year, Totals
  doc.setFontSize(12);
  doc.setTextColor(55, 65, 81);
  doc.text(`Month: ${month} / Year: ${year}`, 14, 45);
  doc.text(`Total Donations: Rs ${total.toFixed(2)}`, 14, 52);
  doc.text(`Total Donors: ${donations.length}`, 14, 59);

  // Prepare table data
  const tableColumn = ['Donor Name', 'Amount (Rs)', 'Payment Method', 'Date'];
  const tableRows = donations.map(d => [
    d.donorId?.name || d.donor?.name || 'N/A',
    d.amount.toFixed(2),
    d.paymentMethod.charAt(0).toUpperCase() + d.paymentMethod.slice(1),
    new Date(d.date).toLocaleDateString(),
  ]);

  // Generate table using autoTable
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 70,
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const finalY = doc.lastAutoTable.finalY || 70;
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    105,
    finalY + 15,
    { align: 'center' }
  );
  doc.text(
    'Thank you for your generous contributions! May Allah accept from all of us - Ameen',
    105,
    finalY + 22,
    { align: 'center' }
  );

  // Save PDF
  doc.save(`Donations_${month}_${year}.pdf`);
};



  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📜 Past Donations</h1>
      </div>

      {message && <div style={styles.message}>{message}</div>}

      {/* Filters */}
      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>
          Month:
          <input
            type="number"
            value={month}
            min={1}
            max={12}
            onChange={e => setMonth(Number(e.target.value))}
            style={styles.filterInput}
          />
        </label>
        <label style={styles.filterLabel}>
          Year:
          <input
            type="number"
            value={year}
            min={2000}
            onChange={e => setYear(Number(e.target.value))}
            style={styles.filterInput}
          />
        </label>
        <button style={styles.fetchButton} onClick={fetchDonations}>Fetch Donations</button>
        <button style={styles.downloadButton} onClick={downloadTablePDF} disabled={donations.length === 0}>
          Download Full PDF
        </button>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Donations</div>
          <div style={styles.statValue}>Rs {total.toFixed(2)}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Donors</div>
          <div style={styles.statValue}>{donations.length}</div>
        </div>
      </div>

      {/* Donations Grid */}
    {/* Donations Table */}
<div style={{ overflowX: 'auto', minHeight: '200px' }}>
  {loading ? (
    <div style={styles.loaderContainer}>
      <div style={styles.loader}></div>
      <p style={{ color: '#6b7280', marginTop: '12px' }}>Loading donations...</p>
    </div>
  ) : donations.length === 0 ? (
    <div style={styles.emptyText}>No donations found for this period.</div>
  ) : (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Donor Name</th>
          <th style={styles.th}>Amount (Rs)</th>
          <th style={styles.th}>Payment Method</th>
          <th style={styles.th}>Date</th>
          <th style={styles.th}>Receipt</th>
        </tr>
      </thead>
      <tbody>
        {donations.map(d => (
          <tr key={d._id} style={styles.tr}>
            <td style={styles.td}>{d.donorId.name}</td>
            <td style={styles.td}>{d.amount.toFixed(2)}</td>
            <td style={styles.td}>{d.paymentMethod.charAt(0).toUpperCase() + d.paymentMethod.slice(1)}</td>
            <td style={styles.td}>{new Date(d.date).toLocaleDateString()}</td>
            <td style={styles.td}>
              <button
                style={styles.receiptButton}
                onClick={() => generateReceipt(d.donorId, d)}
                disabled={loading}
              >
                📥 Download
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  header: { marginBottom: '32px' },
  title: { fontSize: '32px', fontWeight: 'bold', color: '#1f2937' },
  message: {
    padding: '12px 16px',
    marginBottom: '20px',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '8px',
    border: '1px solid #93c5fd',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  filterLabel: { fontWeight: 600, color: '#374151' },
  filterInput: {
    marginLeft: '6px',
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    width: '80px',
  },
  fetchButton: {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  downloadButton: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statLabel: { fontSize: '14px', color: '#6b7280', marginBottom: '8px' },
  statValue: { fontSize: '24px', fontWeight: 'bold', color: '#22c55e' },
  donorsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
  },
  donorCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  donorInfo: { flex: 1 },
  donorName: { fontSize: '16px', fontWeight: '600', marginBottom: '8px' },
  donorAmount: { fontSize: '18px', fontWeight: 'bold', color: '#22c55e', marginBottom: '4px' },
  donorMeta: { fontSize: '12px', color: '#6b7280' },
  receiptButton: {
    padding: '8px 16px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    height: 'fit-content',
  },
  emptyText: {
    padding: '32px',
    textAlign: 'center',
    color: '#9ca3af',
    backgroundColor: 'white',
    borderRadius: '12px',
  },
  table: {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
},
th: {
  padding: '12px',
  backgroundColor: '#3b82f6',
  color: 'white',
  textAlign: 'left',
  fontWeight: '600',
},
tr: {
  borderBottom: '1px solid #e5e7eb',
},
td: {
  padding: '12px',
  color: '#1f2937',
  fontSize: '14px',
},
table: {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
},
th: {
  padding: '12px 16px',
  backgroundColor: '#3b82f6',
  color: 'white',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '14px',
},
tr: {
  borderBottom: '1px solid #e5e7eb',
},
td: {
  padding: '12px 16px',
  color: '#1f2937',
  fontSize: '14px',
},

};
