import React, { useState } from 'react';
import { searchKeyword } from '../api.js';
import ArticleCard from './ArticleCard.jsx';

export default function KeywordSearchTab() {
  const [keyword, setKeyword] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true); setError('');
    try {
      const data = await searchKeyword(keyword.trim());
      setArticles(data.articles || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <form className="row" onSubmit={onSubmit}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. rust"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="grid">
        {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
      {!loading && articles.length === 0 && <p className="muted">No results yet.</p>}
    </div>
  );
}
