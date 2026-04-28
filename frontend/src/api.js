export async function searchKeyword(keyword) {
  const r = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keyword }),
  });
  if (!r.ok) throw new Error((await r.json()).error || 'Search failed');
  return r.json();
}

export async function getArticles() {
  const r = await fetch('/api/articles');
  if (!r.ok) throw new Error('Failed to load articles');
  return r.json();
}

export async function uploadImage({ title, source, tags, file }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('source', source);
  fd.append('tags', tags);
  fd.append('image', file);
  const r = await fetch('/api/images', { method: 'POST', body: fd });
  if (!r.ok) throw new Error((await r.json()).error || 'Upload failed');
  return r.json();
}

export async function getImages() {
  const r = await fetch('/api/images');
  if (!r.ok) throw new Error('Failed to load images');
  return r.json();
}
