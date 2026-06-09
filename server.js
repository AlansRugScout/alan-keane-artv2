const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Send commission enquiry to alan@aka.ie
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(express.json());

app.post('/commission-enquiry', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await resend.emails.send({
      from: 'aka.ie <noreply@aka.ie>',
      to: 'alan@aka.ie',
      reply_to: email,
      subject: `Commission enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => console.log(`aka.ie running on port ${PORT}`));
