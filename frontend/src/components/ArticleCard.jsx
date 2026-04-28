import React from 'react';

export default function ArticleCard({ article }) {
  const { title, url, author, points, num_comments, fetched_keyword, fetched_at } = article;
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">
          {url ? <a href={url} target="_blank" rel="noreferrer">{title}</a> : title}
        </h3>
        <div className="card-meta">
          <span>by {author || 'unknown'}</span>
          <span>{points ?? 0} pts</span>
          <span>{num_comments ?? 0} comments</span>
        </div>
        <div className="card-footer">
          {fetched_keyword && <span className="badge">{fetched_keyword}</span>}
          <span className="muted">{fetched_at ? new Date(fetched_at).toLocaleString() : ''}</span>
        </div>
      </div>
    </div>
  );
}
