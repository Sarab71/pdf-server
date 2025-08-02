exports.generateInvoiceHtml = (data) => {
  const { invoiceNumber, customer, items, grandTotal, date, totalQty } = data;
  const roundedGrandTotal = Math.round(grandTotal);

  const rows = items?.map((item, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${item.modelNumber}</td>
      <td>${item.quantity}</td>
      <td>${item.rate}</td>
      <td>${item.discount === '' ? '' : item.discount + '%'}</td>
      <td>₹${item.totalAmount}</td>
    </tr>
  `).join('') || '';

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; }
          h1 { text-align: center; font-size: 18px; margin-bottom: 10px; }
          .details { display: flex; justify-content: space-between; margin-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #999; padding: 4px; text-align: center; font-size: 11px; }
          .total { text-align: right; margin-top: 10px; font-size: 13px; }
        </style>
      </head>
      <body>
        <h1>RECEIPT</h1>
        <div class="details">
          <div>
            <p><strong>Receipt #:</strong> ${invoiceNumber}</p>
            <p><strong>Date:</strong> ${date}</p>
          </div>
          <div style="text-align:right">
            <p><strong>Customer:</strong> ${customer?.name || ''}</p>
            <p><strong>Address:</strong> ${customer?.address || ''}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Model No.</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Disc</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2"><strong>Total</strong></td>
              <td><strong>${totalQty}</strong></td>
              <td colspan="3"><strong>Grand Total: ₹${roundedGrandTotal}</strong></td>
            </tr>
          </tfoot>
        </table>
      </body>
    </html>
  `;
};

exports.generateStatementHtml = (customerName, transactions) => {
  const rows = transactions.map((txn) => {
    const date = new Date(txn.date).toLocaleDateString();
    const debit = txn.debit ? txn.debit.toFixed(2) : '';
    const credit = txn.credit ? txn.credit.toFixed(2) : '';
    const balance = txn.balance.toFixed(2);
    const desc = txn.invoiceNumber
      ? `Invoice #${txn.invoiceNumber}`
      : txn.description || txn.particulars || 'Payment';

    return `<tr>
      <td>${date}</td>
      <td>${desc}</td>
      <td style="text-align:right">${debit}</td>
      <td style="text-align:right">${credit}</td>
      <td style="text-align:right">${balance}</td>
    </tr>`;
  }).join('');

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 10px; font-size: 12px; }
          h2 { margin-bottom: 20px; }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 6px;
            text-align: left;
          }
          th {
            background-color: #f0f0f0;
          }
        </style>
      </head>
      <body>
        <h2>Statement of ${customerName}</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Particulars</th>
              <th>Debit (₹)</th>
              <th>Credit (₹)</th>
              <th>Balance (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </body>
    </html>
  `;
};