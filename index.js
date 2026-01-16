const express = require('express');
const cors = require('cors');
const pdf = require('html-pdf-node');
const { generateInvoiceHtml, generateStatementHtml } = require('./template');

const app = express();
const allowedOrigins = [
  'https://casesbilling.vercel.app',  // production
  'http://localhost:3000',            // development
  'https://cases-demo.vercel.app',    // demo site
];
// CORS for frontend
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
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

app.post('/generate-statement', async (req, res) => {
  const { customerName, transactions } = req.body;
  const htmlContent = generateStatementHtml({customerName, transactions});

  const file = { content: htmlContent };
  const options = { format: 'A4' };

  try {
    const pdfBuffer = await pdf.generatePdf(file, options);
    const filename = `Statement_${customerName.replace(/\s+/g, '_')}.pdf`;

    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdfBuffer.length
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
