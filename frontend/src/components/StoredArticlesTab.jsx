import React, { useEffect, useMemo, useState } from 'react';
import { getArticles } from '../api.js';
import ArticleCard from './ArticleCard.jsx';

export default function StoredArticlesTab() {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getArticles()
      .then((d) => setArticles(d.articles || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((a) =>
      [a.title, a.author, a.fetched_keyword, a.url]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [articles, filter]);

  if (loading) return <p>Loading…</p>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <input
        className="filter"
        placeholder="Filter by title, author, keyword, or URL"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <div className="grid">
        {filtered.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
      {filtered.length === 0 && <p className="muted">No articles match.</p>}
    </div>
  );
}
