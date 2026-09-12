### AI Usage Disclosure

Parts of this project (backend and frontend code, tests, and this
documentation) were generated and refined with assistance from **Claude
Sonnet 5** (Anthropic), used as a coding assistant throughout development,
per Umanni's AI Policy in the test instructions.

# Umanni User Management App

A Rails 8 + Inertia.js/React app for managing users: an admin dashboard with
live counts, full user CRUD with role management, bulk import from a
spreadsheet, and self-service profiles — built with Ruby 3.4.10 and Rails
~> 8.1 (the brief asked for Ruby 4.0+, which hasn't shipped a stable release;
3.4.10 is the closest real equivalent).

## Getting started

You'll need Ruby 3.4, Node 22, and PostgreSQL running locally (or use Docker
for Postgres — see below).

```bash
bundle install
bin/rails db:create db:migrate db:seed
bin/dev   # boots Rails + Vite together
```

No Postgres handy? Run one in Docker instead of installing it:

```bash
docker run -d --name umanni-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
```

Then open **http://localhost:3000** and log in with a seeded account:

| Role  | Email                  | Password      |
|-------|------------------------|---------------|
| Admin | `admin@umanni.test`    | `password123` |
| User  | `user1@umanni.test`    | `password123` |

(`user2@umanni.test`/`user3@umanni.test` also exist — see `db/seeds.rb`.)
New visitors can also self-register at `/register`.

## Taking a tour

- **As the admin**, you land on `/dashboard` after login: live user counts
  (updates in real time, no refresh needed) and a link to `/users`, where you
  can list, create, edit, and delete users, or toggle anyone's role. From
  there, **Import users** (`/imports/new`) lets you upload a `.csv`/`.xlsx`
  and watch it process live — a ready-to-use example is included at
  [`sample_users_import.csv`](sample_users_import.csv), so you can try it
  immediately without preparing your own file. Invalid rows are reported and
  skipped rather than failing the whole import.
- **As a regular user**, you land on your own profile: edit your name and
  avatar, or delete your account. Nothing outside your own record is
  reachable.
- The theme toggle (top right) and the **EN / PT** language switch next to
  it work everywhere in the app, not just on one page.

## A few things added beyond what was asked

Not required by the brief, but cheap enough to include along the way — noted
here so they don't go unnoticed rather than to make a big deal of them:

- A light/dark theme toggle (defaults to dark) and an English/Portuguese
  (pt-BR) language toggle, both applied app-wide.
- An actual small UI kit (buttons, cards, tables, a sidebar layout) instead
  of bare unstyled forms.
- Click-to-change avatar upload with an instant local preview, and the same
  "see what you picked before you commit" treatment for the CSV/XLSX import
  (filename, size, drag-and-drop).
- A custom app icon instead of the Rails default placeholder.
- Server-side rendering (SSR) for Inertia + React — see below.
- A Kamal 2 deploy config tailored to this app's real stack (Postgres, Solid
  Queue/Cable), not Kamal's generic defaults.
- `parallel_tests` actually wired up end-to-end (separate parallel test
  databases, CI running the suite in parallel) rather than just sitting in
  the Gemfile.

## Stack

- Ruby 3.4.10, Rails ~> 8.1
- PostgreSQL
- Inertia.js + React (Vite), Tailwind CSS
- Solid Queue / Solid Cable (no Redis)
- RSpec, FactoryBot, Capybara + Selenium, SimpleCov (90% minimum coverage)

## Running tests

```bash
bin/rspec
```

