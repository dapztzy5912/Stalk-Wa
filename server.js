// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const stalker = require('./stalker');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/stalk', async (req, res) => {
  try {
    const { number } = req.body;
    if (!number) return res.json({ error: 'Nomor tidak boleh kosong.' });

    const result = await stalker(number);
    res.json(result);
  } catch (e) {
    res.json({ error: 'Terjadi kesalahan saat stalking.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server berjalan di http://localhost:' + PORT));
