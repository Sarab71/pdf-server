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
