const express = require('express');
const db = require('../db');

const router = express.Router();

const insertArticle = db.prepare(`
  INSERT OR IGNORE INTO articles
    (object_id, title, url, author, points, num_comments, created_at, fetched_keyword, fetched_at)
  VALUES (@object_id, @title, @url, @author, @points, @num_comments, @created_at, @fetched_keyword, @fetched_at)
`);

const selectByObjectId = db.prepare(`SELECT * FROM articles WHERE object_id = ?`);
const selectAll = db.prepare(`SELECT * FROM articles ORDER BY points ASC, id ASC`);

router.post('/search', async (req, res, next) => {
  try {
    const { keyword } = req.body || {};
    if (!keyword || !keyword.trim()) return res.status(400).json({ error: 'keyword required' });
    const kw = keyword.trim();

    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(kw)}`;
    const r = await fetch(url);
    if (!r.ok) return res.status(502).json({ error: `HN API error ${r.status}` });
    const data = await r.json();

    const fetchedAt = new Date().toISOString();
    const insertMany = db.transaction((hits) => {
      for (const h of hits) {
        if (!h.objectID) continue;
        insertArticle.run({
          object_id: String(h.objectID),
          title: h.title || h.story_title || '(untitled)',
          url: h.url || h.story_url || '',
          author: h.author || '',
          points: h.points || 0,
          num_comments: h.num_comments || 0,
          created_at: h.created_at || '',
          fetched_keyword: kw,
          fetched_at: fetchedAt,
        });
      }
    });
    const hits = data.hits || [];
    insertMany(hits);

    // Preserve HN Algolia's relevance ordering by mapping hits in returned order
    const articles = hits
      .filter((h) => h.objectID)
      .map((h) => selectByObjectId.get(String(h.objectID)))
      .filter(Boolean);

    res.json({ keyword: kw, articles });
  } catch (e) { next(e); }
});

router.get('/articles', (req, res) => {
  res.json({ articles: selectAll.all() });
});

module.exports = router;
