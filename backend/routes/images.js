const path = require('path');
const express = require('express');
const multer = require('multer');
const db = require('../db');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  },
});
const upload = multer({ storage });

const insertImage = db.prepare(`
  INSERT INTO images (title, source, tags, file_path, uploaded_at)
  VALUES (?, ?, ?, ?, ?)
`);
const selectAll = db.prepare(`SELECT * FROM images ORDER BY uploaded_at DESC`);

router.post('/images', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'image file required' });
  const { title = '', source = '', tags = '' } = req.body;
  const filePath = `/uploads/${req.file.filename}`;
  const uploadedAt = new Date().toISOString();
  const info = insertImage.run(title, source, tags, filePath, uploadedAt);
  res.json({
    image: {
      id: info.lastInsertRowid,
      title, source, tags,
      file_path: filePath,
      uploaded_at: uploadedAt,
    },
  });
});

router.get('/images', (req, res) => {
  res.json({ images: selectAll.all() });
});

module.exports = router;
