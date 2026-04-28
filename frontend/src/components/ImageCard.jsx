import React from 'react';
import { apiUrl } from '../api.js';

export default function ImageCard({ image }) {
  const { title, source, tags, file_path, uploaded_at } = image;
  return (
    <div className="card">
      <img className="thumb" src={apiUrl(file_path)} alt={title} />
      <div className="card-body">
        <h3 className="card-title">{title || '(untitled)'}</h3>
        <div className="card-meta">
          <span>{source || 'unknown source'}</span>
        </div>
        <div className="card-footer">
          {tags && tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
            <span key={t} className="badge">{t}</span>
          ))}
          <span className="muted">{uploaded_at ? new Date(uploaded_at).toLocaleString() : ''}</span>
        </div>
      </div>
    </div>
  );
}
