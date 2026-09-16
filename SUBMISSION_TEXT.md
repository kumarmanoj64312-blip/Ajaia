# Collab Docs — Submission

A collaborative document editor: create and edit rich-text documents in the
browser, import `.txt`/`.md` files as new documents, and share documents with
other users at "view" or "edit" permission.

## Live URLs

- Frontend: `<ADD YOUR VERCEL URL HERE>`
- Backend API: `<ADD YOUR RENDER URL HERE>`

## Test accounts (seeded)

| Email | Password | Notes |
|---|---|---|
| alice@test.com | password123 | Owns the demo docs, incl. one shared with Bob — use this to test sharing |
| bob@test.com | password123 | Has "edit" access to Alice's shared doc |
| carol@test.com | password123 | Owns a private, unshared document |

## Stack

- **Backend**: Node.js + Express, layered `routes → controllers → services →
  models`, MongoDB/Mongoose, JWT auth
- **Frontend**: React (Vite), TipTap rich-text editor, Tailwind CSS

## Running locally

```bash
cd backend && npm install && cp .env.example .env && npm run seed && npm run dev
cd frontend && npm install && cp .env.example .env && npm run dev
```

Full details in `README.md`.

## What's working

- Create, rename, and delete documents
- Rich-text editing: bold, italic, underline, headings (H1–H3), bulleted and
  numbered lists, with autosave and reload-safe persistence
- Documents are created only on explicit confirmation (a "Create" step),
  not the moment you click "New" — avoids littering the dashboard with empty
  drafts
- File import: `.txt`/`.md` → new editable document, with validation for
  unsupported types, empty files, and oversized files
- Sharing: owner grants "view" or "edit" access by email, can revoke it;
  dashboard visually separates owned vs. shared documents
- Server-side permission enforcement for the full owner/edit/view/no-access
  matrix, covered by an automated test suite
- MongoDB persistence, with TipTap's native JSON stored directly so
  formatting round-trips exactly

## What's intentionally deprioritized

- No OAuth/real identity provider (seeded users + a real login form issuing
  JWTs demonstrates the same access-control flows without that scope)
- No real-time multi-cursor collaboration (autosave-on-debounce covers "edit
  in a browser, persist reliably" without the added complexity of
  conflict resolution / presence / websockets)
- No `.docx` import (stated as a limitation in the README and the import UI)
- No email notifications on share (in-app only)

## Architecture note (short version — full version in `ARCHITECTURE.md`)

- **Layering**: controllers only touch `req`/`res`; all business rules live
  in `services/` with no HTTP awareness; `models/` are pure Mongoose schemas.
  This keeps permission logic unit-testable and is why `server.js`
  (bootstraps the process) is split from `app.js` (pure Express app) — tests
  hit `app.js` directly via Supertest without a real port or DB connection.
- **Content storage**: documents store the TipTap/ProseMirror JSON tree
  as-is (`content: Mixed`) rather than converting to/from HTML or Markdown,
  so formatting can't be lossily corrupted on save/load.
- **Sharing model**: each document embeds `sharedWith: [{ user, permission }]`
  rather than a separate join collection, since the access-control decision
  needs to be visible on the object it's protecting. Permission is computed
  once server-side via `Document.permissionFor(userId)` and ranked
  (`view < edit < owner`), enforced identically on every document route.

## AI workflow note (short version — full version in `AI_WORKFLOW.md`)

Built end-to-end with Claude Code (Sonnet 5) as the primary coding agent —
writing every file, running the test suites, and driving the app in a real
headless browser (Playwright) to verify behavior rather than trusting
generated code by inspection alone.

Concrete value beyond typing code faster: it caught and fixed a real
permission bug (`Document.permissionFor()` silently returned `null` for
everyone after `.populate()` changed `owner` from an ObjectId to a full user
object — found because an automated test failed, not by reading the code),
a JSDoc comment that broke Jest's parser, a stale-autosave-status bug across
document navigation, and swapped out two dependencies (`multer`, `tiptap`)
after `npm audit` flagged real CVEs in the versions it first generated.
Everything shipped was verified by actually running it: the automated test
suites, direct `curl` calls against the live API, and Playwright driving the
full user flow (login → create → format text → import a file → share →
permission-check) with console-error checking and screenshots at each step.

## Known limitations for reviewers

- Free-tier hosting (Render/Vercel) — the backend may take ~30–60s to
  respond on first request after being idle (cold start).
