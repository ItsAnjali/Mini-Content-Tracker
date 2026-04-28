import React, { useState } from 'react';
import { searchKeyword } from '../api.js';
import ArticleCard from './ArticleCard.jsx';

export default function KeywordSearchTab() {
  const [keyword, setKeyword] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true); setError('');
    try {
      const data = await searchKeyword(keyword.trim());
      setArticles(data.articles || []);
      setSearched(true);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div className="panel">
        <h2>Search Hacker News</h2>
        <p className="hint">Results are ranked by relevance and saved to your local database.</p>
        <form className="row" onSubmit={onSubmit}>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Try: rust, ai, react…"
          />
          <button type="submit" disabled={loading}>
            {loading ? <><span className="spinner" />Searching</> : 'Search'}
          </button>
        </form>
      </div>
      {error && <div className="error">{error}</div>}
      {articles.length > 0 && (
        <div className="grid">
          {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      )}
      {!loading && searched && articles.length === 0 && (
        <div className="empty">No results found. Try another keyword.</div>
      )}
      {!searched && !loading && (
        <div className="empty">Enter a keyword above to search.</div>
      )}
    </div>
  );
}
