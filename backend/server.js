import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

app.use('/contracts', express.static('contracts'));
app.use('/uploads', express.static('uploads'));

// Route to receive signature data and return signed PDF
app.post('/sign', upload.none(), async (req, res) => {
  try {
    const signatureDataURL = req.body.signature.replace(/^data:image\/png;base64,/, '');
    console.log('Received signature data URL:', signatureDataURL);
    const signatureImageBytes = Buffer.from(signatureDataURL, 'base64');

    // Load original PDF
    const existingPdfBytes = fs.readFileSync('./contracts/contract.pdf');
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pngImage = await pdfDoc.embedPng(signatureImageBytes);
    const page = pdfDoc.getPage(pdfDoc.getPageIndices().length-1);

    console.log('Signature image embedded successfully');

    // Draw signature on PDF (adjust position as needed)
    page.drawImage(pngImage, {
      x: page.getWidth() - 200,
      y: 100,
      width: 150,
      height: 50,
    });

    page.drawText('Janith Bandara\nAddress Line 1, Adress Line 2, City', {
        x: page.getWidth() - 200,
        y: 80,
        size: 12,
        maxWidth: 200,
        paragraphSpacing: 1,
        lineSpacing: 1,
    })

    console.log('Signature drawn on PDF');

    const pdfBytes = await pdfDoc.save();

    // ✅ Save to uploads folder
    const filePath = `./uploads/signed_${Date.now()}.pdf`;
    fs.writeFileSync(filePath, pdfBytes);
    console.log('PDF saved successfully');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            return res.end('Error reading file');
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(data);
    });

    // res.setHeader('Content-Disposition', 'attachment; filename=signed_contract.pdf');
    // res.setHeader('Content-Type', 'application/pdf');
    // res.send(pdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing contract');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
