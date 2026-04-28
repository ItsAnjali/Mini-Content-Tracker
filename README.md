# Mini Content Tracker

A small full-stack app with three tabs: **Keyword Search** (HN Algolia API), **Stored Articles** (filterable list), and **Image Upload** (local file storage).

Stack: Node.js + Express + SQLite (`better-sqlite3`) on the backend, React + Vite on the frontend.

## Setup (Windows PowerShell)

Requires Node.js 18+.

### 1) Backend

```powershell
cd C:\Users\anjal\Desktop\Content_tracker\backend
npm install
npm start
```

Backend runs at `http://localhost:4000`. SQLite DB (`data.sqlite`) and `uploads/` folder are created automatically.

### 2) Frontend (in a second PowerShell window)

```powershell
cd C:\Users\anjal\Desktop\Content_tracker\frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

The Vite dev server proxies `/api` and `/uploads` to the backend, so no CORS config is needed in the browser.

## Persistence

- Articles + image metadata: `backend/data.sqlite`
- Uploaded files: `backend/uploads/`

Both survive server restarts.

## API

- `GET /api/health` — health check
- `POST /api/search` `{ keyword }` — fetches HN Algolia, upserts into `articles`, returns rows for that keyword
- `GET /api/articles` — all stored articles
- `POST /api/images` (multipart: `image`, `title`, `source`, `tags`) — stores file + metadata
- `GET /api/images` — all stored images
- `GET /uploads/<filename>` — static file access

## Design decisions

- **`better-sqlite3`** for synchronous, zero-config local persistence — perfect for an interview-scope app.
- **`INSERT OR IGNORE` on `object_id`** dedupes articles across repeated keyword searches without extra logic.
- **Vite proxy** keeps the frontend free of CORS configuration during dev.
- **Shared card layout** (`ArticleCard` / `ImageCard`) — same visual structure, different lead element (link vs. thumbnail).
- **Client-side filter** on Tab 2 keeps the backend simple; data volume is tiny.
- **Minimal CSS**, no UI library, no state library.

## What I would do with another hour

- Pagination + server-side filtering on `/api/articles` for larger datasets.
- Delete buttons for articles and images, with file cleanup for images.
- A small toast for success/error instead of inline blocks.
- Drag-and-drop on the image upload form.
- A handful of unit tests for the article upsert and image route.
