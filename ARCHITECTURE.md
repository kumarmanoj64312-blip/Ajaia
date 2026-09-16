# Architecture Notes

## Stack & layering

Express backend with a strict `routes → controllers → services → models`
layering: controllers only read `req`/write `res`, all business rules live in
`services/` with no HTTP awareness, and `models/` are pure Mongoose schemas.
This keeps permission logic and content-import logic unit-testable without
spinning up HTTP, while `tests/share.permission.test.js` still exercises the
same rules end-to-end through Supertest for confidence that the wiring (routes
+ middleware) enforces what the service layer assumes.

`server.js` (process bootstrap: connect DB, `app.listen`) is separated from
`app.js` (pure Express app definition) specifically so tests can `require('../app')`
and hit real routes with Supertest without opening a real DB connection or
port — the in-memory Mongo instance is wired up separately per test file.

## Content storage

Documents store the TipTap/ProseMirror JSON document directly in MongoDB as
`content: Mixed`. Converting to/from HTML or Markdown for storage was
considered, but round-tripping through a lossy intermediate format risks
subtly corrupting formatting on every save/load cycle. Storing the editor's
native tree means "what you see is exactly what gets persisted," at the cost
of the stored format being tied to TipTap's schema — an acceptable trade for
this scope, and Mongo's schemaless documents make it a natural fit.

## Sharing & permissions model

Rather than a separate join collection, each `Document` embeds a
`sharedWith: [{ user, permission }]` array. For the read/write patterns this
app needs (load a document and know immediately who can see it; list "shared
with me" via a single indexed query on `sharedWith.user`), embedding avoids a
join and keeps the whole access-control state visible on the object being
protected. Permission is computed once, server-side, via
`Document.permissionFor(userId)` and ranked (`view < edit < owner`) in
`permission.middleware.js`, so every document route enforces access the same
way — the frontend's read-only editor state is just a UI reflection of a
decision the server already made and re-validates on every request.

This was the highest-risk logic to get subtly wrong (e.g. a "view" share
being able to mutate content, or a non-collaborator reading a document by
guessing its ID), so it's covered by an end-to-end test exercising the full
owner/edit/view/none matrix over real HTTP requests, not just unit-level
service calls.

## What was deprioritized, and why

- **No OAuth/real identity provider** — seeded users + a real login form
  issuing JWTs demonstrates the auth-gated flows (ownership, sharing) without
  the scope of a production identity system, which isn't what this exercise
  is evaluating.
- **No real-time collaborative editing (no CRDTs/operational transform)** —
  autosave-on-debounce satisfies "edit in a browser, persist reliably";
  concurrent multi-cursor editing is a materially larger system (conflict
  resolution, presence, websockets) than this scope calls for.
- **Import limited to `.txt`/`.md`** — covers the "file upload becomes an
  editable document" requirement with a straightforward, testable text
  transform. `.docx` parsing pulls in a much heavier dependency (OOXML
  parsing) for the same product story; it's called out explicitly as
  unsupported in the UI and README rather than silently failing.
- **No version history / comments / field-level permissions** — the two
  permission levels (view/edit) plus ownership are enough to "demonstrate
  clear intent and working logic" per the brief; finer-grained ACLs would add
  surface area without changing what's being evaluated.
