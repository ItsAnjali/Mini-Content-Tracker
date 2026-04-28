import React, { useEffect, useState } from 'react';
import { getImages, uploadImage } from '../api.js';
import ImageCard from './ImageCard.jsx';

export default function ImageUploadTab() {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    try { const d = await getImages(); setImages(d.images || []); }
    catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) { setError('Please choose a file'); return; }
    setBusy(true); setError('');
    try {
      await uploadImage({ title, source, tags, file });
      setTitle(''); setSource(''); setTags(''); setFile(null);
      e.target.reset();
      await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <form className="upload-form" onSubmit={onSubmit}>
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} />
        <input placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit" disabled={busy}>{busy ? 'Uploading…' : 'Upload'}</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="grid">
        {images.map((img) => <ImageCard key={img.id} image={img} />)}
      </div>
      {images.length === 0 && <p className="muted">No images yet.</p>}
    </div>
  );
}
