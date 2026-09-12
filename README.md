### AI Usage Disclosure

Parts of this project (backend and frontend code, tests, and this
documentation) were generated and refined with assistance from **Claude
Sonnet 5** (Anthropic), used as a coding assistant throughout development,
per Umanni's AI Policy in the test instructions.

# Umanni User Management App

A Rails 8 + Inertia.js/React application for managing users with role-based
access, a real-time admin dashboard, and async spreadsheet import.

## Stack

- Ruby 3.4.10, Rails ~> 8.1 (the README asked for Ruby 4.0+, which has not
  been released as a stable version; 3.4.10 is the latest stable 3.x).
- PostgreSQL
- Inertia.js + React (Vite), Tailwind CSS
- Solid Queue / Solid Cable (no Redis)
- RSpec, FactoryBot, Capybara + Selenium, SimpleCov (90% minimum coverage)

## Setup

```bash
bundle install
bin/rails db:create db:migrate db:seed
bin/dev # boots Rails + Vite
```

Once running, visit `/register` to create an account, or `/session/new`
(also the root path) to log in with a seeded account below. A logged-in
admin lands on the dashboard (`/dashboard`), with real-time counts and a
`/users` CRUD screen; a logged-in regular user lands on their profile
(`/profile`), which can be edited at `/profile/edit` (full name and avatar)
or deleted from there. Avatar upload is file-only (no remote-URL input, per
the design spec) and validated server-side (`ActiveStorage`,
content-type/size) — see
`docs/superpowers/specs/2026-09-11-user-management-app-design.md` for
details.

From `/users`, an admin can also bulk-import users at `/imports/new` by
uploading a `.csv` or `.xlsx` spreadsheet (parsed with the `roo` gem). Rows
are created asynchronously via Solid Queue, with live progress (processed
count, status, and any per-row errors) streamed back over Solid Cable to the
import page; invalid rows are skipped and reported rather than aborting the
whole import. A ready-to-use sample file is included at
[`sample_users_import.csv`](sample_users_import.csv) for trying this out.

Default seeded accounts (see `db/seeds.rb`):
- Admin: `admin@umanni.test` / `password123`
- Users: `user1@umanni.test` .. `user3@umanni.test` / `password123`

## Server-side rendering (SSR)

Inertia SSR is enabled (`config.ssr_enabled = true` in
`config/initializers/inertia_rails.rb`), satisfying the "Advanced SSR"
extra-points item: `GET /session/new` (and every other Inertia page) returns
fully server-rendered HTML on the first response, not an empty `<div
id="app">` waiting for JS to hydrate — see the
`"server-renders the page content via Inertia SSR"` spec in
`spec/requests/sessions_spec.rb`.

The SSR entrypoint is `app/javascript/ssr/ssr.jsx` (same `createInertiaApp`
page resolution as the client entrypoint); `@inertiajs/vite` transforms it
into a Node render server at build time.

- **Development** (`bin/dev`): works automatically — the running `bin/vite
  dev` process serves SSR requests itself, no extra process needed.
- **Production**: build the bundle with `bin/vite build --ssr` (also runs
  automatically as part of `assets:precompile`, e.g. in the Dockerfile), then
  run it with `bin/vite ssr` (or `node public/vite-ssr/ssr.js`). Puma
  auto-manages this process via the `inertia_ssr` plugin (see
  `config/puma.rb`), so a plain `bin/rails server`/`bin/thrust` boot is
  enough — no separate process to start by hand. If the SSR server isn't
  running for any reason, `inertia_rails` silently falls back to normal
  client-side rendering rather than erroring.

The `"server-renders the page content via Inertia SSR"` spec in
`spec/requests/sessions_spec.rb` needs the SSR bundle built and its server
running to pass — on a clean checkout (or in CI, see `.github/workflows/ci.yml`),
run `bin/vite build --ssr --force` (`--force` avoids a stale
`tmp/cache/vite` skipping the rebuild if `public/vite-ssr/` was removed
without touching any source files) and `node public/vite-ssr/ssr.js &`
before `bin/rspec`; without it, that one spec falls back to an empty
`<div id="app">` and fails (every other spec is unaffected).

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

## Docker

```bash
docker compose up
```

The production image ([`Dockerfile`](Dockerfile)) is a standard Rails 8
multi-stage build (gems/JS assets compiled in a `build` stage, copied into a
slim runtime stage). It runs behind
[Thruster](https://github.com/basecamp/thruster) (`gem "thruster"` in the
Gemfile, `CMD ["./bin/thrust", "./bin/rails", "server"]`) as a zero-config
HTTP proxy in front of Puma, handling asset caching/compression and
X-Sendfile acceleration without extra web-server config. `docker build -t
umanni .` has been verified to produce a working image end-to-end (gem
install, JS asset build via Vite, asset precompile).

### Kamal 2 deployment

[`config/deploy.yml`](config/deploy.yml) is a ready-to-customize [Kamal
2](https://kamal-deploy.org) config for this app specifically — service
name, and a Postgres `accessory` + `DB_HOST`/database-password env vars
matching this app's actual stack (Postgres, Solid Queue/Solid Cable, no
Redis) instead of Kamal's generic SQLite/MySQL/Redis defaults.
`RAILS_MASTER_KEY` is wired through `.kamal/secrets` the same way
`.github/workflows/ci.yml` supplies it in CI. There is no live server to
deploy this app to, so `image:`, `registry:`, and the server/accessory IPs
are clearly-marked placeholders — a real registry and real hosts must be
filled in before `bin/kamal deploy` would actually work. Validated with
`bundle exec kamal config`.

## Local development notes (this sandbox)

This sandbox has no root/sudo, so Postgres, the Ruby native-extension
toolchain, and headless Chrome are **not** installed via `apt`/system
services. None of this applies on a normal machine with `apt install
build-essential libpq-dev` and Chrome/Chromium available (or a CI image like
GitHub Actions' `ubuntu-latest`, which ships Chrome).

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
  ruby@3.4.10 node@22`). Since no `apt install build-essential` was possible
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
