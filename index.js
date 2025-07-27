const express = require('express');
const cors = require('cors');
const pdf = require('html-pdf-node');
const { generateInvoiceHtml } = require('./template');

const app = express();

// CORS for frontend
app.use(cors({
  origin: 'https://cases-frontend.vercel.app', // ✅ Change to your frontend URL
}));

app.use(express.json({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('PDF server is live ✅');
});

// PDF generation route
app.post('/generate-pdf', async (req, res) => {
  const data = req.body;
  const htmlContent = generateInvoiceHtml(data);

  const file = { content: htmlContent };
  const options = { format: 'A4' };

  try {
    const pdfBuffer = await pdf.generatePdf(file, options);
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Invoice_${data.invoiceNumber || 'invoice'}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    res.end(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: 'Failed to generate PDF', details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PDF server running on http://localhost:${PORT}`);
});
