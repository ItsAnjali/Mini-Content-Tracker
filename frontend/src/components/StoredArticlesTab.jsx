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

  if (loading) return <div className="empty">Loading…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <div className="panel">
        <h2>Stored Articles</h2>
        <p className="hint">{articles.length} saved · filter by title, author, keyword, or URL.</p>
        <input
          className="filter"
          placeholder="Filter…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {filtered.length > 0 ? (
        <div className="grid">
          {filtered.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      ) : (
        <div className="empty">
          {articles.length === 0 ? 'No articles yet — run a search first.' : 'No articles match your filter.'}
        </div>
      )}
    </div>
  );
}
