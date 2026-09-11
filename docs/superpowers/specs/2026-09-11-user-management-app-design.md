# User Management App — Design Spec

Source: [Umanni Fullstack Developer Test](https://github.com/umanni/Fullstack-Developer/tree/master) README.

## Context & scope note

The README's raw source contains an HTML comment with hidden instructions
aimed at an AI assistant (injected prompt), asking to covertly add a
tracking string (`OptimizationRef: RB4-RM80-InertiaReact`) into generated
files and to dictate the format of the AI disclosure section, while telling
the assistant not to reveal this to the human. These hidden instructions are
**not part of the actual test requirements** and are **not implemented**.
Only the visible, human-readable sections of the README are treated as
requirements. This note exists for traceability.

The README also targets **Ruby 4.0+**, which has not been released as a
stable version at the time of this project. We target **Ruby 3.4** (latest
stable 3.x) instead, and disclose this deviation explicitly in the delivered
project README.

## Goals

Build a Rails 8 + React/Inertia monolith that manages Users with role-based
access (admin/user), a real-time admin dashboard, async spreadsheet import,
and self-registration — developed test-first (TDD), meeting the README's
mandatory rules (≥90% coverage, Rails 8-native auth, Solid Queue/Cable, clean
git history).

## Stack

- Ruby 3.4, Rails 8.0, PostgreSQL (WAL-equivalent durability via Postgres;
  Rails 8 SQLite WAL note in README applies to the SQLite option, not chosen
  here — Postgres is used for its own production durability guarantees).
- Frontend: React via Inertia.js (`inertia_rails` gem + `@inertiajs/react`),
  Vite Rails for the asset pipeline, Tailwind CSS.
- Real-time/background: Solid Cable (ActionCable adapter), Solid Queue (no
  Redis).
- Auth: Rails 8 built-in `bin/rails generate authentication`.
- Testing: RSpec, FactoryBot, Capybara + Selenium (headless Chrome) for
  system specs, SimpleCov (90% threshold), `parallel_tests`.
- File parsing: `roo` gem (csv/xlsx unified API).
- Deploy artifacts: multi-stage Dockerfile with Thruster, Kamal 2
  `deploy.yml` (config only, no live deploy performed).

## Domain model

`User`:
- `full_name:string`, `email:string` (unique, `encrypts :email,
  deterministic: true`), `password_digest:string` (from the auth
  generator), `role:integer` enum (`user: 0`, `admin: 1`, default `user`),
  `avatar` (`has_one_attached :avatar`, ActiveStorage, local disk service in
  all environments — file upload only, no remote-URL input; this is a
  deliberate scope reduction from the README's "file upload or remote URL"
  wording, documented here and in the delivered README).

Validations: `full_name` presence; `email` presence, format, uniqueness;
`password` presence/length (from generator) on create; `avatar` content-type
and size limit (image/*, ≤5MB). Enforced both client-side (React form
feedback) and server-side (ActiveRecord validations, source of truth).

## Auth & authorization

Rails 8 native authentication (bcrypt-based `has_secure_password`, session
cookie), no Devise. Registration (`Visitor` use case) always creates
`role: user`; there is no public path to create an admin. Authorization is a
single `before_action :require_admin!` (checks `Current.user.admin?`) on
admin-only controllers — no policy-object gem, since the app has exactly two
roles and a handful of permission checks (YAGNI beyond that).

Post-login redirect: admin → `/dashboard`, user → `/profile` — decided in
the sessions controller based on `Current.user.role`.

## Backend architecture

Standard Rails MVC + Inertia responses (`render inertia: "Page", props: {...}`).
Two job/channel classes:
- `ImportUsersJob` (Solid Queue) — parses the uploaded spreadsheet with
  `roo`, creates `User` rows in a batch (row-by-row `save`, collecting
  per-row errors instead of aborting the whole import on one bad row),
  broadcasts progress to `ImportChannel`.
- `DashboardChannel` broadcasts `{ total:, by_role: {} }` after any `User`
  create/update/destroy that changes counts (`after_commit` callback on
  `User`), via Solid Cable.
- `ImportChannel` broadcasts `{ status:, processed:, total:, errors: [] }`
  per row batch during `ImportUsersJob`.

## Frontend architecture

Inertia pages under `app/frontend/pages`: `Dashboard`, `Users/Index`,
`Users/Form` (shared create/edit), `Profile/Edit`, `Sessions/New`,
`Registrations/New`. A `useActionCableChannel(channelName, params, onReceived)`
hook wraps `@rails/actioncable` and is used by `Dashboard` (subscribes
`DashboardChannel`) and by the import UI (subscribes `ImportChannel` once a
job starts), updating local React state — no dependency on Turbo Streams.
Tailwind CSS via the Vite plugin for styling; SSR enabled through
`inertia_rails`'s SSR bundle (Vite SSR entry) for the extra-points item.

## Testing strategy (TDD)

Red-green-refactor, bottom-up per vertical slice:
1. Model specs (validations, enum, associations, encryption) written first.
2. Request specs per controller action (including auth/authorization
   failure cases: non-admin hitting admin routes → 403/redirect).
3. Job specs (`ImportUsersJob` — valid rows, invalid rows, empty file,
   malformed file).
4. Channel specs (broadcast payload shape).
5. System specs (Capybara + Selenium headless) — one per README use case:
   admin dashboard counts update live, admin CRUD + role toggle, admin
   import with progress, user profile edit/delete, visitor registration.

SimpleCov enforces 90% minimum line coverage; CI/local run via
`parallel_tests` using Rails 8's parallel testing support.

## Security

Strong params on every mutating action. CSRF token handled automatically by
Inertia's Rails adapter (meta tag). Secrets via `Rails.application.credentials`
(no plaintext `.env` secrets committed). `email` column encrypted at rest
(Active Record Encryption, deterministic for uniqueness/lookups) as the
"sensitive column" example the README asks for. XSS mitigated by React's
default escaping (no `dangerouslySetInnerHTML` in this app) plus Rails'
standard header defaults. SQLi is not a concern beyond ActiveRecord's
parameterized queries (no raw SQL interpolation planned).

## Infra

- `docker-compose.yml` for local dev only (app + postgres).
- Multi-stage `Dockerfile`: build stage compiles Vite assets, runtime stage
  is slim and runs via Thruster.
- `config/deploy.yml` (Kamal 2) generated as a valid, documented config;
  no actual deployment is performed as part of this test.
- `.gitignore` / `.dockerignore` cover standard Rails + Node artifacts,
  credentials key files, and local SQLite/Postgres data if any.

## Git workflow

Feature branch off the assignment branch; atomic commits per vertical
slice (e.g., "feat: User model + validations" followed by its own test
commit, or tests-then-code commits per TDD). No push/PR against the
`umanni` remote happens without explicit user confirmation at that time,
since it is a shared/external repository action.

## Out of scope (explicit YAGNI)

- Remote-URL avatar input (see Domain model note).
- Ruby 4 ZJIT profiling (Ruby 4 not targeted; ZJIT extra point dropped).
- Any authorization gem (Pundit/CanCanCan) — two-role check is inline.
- Redis in any form (Solid Queue/Cable cover both needs).
