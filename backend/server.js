const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const articlesRouter = require('./routes/articles');
const imagesRouter = require('./routes/images');

const app = express();
const PORT = process.env.PORT || 4000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api', articlesRouter);
app.use('/api', imagesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
