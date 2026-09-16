# AI-Native Workflow Note

## AI tools used

Claude Code (Sonnet 5) end-to-end — as the primary coding agent (writing every
backend/frontend file, running the test suites, running the app), not as an
autocomplete layer on top of hand-written code. No other AI tools were used.

## Where AI materially sped up the work

- **Scaffolding a layered backend from a spec.** Given the routes/controllers/
  services/models constraint, Claude generated the full Express skeleton
  (config, middleware, validators, routes) consistently in one pass, which
  would normally be an hour of boilerplate before any real logic starts.
- **The Markdown → TipTap JSON importer.** Writing a small hand-rolled
  parser (headings, lists, bold/italic) instead of pulling in a heavy
  markdown-AST dependency was an AI-proposed trade-off that kept the import
  feature dependency-free.
- **Iterative UI polish from screenshots.** For the UI pass, I described
  problems in plain language ("too much empty space," "needs a background
  color") and Claude diagnosed the actual CSS/layout cause, fixed it, and
  re-screenshotted to confirm — much faster than describing exact Tailwind
  classes myself.
- **Root-causing environment issues**, not just code bugs — see below.

## What AI-generated output I changed or rejected

- **Dependency versions**: the first pass pulled in `multer@1.x` and
  `tiptap@2.x`. `npm audit` flagged real CVEs (multer 1.x, prototype
  pollution in tiptap core), so both were upgraded to current majors
  (`multer@2`, `tiptap@3`) rather than left as initially generated.
- **A real permission bug**: `Document.permissionFor()` compared a raw
  ObjectId against `this.owner`, but several call sites populate `owner`
  first — after populate, that comparison silently returned `null` for
  everyone, including the owner. This wasn't caught by reading the code; it
  only surfaced when the actual test suite ran and two permission assertions
  failed. Fixed by making the comparison populate-aware.
- **A syntax bug hiding in a comment**: a JSDoc block contained the literal
  text `*/`, which closed the comment early and broke Jest's parser. Caught
  by running `npm test`, not by inspection.
- **An autosave UX bug**: opening a second document reused the same page
  component instance, so a stale "Saving…" status from the previous document
  could bleed into the next one. I rejected the first "fix" (a naive status
  reset) once I traced the real cause and had Claude implement a
  content-diff guard instead, which also protects against TipTap's own
  editor-load normalization triggering a spurious save.
- **A CORS design choice**: the initial implementation hardcoded one
  `CLIENT_ORIGIN`. After it broke twice from Vite's dev server landing on a
  different port, I had it rewritten to accept any `localhost`/`127.0.0.1`
  origin in development while staying strict in production — fixing the
  recurring symptom instead of the port each time.

## How I verified correctness, UX quality, and implementation reliability

- **Automated tests, run, not just written**: backend Jest/Supertest suite
  (including a full owner/edit/view/no-access permission matrix over real
  HTTP requests, using an in-memory MongoDB instance) and a frontend Vitest
  suite, both executed and passing before being called done.
- **Real HTTP verification**: used `curl` against the running API to confirm
  auth, sharing, upload validation (unsupported type, empty file, oversized
  file), and CORS headers directly — not inferred from code.
- **Headless-browser end-to-end verification**: used Playwright to actually
  drive the app in a real browser for every feature (login, create, rich-text
  formatting, autosave, file import, sharing, permission enforcement),
  screenshotting each result and checking the browser console for errors,
  rather than trusting that generated UI code renders correctly.
- **Direct database inspection**: queried MongoDB directly when a UI
  interaction produced an unexpected error (e.g., confirming a "no user
  found" share error was correct behavior, not a bug, by checking the users
  collection).
