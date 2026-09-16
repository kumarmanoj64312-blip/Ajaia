# Collab Docs

A small full-stack collaborative document editor: create and edit rich-text
documents in the browser, import `.txt`/`.md` files as new documents, and
share documents with other users at "view" or "edit" permission.

- **Backend**: Node.js + Express + MongoDB (Mongoose), JWT auth
- **Frontend**: React (Vite) + TipTap rich-text editor + Tailwind CSS

See [ARCHITECTURE.md](./ARCHITECTURE.md) for design decisions and trade-offs.

## Features

- Create, rename, and delete documents
- Rich-text editing: bold, italic, underline, headings (H1-H3), bulleted and
  numbered lists, with autosave
- Import a **.txt** or **.md** file as a new document (max 5MB). Other file
  types are rejected with a clear error — `.docx` is intentionally not
  supported for this scope.
- Share a document with another user by email, at "can view" or "can edit"
  permission; revoke access at any time
- Dashboard clearly separates "My documents" (owned) from "Shared with me"

## Project structure

```
ajaia/
  backend/    # Express REST API (server.js, app.js, routes/controllers/services/models)
  frontend/   # React SPA (Vite)
```

## Prerequisites

- Node.js 18+
- A MongoDB instance — either local (`mongod` running on default port) or a
  free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env      # then edit MONGO_URI / JWT_SECRET if needed
npm run seed               # creates 3 demo users + 3 demo documents
npm run dev                 # starts the API on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL should point at the backend
npm run dev                 # starts the app on http://localhost:5173
```

Open http://localhost:5173 and log in with one of the seeded accounts below.

## Seeded demo accounts

All seeded users share the password `password123`.

| Email             | Notes                                                  |
|-------------------|---------------------------------------------------------|
| alice@test.com    | Owns "Welcome to Collab Docs" and a doc shared with Bob |
| bob@test.com      | Has "edit" access to Alice's shared doc                 |
| carol@test.com    | Owns a private, unshared document                       |

You can also register a brand-new account from the login screen.

## Running tests

Backend (Jest + Supertest, using an in-memory MongoDB instance — no real DB
needed):

```bash
cd backend
npm test
```

The permission test suite (`tests/share.permission.test.js`) is the most
important one — it exercises the full owner/edit/view/no-access matrix over
real HTTP requests.

Frontend (Vitest):

```bash
cd frontend
npm test
```

## Supported file types for import

Only **.txt** and **.md** files can be imported, up to 5MB. Markdown headings
(`#`, `##`, `###`), bullet lists (`-`/`*`), numbered lists (`1.`), **bold**,
and *italic* are converted into the editor's native rich-text format on
import. `.docx` and other formats are rejected with a clear error message
in the UI.

## Deployment

- **Backend**: deploy to Render or Railway, with a MongoDB Atlas connection
  string as `MONGO_URI`. Run `npm run seed` once against the production
  database (e.g. via a one-off shell/job) to create the demo accounts.
- **Frontend**: deploy to Vercel or Netlify, setting `VITE_API_URL` to the
  deployed backend's `/api` URL, and add that frontend URL as `CLIENT_ORIGIN`
  in the backend's environment so CORS allows it.

Live URL: _add your deployed URL here once deployed_.
