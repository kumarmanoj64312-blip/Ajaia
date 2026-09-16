# Submission

## Contents of this folder

- `backend/` — Express REST API (Node.js, MongoDB/Mongoose, JWT auth)
- `frontend/` — React SPA (Vite, TipTap rich-text editor, Tailwind CSS)
- `README.md` — local setup and run instructions
- `ARCHITECTURE.md` — architecture note (stack choices, trade-offs, what was deprioritized)
- `AI_WORKFLOW.md` — AI-native workflow note
- `SUBMISSION.md` — this file
- `screenshots/` — login, dashboard, editor, share modal, new-document draft
  flow, and import modal
- `walkthrough-video-url.txt` — link to the walkthrough video **[NOT YET ADDED — see below]**

## Live product URL

**[NOT YET DEPLOYED]** — currently only runs locally. See "What's incomplete" below.

## Test accounts (seeded)

| Email | Password | Notes |
|---|---|---|
| alice@test.com | password123 | Owns the demo docs, incl. one shared with Bob — use this to test the sharing flow |
| bob@test.com | password123 | Has "edit" access to Alice's shared doc |
| carol@test.com | password123 | Owns a private, unshared document |

Run `npm run seed` in `backend/` to (re)create these against your own database.

## Running locally

See `README.md` for full steps. Short version:

```bash
cd backend && npm install && cp .env.example .env && npm run seed && npm run dev
cd frontend && npm install && cp .env.example .env && npm run dev
```

## What's working

- Document creation, rename, rich-text editing (bold/italic/underline,
  headings, bulleted/numbered lists), autosave, reopening after refresh
- File import (`.txt`/`.md` → new editable document), with validation for
  unsupported types, empty files, and oversized files
- Sharing: owner grants "view" or "edit" access by email, revoke access,
  dashboard distinguishes owned vs. shared documents
- Server-side permission enforcement (verified via an automated test suite
  covering the full owner/edit/view/no-access matrix)
- Persistence in MongoDB, including formatting round-tripping exactly

## What's incomplete

- **Not deployed** — no live URL yet. Needs a MongoDB Atlas cluster, a
  backend host (Render/Railway), and a frontend host (Vercel/Netlify).
- **Walkthrough video not recorded yet.**
- No email notifications when a document is shared (in-app only).
- No `.docx` import support (stated as a limitation in the README/UI).

## What I'd build next with another 2-4 hours

1. Deploy backend + frontend and wire up the live URL.
2. Record the walkthrough video.
3. Add a document version history (even a simple "last 5 saves" list) since
   autosave currently overwrites in place with no undo trail.
4. Add optimistic UI updates for share/revoke instead of waiting on the
   round-trip before updating the list.