For faster runs, the suite can also be split across parallel workers with
[`parallel_tests`](https://github.com/grosser/parallel_tests):

```bash
bundle exec rails parallel:create parallel:load_schema # one-time setup
bundle exec parallel_rspec spec/
```

## Server-side rendering (SSR)

Inertia SSR is enabled (`config.ssr_enabled = true` in
`config/initializers/inertia_rails.rb`): `GET /session/new` (and every other
Inertia page) returns fully server-rendered HTML on the first response,
instead of an empty `<div id="app">` waiting for JS to hydrate — see the
`"server-renders the page content via Inertia SSR"` spec in
`spec/requests/sessions_spec.rb`.

The SSR entrypoint is `app/javascript/ssr/ssr.jsx` (same page resolution as
the client entrypoint); `@inertiajs/vite` turns it into a Node render server
at build time.

- **Development** (`bin/dev`): works automatically, no extra process needed.
- **Production**: `bin/vite build --ssr` builds the bundle (also runs as
  part of `assets:precompile`, e.g. in the Dockerfile); Puma then manages the
  render server itself via the `inertia_ssr` plugin (`config/puma.rb`), so a
  plain `bin/rails server`/`bin/thrust` boot is enough. If the SSR server
  isn't running for any reason, `inertia_rails` quietly falls back to normal
  client-side rendering instead of erroring.

## Docker

```bash
docker compose up
```

The production image ([`Dockerfile`](Dockerfile)) is a standard Rails 8
multi-stage build, verified end-to-end (`docker build -t umanni .`: gem
install, JS asset build via Vite, asset precompile). It runs behind
[Thruster](https://github.com/basecamp/thruster) as a zero-config HTTP proxy
in front of Puma.

### Kamal 2 deployment

[`config/deploy.yml`](config/deploy.yml) is a ready-to-customize [Kamal
2](https://kamal-deploy.org) config already shaped for this app (Postgres
accessory, Solid Queue/Cable, no Redis). There's no live server to deploy
to, so `image:`, `registry:`, and the host IPs are clearly-marked
placeholders — fill in a real registry and real hosts before `bin/kamal
deploy`. Validated with `bundle exec kamal config`.

---

## Development notes for this sandbox

The rest of this document is only relevant if you're running inside the
specific sandboxed environment this project was built in (no root/sudo). On
a normal machine with `apt install build-essential libpq-dev` and
Chrome/Chromium available (or a CI image like GitHub Actions'
`ubuntu-latest`), none of this applies — just follow **Getting started**
above.

<details>
<summary>Postgres, Ruby/gcc toolchain, and headless Chrome workarounds</summary>

### Postgres and the Ruby/gcc toolchain

- **Postgres** runs as a Docker container instead of a system service:
  ```bash
  docker run -d --name umanni-postgres -e POSTGRES_PASSWORD=postgres \
    -p 5432:5432 -v umanni-pgdata:/var/lib/postgresql/data postgres:16
  ```
  On a machine where the container already exists, just `docker start
  umanni-postgres`. It must be running before `bin/rails db:create`,
  `bin/rails db:migrate`, or the test suite will work — `config/database.yml`
  expects it on `localhost:5432` with user/password `postgres`/`postgres`
  (overridable via `DB_HOST`/`DB_USERNAME`/`DB_PASSWORD`).
- **Ruby/gcc**: installed via [mise](https://mise.jdx.dev) (`mise use -g
  ruby@3.4.10 node@22`). Since `apt install build-essential` wasn't possible
  either, native gems (e.g. `websocket-driver`, `nio4r`) compile against a
  user-space C toolchain assembled by `apt-get download`-ing `gcc-14`/`make`/
  `libpq-dev` `.deb`s and extracting them (`dpkg-deb -x`, no root needed) into
  `~/.local/toolchain`; `~/.local/toolchain/env.sh` puts that on `PATH` and
  sets `LD_LIBRARY_PATH`.
- **Parallel tests**: CI runs `parallel_rspec` at the default worker count
  (one per core). This sandbox has limited resources for running several
  headless Chrome instances at once, so use a lower count here, e.g.
  `bundle exec parallel_rspec spec/ -n 2`.

### Headless Chrome

For `spec/system/*`, driven by Capybara/Selenium: no `google-chrome`/
`chromium` package is installable without `apt`, so Chrome for Testing was
fetched as a portable build via `npx puppeteer browsers install chrome`
(extracted manually with Python's `zipfile` into
`~/.cache/puppeteer/chrome/<version>/chrome-linux64/` since `unzip` isn't
available either), its missing shared libs (`libnspr4`, `libnss3`,
`libasound2t64`, and friends — not on the base image) were pulled as
`noble` `.deb`s from `archive.ubuntu.com` and extracted with `dpkg-deb -x`
into `~/.local/chrome-libs`, and `chmod +x` was applied to
`chrome_crashpad_handler` inside the extracted build (its executable bit
doesn't survive the zip). To run system specs in this sandbox:

```bash
export LD_LIBRARY_PATH="$HOME/.local/chrome-libs"
export PATH="$HOME/.cache/puppeteer/chrome/<version>/chrome-linux64:$PATH"
bin/rspec spec/system
```

### Running the SSR-dependent spec on a clean checkout

The `"server-renders the page content via Inertia SSR"` spec in
`spec/requests/sessions_spec.rb` needs the SSR bundle built and its server
running to pass — on a clean checkout (or in CI, see
`.github/workflows/ci.yml`), run `bin/vite build --ssr --force` (`--force`
avoids a stale `tmp/cache/vite` skipping the rebuild if `public/vite-ssr/`
was removed without touching any source files) and `node
public/vite-ssr/ssr.js &` before `bin/rspec`; without it, that one spec
falls back to an empty `<div id="app">` and fails (every other spec is
unaffected).

</details>
