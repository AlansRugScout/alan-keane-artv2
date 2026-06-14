const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/commission-enquiry', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'aka.ie <noreply@aka.ie>',
      to: 'alan@aka.ie',
      reply_to: email,
      subject: `Commission enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });
    res.json({ success: true });
  } catch(e) {
    console.error('Email error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`aka.ie running on port ${PORT}`));
